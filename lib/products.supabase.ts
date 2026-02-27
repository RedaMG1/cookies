// lib/products.supabase.ts
import { supabase } from "@/lib/supabase";

export type SupabaseProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  featured: boolean;
  status: "draft" | "active" | "archived";
  product_images: { path: string; is_primary: boolean; sort_order: number }[];
  product_variants: { price_cents: number; name: string; active: boolean; sort_order: number }[];
};

export async function fetchProductsFromSupabase() {
  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      slug,
      description,
      featured,
      status,
      product_images ( path, is_primary, sort_order ),
      product_variants ( price_cents, name, active, sort_order )
    `
    )
    .eq("status", "active")
    .order("featured", { ascending: false })
    .order("name", { ascending: true });

  if (error) throw new Error(error.message);
  return (data ?? []) as SupabaseProduct[];
}

export function getPrimaryImage(images: SupabaseProduct["product_images"]) {
  if (!images || images.length === 0) {
    return "https://placehold.co/1200x800?text=Cookie";
  }
  return (
    images.find((i) => i.is_primary)?.path ||
    images.sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))[0]?.path ||
    "https://placehold.co/1200x800?text=Cookie"
  );
}

export function getFromPriceCents(variants: SupabaseProduct["product_variants"]) {
  const active = (variants ?? []).filter((v) => v.active);
  if (active.length === 0) return 0;
  return active
    .map((v) => v.price_cents)
    .reduce((min, val) => Math.min(min, val), active[0].price_cents);
}

export function formatMoney(cents: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency,
  }).format((cents || 0) / 100);
}