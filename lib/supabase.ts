// lib/cart.supabase.ts
import { supabase } from "@/lib/supabase/client";

export type DbCartItem = {
  variant_id: string;
  quantity: number;
  unit_price_cents: number;
};

export async function getOrCreateActiveCartId(userId: string) {
  const { data: existing, error: findErr } = await supabase
    .from("carts")
    .select("id")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (findErr) throw new Error(findErr.message);
  if (existing?.id) return existing.id as string;

  const { data: created, error: createErr } = await supabase
    .from("carts")
    .insert({ user_id: userId, status: "active", currency: "usd" })
    .select("id")
    .single();

  if (createErr) throw new Error(createErr.message);
  return created.id as string;
}

export async function replaceCartItems(cartId: string, items: DbCartItem[]) {
  const { error: delErr } = await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cartId);

  if (delErr) throw new Error(delErr.message);

  if (items.length === 0) return;

  const payload = items.map((it) => ({
    cart_id: cartId,
    variant_id: it.variant_id,
    quantity: it.quantity,
    unit_price_cents: it.unit_price_cents,
  }));

  const { error: upErr } = await supabase.from("cart_items").upsert(payload, {
    onConflict: "cart_id,variant_id",
  });

  if (upErr) throw new Error(upErr.message);
}

export async function fetchCartItems(cartId: string) {
  const { data, error } = await supabase
    .from("cart_items")
    .select(
      `
      variant_id,
      quantity,
      unit_price_cents,
      product_variants (
        id,
        name,
        price_cents,
        products (
          id,
          name,
          slug,
          product_images ( path, is_primary, sort_order )
        )
      )
    `
    )
    .eq("cart_id", cartId);

  if (error) throw new Error(error.message);
  return data ?? [];
}