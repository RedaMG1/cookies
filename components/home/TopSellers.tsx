// components/home/TopSellers.tsx
import Link from "next/link";
import { ArrowRight, Sparkles, Star } from "lucide-react";

type TopSeller = {
  name: string;
  description: string;
  price: string;
  rating: number;
  tags: string[];
  href: string;
  imageUrl: string;
  featured?: boolean;
};

const TOP_SELLERS: TopSeller[] = [
  {
    name: "Chocolate Chunk + Sea Salt",
    description: "Crispy edges, gooey center, and a perfect salty finish.",
    price: "$3.50",
    rating: 4.9,
    tags: ["Best seller", "Gooey", "Classic"],
    href: "/menu/chocolate-chunk",
    imageUrl:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=2400&q=80",
    featured: true,
  },
  {
    name: "Red Velvet Cream",
    description: "Soft red velvet with a creamy middle — extra indulgent.",
    price: "$3.80",
    rating: 4.8,
    tags: ["Soft", "Creamy"],
    href: "/menu/red-velvet",
    imageUrl:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=2400&q=80",
  },
  {
    name: "Peanut Butter Melt",
    description: "Rich peanut butter flavor with a melt-in-your-mouth bite.",
    price: "$3.60",
    rating: 4.7,
    tags: ["Nutty", "Fan favorite"],
    href: "/menu/peanut-butter",
    imageUrl:
      "https://images.unsplash.com/photo-1509440159598-8b9f6937f2a6?auto=format&fit=crop&w=2400&q=80",
  },
];

function Rating({ value }: { value: number }) {
  const full = Math.round(value);
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={[
              "h-4 w-4",
              i < full ? "text-lime-300" : "text-white/30",
            ].join(" ")}
            fill="currentColor"
          />
        ))}
      </div>
      <span className="text-xs text-white/70">{value.toFixed(1)}</span>
    </div>
  );
}

export function TopSellers() {
  const featured = TOP_SELLERS.find((p) => p.featured) ?? TOP_SELLERS[0];
  const others = TOP_SELLERS.filter((p) => p !== featured);

  return (
    <section className="relative overflow-hidden py-16 md:py-20">
      {/* ------------------------------ */}
      {/* Warm bakery background (FULL)  */}
      {/* ------------------------------ */}

      {/* Warm glow from top-left */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10
        bg-[radial-gradient(1200px_520px_at_18%_-10%,rgba(255,215,140,0.60),transparent_60%)]
        dark:bg-[radial-gradient(1200px_520px_at_18%_-10%,rgba(255,215,140,0.20),transparent_60%)]"
      />

      {/* Cream base */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10
        bg-gradient-to-b from-[#FFF7E6] via-[#FFF1D2] to-[#FFFFFF]
        dark:from-[#0B0B0B] dark:via-[#0B0B0B] dark:to-[#0B0B0B]"
      />

      {/* Cookie “crumb” glows in gutters */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-56 top-10 -z-10 h-[520px] w-[520px] rounded-full bg-amber-400/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-56 bottom-8 -z-10 h-[520px] w-[520px] rounded-full bg-orange-400/20 blur-3xl"
      />

      {/* Subtle grain (warm texture) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.06]
        [background-image:radial-gradient(#000_1px,transparent_0)]
        [background-size:22px_22px]"
      />

      {/* ------------------------------ */}
      {/* Content                        */}
      {/* ------------------------------ */}
      <div className="mx-auto max-w-screen-2xl px-6">
        {/* heading row */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/70 px-3 py-1 text-xs text-black/70 backdrop-blur-md dark:border-white/10 dark:bg-white/5 dark:text-white/70">
              <Sparkles className="h-4 w-4" />
              Top sellers this week
            </div>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight md:text-4xl">
              Customer favorites
            </h2>

            <p className="mt-2 max-w-xl text-sm text-black/60 dark:text-white/70">
              These are the cookies people come back for. Fresh batches, premium
              ingredients, and the kind of bite that makes you close your eyes.
            </p>
          </div>

          <Link
            href="/menu"
            className="inline-flex items-center justify-center gap-2 rounded-md border border-black/10 bg-white px-4 py-2 text-sm font-medium text-black shadow-sm transition hover:bg-black/5 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            See full menu <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* cards */}
        <div className="mt-10 grid gap-6 lg:grid-cols-12">
          {/* featured card */}
          <article className="group relative min-h-[420px] overflow-hidden rounded-3xl border border-black/10 bg-black lg:col-span-7 dark:border-white/10">
            {/* image */}
            <div
              className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-[1.04]"
              style={{ backgroundImage: `url(${featured.imageUrl})` }}
            />
            {/* overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/35 to-black/70" />

            <div className="relative flex h-full flex-col justify-between p-6 md:p-8">
              {/* top chips */}
              <div className="flex flex-wrap items-center gap-2">
                {featured.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/80 backdrop-blur"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* bottom content */}
              <div>
                <Rating value={featured.rating} />

                <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                  {featured.name}
                </h3>

                <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/75">
                  {featured.description}
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-baseline gap-2 text-white">
                    <span className="text-2xl font-semibold">{featured.price}</span>
                    <span className="text-xs text-white/70">per cookie</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href={featured.href}
                      className="rounded-md bg-lime-300 px-4 py-2 text-sm font-medium text-black transition hover:bg-lime-200"
                    >
                      View details
                    </Link>
                    <Link
                      href="/menu"
                      className="rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/15"
                    >
                      Order now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* two smaller cards */}
          <div className="grid gap-6 lg:col-span-5">
            {others.map((p) => (
              <article
                key={p.name}
                className="group relative overflow-hidden rounded-3xl border border-black/10 bg-black p-6 dark:border-white/10"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-[1.04]"
                  style={{ backgroundImage: `url(${p.imageUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/35 to-black/70" />

                <div className="relative">
                  <div className="flex flex-wrap items-center gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/80 backdrop-blur"
                      >
                        {t}
                      </span>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <Rating value={p.rating} />
                    <span className="text-sm font-semibold text-white">{p.price}</span>
                  </div>

                  <h3 className="mt-3 text-xl font-semibold text-white">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-sm text-white/75">{p.description}</p>

                  <div className="mt-5 flex items-center justify-between">
                    <Link
                      href={p.href}
                      className="text-sm font-medium text-lime-300 hover:text-lime-200"
                    >
                      View details
                    </Link>

                    <Link
                      href="/menu"
                      className="rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur transition hover:bg-white/15"
                    >
                      Order
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <p className="mt-8 text-xs text-black/50 dark:text-white/50">
          Tip: replace the product names, prices and links with your real cookie
          catalog when you create the Menu page.
        </p>
      </div>
    </section>
  );
}