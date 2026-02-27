// components/products/ProductCard.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ProductCard({
  name,
  description,
  imageUrl,
  fromPrice,
  href,
  tags,
  featured,
}: {
  name: string;
  description: string;
  imageUrl: string;
  fromPrice: string;
  href: string;
  tags?: string[];
  featured?: boolean;
}) {
  return (
    <article className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-56 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-[1.05]"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {featured ? (
            <span className="rounded-full bg-lime-300 px-3 py-1 text-xs font-semibold text-black">
              Featured
            </span>
          ) : null}

          {(tags ?? []).slice(0, 2).map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/90 backdrop-blur"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="absolute right-4 top-4 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
          from {fromPrice}
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
          {description}
        </p>

        <div className="mt-5 flex items-center justify-between">
          <Link
            href={href}
            className="text-sm font-medium text-foreground/80 hover:text-foreground"
          >
            View details
          </Link>

          <Link
            href="/menu"
            className="inline-flex items-center gap-2 rounded-md bg-lime-300 px-4 py-2 text-sm font-medium text-black transition hover:bg-lime-200"
          >
            Order <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}