// app/checkout/pay/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart, formatMoney } from "@/components/cart/CartProvider";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function CheckoutPayPage() {
  const supabase = createSupabaseBrowserClient();
  const { items, totalItems, subtotalCents } = useCart();

  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setUserId(data.user?.id ?? null);
      setEmail(data.user?.email ?? null);
      setLoadingUser(false);

      if (!data.user) window.location.href = "/login?next=/checkout";
    });

    return () => {
      mounted = false;
    };
  }, [supabase]);

  async function startCheckout() {
    setError(null);

    if (!userId || !email) {
      setError("You must be logged in to checkout.");
      return;
    }
    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setPaying(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          email,
          items: items.map((it) => ({ variantId: it.variantId, quantity: it.quantity })),
        }),
      });

      const text = await res.text();
      const json = text ? JSON.parse(text) : null;

      if (!res.ok) throw new Error(json?.error ?? `Checkout failed (${res.status})`);
      if (!json?.url) throw new Error("Missing checkout url from server");

      window.location.href = json.url;
    } catch (e: any) {
      setError(e?.message ?? "Checkout failed");
      setPaying(false);
    }
  }

  if (loadingUser) return <div className="mx-auto max-w-2xl px-6 py-24">Loading…</div>;

  return (
    <main className="relative overflow-hidden">
      <div className="mx-auto max-w-screen-2xl px-6 py-24">
        <h1 className="text-4xl font-semibold tracking-tight">Checkout</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Review your order and pay securely with Stripe.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8 space-y-4">
            {items.map((it) => (
              <div key={it.variantId} className="flex gap-4 rounded-3xl border border-border bg-card p-4">
                <div className="h-20 w-28 rounded-2xl bg-cover bg-center" style={{ backgroundImage: `url(${it.imageUrl})` }} />
                <div className="flex-1 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-semibold">{it.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatMoney(it.unitPriceCents)} × {it.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">{formatMoney(it.unitPriceCents * it.quantity)}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-4">
            <div className="rounded-3xl border border-border bg-card p-6 sticky top-24">
              <p className="text-lg font-semibold">Summary</p>

              <div className="mt-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Items</span>
                <span className="font-medium">{totalItems}</span>
              </div>

              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatMoney(subtotalCents)}</span>
              </div>

              <div className="mt-4 border-t border-border pt-4 flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="font-semibold">{formatMoney(subtotalCents)}</span>
              </div>

              {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

              <button
                onClick={startCheckout}
                disabled={paying || items.length === 0}
                className="mt-5 inline-flex w-full justify-center rounded-md bg-lime-300 px-4 py-3 text-sm font-semibold text-black hover:bg-lime-200 transition disabled:opacity-60"
              >
                {paying ? "Redirecting…" : "Pay with Stripe"}
              </button>

              <Link
                href="/cart"
                className="mt-3 inline-flex w-full justify-center rounded-md border border-border bg-background px-4 py-3 text-sm font-semibold hover:bg-accent transition"
              >
                Back to cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}