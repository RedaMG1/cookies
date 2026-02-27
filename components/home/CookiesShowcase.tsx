// components/home/CookiesShowcase.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Cookie } from "lucide-react";

import {
  fetchProductsFromSupabase,
  formatMoney,
  getFromPriceCents,
  getPrimaryImage,
  SupabaseProduct,
} from "@/lib/products.supabase";

import { useCart } from "@/components/cart/CartProvider";

export function CookiesShowcase() {
  const { addItem } = useCart();

  const [items, setItems] = useState<SupabaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchProductsFromSupabase();
        const six = data.slice(0, 6);

        if (mounted) setItems(six);
      } catch (e: any) {
        if (mounted) setError(e?.message ?? "Failed to load cookies");
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="relative overflow-hidden py-16 md:py-20">
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

      <div className="mx-auto max-w-screen-2xl px-6">
        {/* header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs text-black/70 backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-white/70">
              <Cookie className="h-4 w-4" />
              Today’s cookie lineup
            </div>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Pick your next bite
            </h2>

            <p className="mt-2 max-w-xl text-sm text-black/60 dark:text-white/70">
              A small selection of our current favorites. Fresh baked batches
              with premium ingredients.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black shadow-sm transition hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            View all cookies <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* error */}
        {error ? (
          <div className="mt-10 rounded-2xl border border-black/10 bg-white/70 p-4 text-sm text-black/70 backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-white/70">
            {error}
          </div>
        ) : null}

        {/* grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="h-[360px] rounded-3xl border border-black/10 bg-white/70 shadow-sm backdrop-blur-md animate-pulse dark:border-white/10 dark:bg-white/5"
                />
              ))
            : items.map((p) => {
                const imageUrl = getPrimaryImage(p.product_images);
                const fromCents = getFromPriceCents(p.product_variants);
                const fromPrice = formatMoney(fromCents);

                return (
                  <article
                    key={p.id}
                    className="group relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm transition
                               hover:-translate-y-1 hover:shadow-lg
                               dark:border-white/10 dark:bg-white/5"
                  >
                    {/* image */}
                    <div className="relative h-52 overflow-hidden">
                      <div
                        className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-[1.05]"
                        style={{ backgroundImage: `url(${imageUrl})` }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                      {p.featured ? (
                        <div className="absolute left-4 top-4 rounded-full bg-lime-300 px-3 py-1 text-xs font-semibold text-black">
                          Featured
                        </div>
                      ) : null}

                      <div className="absolute right-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                        from {fromPrice}
                      </div>
                    </div>

                    {/* content */}
                    <div className="p-5">
                      <h3 className="text-lg font-semibold">{p.name}</h3>
                      <p className="mt-1 text-sm text-black/60 dark:text-white/70 line-clamp-2">
                        {p.description ?? "Fresh baked goodness."}
                      </p>

                      <div className="mt-5 flex items-center justify-between gap-3">
                        <Link
                          href={`/menu/${p.slug}`}
                          className="text-sm font-medium text-black/80 hover:text-black dark:text-white/80 dark:hover:text-white"
                        >
                          View details
                        </Link>

                        <div className="flex items-center gap-2">
                          {/* ✅ Add to cart */}
                          <button
                            onClick={() =>
                              addItem(
                                {
                                  id: p.id,
                                  name: p.name,
                                  slug: p.slug,
                                  imageUrl,
                                  unitPriceCents: fromCents,
                                },
                                1
                              )
                            }
                            className="rounded-md border border-black/10 bg-white px-3 py-2 text-sm font-semibold text-black shadow-sm transition hover:bg-black/5
                                       dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
                          >
                            Add to cart
                          </button>

                          {/* ✅ Order = go to cart */}
                          <Link
                            href="/cart"
                            className="rounded-md bg-lime-300 px-4 py-2 text-sm font-semibold text-black transition hover:bg-lime-200"
                          >
                            Order now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
        </div>
      </div>
    </section>
  );
}