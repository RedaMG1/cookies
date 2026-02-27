// app/menu/page.tsx
"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/products/ProductsCard";
import {
  fetchProductsFromSupabase,
  getCheapestVariant,
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
        setError(null);
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
      {/* warm bakery background */}
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

      <div className="mx-auto max-w-screen-2xl px-6 py-24">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Menu</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Explore our cookies. Click “Order now” to add to cart.
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
                <div key={i} className="h-[360px] rounded-3xl border border-border bg-card animate-pulse" />
              ))
            : products.map((p) => {
                const cheapest = getCheapestVariant(p.product_variants);
                if (!cheapest) return null;

                return (
                  <ProductCard
                    key={p.id}
                    productId={p.id}
                    productName={p.name}
                    productSlug={p.slug}
                    description={p.description ?? "Fresh baked goodness."}
                    imageUrl={getPrimaryImage(p.product_images)}
                    featured={p.featured}
                    cheapestVariantId={cheapest.id}
                    cheapestPriceCents={cheapest.price_cents}
                  />
                );
              })}
        </div>
      </div>
    </main>
  );
}