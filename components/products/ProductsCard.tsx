"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useCart } from "@/components/cart/CartProvider";

export function ProductCard({
  productId,
  productName,
  productSlug,
  description,
  imageUrl,
  featured,
  cheapestVariantId,
  cheapestPriceCents,
}: {
  productId: string;
  productName: string;
  productSlug: string;
  description: string;
  imageUrl: string;
  featured?: boolean;
  cheapestVariantId: string;
  cheapestPriceCents: number;
}) {
  const { addItem } = useCart();

  function addToCartOnly() {
    addItem(
      {
        variantId: cheapestVariantId,
        productName,
        productSlug,
        imageUrl,
        unitPriceCents: cheapestPriceCents,
      },
      1
    );
  }

  function orderNow() {
    addToCartOnly();
    window.location.href = "/cart";
  }

  return (
    <article className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      {/* hover glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100
        bg-[radial-gradient(600px_200px_at_20%_0%,rgba(190,255,90,0.30),transparent_60%)]"
      />

      <div className="relative h-56 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-[1.06]"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

        {featured ? (
          <div className="absolute left-4 top-4 rounded-full bg-lime-300 px-3 py-1 text-xs font-semibold text-black shadow-sm">
            Featured
          </div>
        ) : null}

        <div className="absolute right-4 top-4 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          from ${(cheapestPriceCents / 100).toFixed(2)}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold">{productName}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{description}</p>

        <div className="mt-5 flex items-center justify-between gap-3">
          <Link
            href={`/menu/${productSlug}`}
            className="text-sm font-medium text-foreground/80 hover:text-foreground underline-offset-4 hover:underline"
          >
            View details
          </Link>

          <div className="flex items-center gap-2">
            {/* Add to cart */}
            <button
              onClick={addToCartOnly}
              className="rounded-md border border-border bg-background px-3 py-2 text-sm font-semibold
              hover:bg-accent transition active:scale-[0.98]"
            >
              Add to cart
            </button>

            {/* Order now */}
            <button
              onClick={orderNow}
              className="inline-flex items-center gap-2 rounded-md bg-lime-300 px-4 py-2 text-sm font-semibold text-black
              transition hover:bg-lime-200 active:scale-[0.98]"
            >
              Order now <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}