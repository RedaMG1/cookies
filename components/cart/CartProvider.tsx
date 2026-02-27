// components/cart/CartProvider.tsx
"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { DbCartItem, fetchCartItems, getOrCreateActiveCartId, replaceCartItems } from "@/lib/cart.supabase";

export type CartItem = {
  variantId: string;
  productName: string;
  productSlug: string;
  imageUrl: string;
  unitPriceCents: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  subtotalCents: number;
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (variantId: string) => void;
  setQuantity: (variantId: string, qty: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "cookie_shop_cart_v2";
const MERGE_KEY_PREFIX = "cookie_shop_cart_merged_user_"; // + userId

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function pickPrimaryImage(images: any[]) {
  if (!images || images.length === 0) return "https://placehold.co/1200x800?text=Cookie";
  return (
    images.find((i) => i.is_primary)?.path ||
    images.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))[0]?.path
  );
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const supabase = createSupabaseBrowserClient();

  const [items, setItems] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [cartId, setCartId] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  // Load local cart once
  useEffect(() => {
    setItems(loadCart());
    setHydrated(true);
  }, []);

  // Save local always
  useEffect(() => {
    if (!hydrated) return;
    saveCart(items);
  }, [items, hydrated]);

  // Track auth
  useEffect(() => {
    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setUserId(data.user?.id ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_evt, session) => {
      setUserId(session?.user?.id ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  // On login: merge ONLY ONCE per user (prevents refresh duplication)
  useEffect(() => {
    if (!hydrated) return;
    if (!userId) {
      setCartId(null);
      return;
    }

    let cancelled = false;

    (async () => {
      const cid = await getOrCreateActiveCartId(userId);
      if (cancelled) return;
      setCartId(cid);

      const mergeKey = `${MERGE_KEY_PREFIX}${userId}`;
      const alreadyMerged = localStorage.getItem(mergeKey) === "1";

      // Always load DB cart as base
      const dbRows = await fetchCartItems(cid);

      const dbItems: CartItem[] = dbRows.map((row: any) => {
        const product = row.product_variants?.products;
        const images = product?.product_images ?? [];
        return {
          variantId: row.variant_id,
          productName: product?.name ?? "Cookie",
          productSlug: product?.slug ?? "",
          imageUrl: pickPrimaryImage(images),
          unitPriceCents: row.unit_price_cents,
          quantity: row.quantity,
        };
      });

      // If we already merged before, DO NOT add local quantities again.
      // Just take DB cart as source of truth and also overwrite local.
      if (alreadyMerged) {
        if (!cancelled) setItems(dbItems);
        return;
      }

      // First time merge: DB + local (sum)
      const map = new Map<string, CartItem>();
      for (const it of dbItems) map.set(it.variantId, it);
      for (const it of items) {
        const ex = map.get(it.variantId);
        if (ex) map.set(it.variantId, { ...ex, quantity: ex.quantity + it.quantity });
        else map.set(it.variantId, it);
      }

      const merged = Array.from(map.values());

      // Push merged to DB
      const payload: DbCartItem[] = merged.map((it) => ({
        variant_id: it.variantId,
        quantity: it.quantity,
        unit_price_cents: it.unitPriceCents,
      }));

      await replaceCartItems(cid, payload);

      // Mark merged so refresh doesn't duplicate
      localStorage.setItem(mergeKey, "1");

      if (!cancelled) setItems(merged);
    })().catch(console.error);

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, hydrated]);

  // While logged in: keep DB in sync when items change
  useEffect(() => {
    if (!hydrated) return;
    if (!userId || !cartId) return;

    (async () => {
      const payload: DbCartItem[] = items.map((it) => ({
        variant_id: it.variantId,
        quantity: it.quantity,
        unit_price_cents: it.unitPriceCents,
      }));
      await replaceCartItems(cartId, payload);
    })().catch(console.error);
  }, [items, userId, cartId, hydrated]);

  const addItem: CartContextValue["addItem"] = (item, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((p) => p.variantId === item.variantId);
      if (existing) {
        return prev.map((p) =>
          p.variantId === item.variantId ? { ...p, quantity: p.quantity + qty } : p
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
  };

  const removeItem: CartContextValue["removeItem"] = (variantId) => {
    setItems((prev) => prev.filter((p) => p.variantId !== variantId));
  };

  const setQuantity: CartContextValue["setQuantity"] = (variantId, qty) => {
    const safe = Math.max(1, Math.min(99, qty));
    setItems((prev) => prev.map((p) => (p.variantId === variantId ? { ...p, quantity: safe } : p)));
  };

  const clear: CartContextValue["clear"] = () => setItems([]);

  const totalItems = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items]);
  const subtotalCents = useMemo(
    () => items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{ items, totalItems, subtotalCents, addItem, removeItem, setQuantity, clear }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

export function formatMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format((cents || 0) / 100);
}