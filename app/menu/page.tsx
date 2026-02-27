// app/menu/page.tsx
"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/products/ProductsCard";
import {
  fetchProductsFromSupabase,
  formatMoney,
  getFromPriceCents,
  getPrimaryImage,
  SupabaseProduct,
} from "@/lib/products.supabase";

export default function MenuPage() {
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        const data = await fetchProductsFromSupabase();
        if (mounted) setProducts(data);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? "Failed to load products");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="relative overflow-hidden">
      {/* Warm bakery background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10
        bg-[radial-gradient(1200px_520px_at_18%_-10%,rgba(255,215,140,0.60),transparent_60%)]
        dark:bg-[radial-gradient(1200px_520px_at_18%_-10%,rgba(255,215,140,0.20),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10
        bg-gradient-to-b from-[#FFF7E6] via-[#FFF1D2] to-[#FFFFFF]
        dark:from-[#0B0B0B] dark:via-[#0B0B0B] dark:to-[#0B0B0B]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-56 top-10 -z-10 h-[520px] w-[520px] rounded-full bg-amber-400/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-56 bottom-8 -z-10 h-[520px] w-[520px] rounded-full bg-orange-400/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.06]
        [background-image:radial-gradient(#000_1px,transparent_0)]
        [background-size:22px_22px]"
      />

      <div className="mx-auto max-w-screen-2xl px-6 py-24">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Menu</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Explore our cookies. Pick your favorite, choose a box size, and order.
            </p>
          </div>

          <div className="text-sm text-muted-foreground">
            {loading ? "Loading…" : `${products.length} cookies`}
          </div>
        </div>

        {error ? (
          <div className="mt-10 rounded-2xl border border-border bg-card p-4">
            <p className="text-sm font-medium">Couldn’t load products</p>
            <p className="mt-1 text-sm text-muted-foreground">{error}</p>
          </div>
        ) : null}

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[360px] rounded-3xl border border-border bg-card animate-pulse"
                />
              ))
            : products.map((p) => (
                <ProductCard
                  key={p.id}
                  name={p.name}
                  description={p.description ?? "Fresh baked goodness."}
                  imageUrl={getPrimaryImage(p.product_images)}
                  fromPrice={formatMoney(getFromPriceCents(p.product_variants))}
                  href={`/menu/${p.slug}`} // details page later
                  featured={p.featured}
                />
              ))}
        </div>
      </div>
    </main>
  );
}