// components/home/CookiesShowcase.tsx
import Link from "next/link";
import { ArrowRight, Cookie } from "lucide-react";

type CookieItem = {
  name: string;
  note: string;
  price: string;
  tags: string[];
  imageUrl: string;
  href: string; // for now we can link to /menu (later: /menu/[slug])
};

const COOKIES: CookieItem[] = [
  {
    name: "Chocolate Chunk",
    note: "Gooey center, crispy edge, real chocolate chunks.",
    price: "$3.50",
    tags: ["Classic", "Best seller"],
    imageUrl:
      "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1800&q=80",
    href: "/menu",
  },
  {
    name: "Red Velvet Cream",
    note: "Soft red velvet with a creamy middle.",
    price: "$3.80",
    tags: ["Soft", "Creamy"],
    imageUrl:
      "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1800&q=80",
    href: "/menu",
  },
  {
    name: "Peanut Butter Melt",
    note: "Nutty, rich, melt-in-your-mouth bite.",
    price: "$3.60",
    tags: ["Nutty", "Fan favorite"],
    imageUrl:
      "https://images.unsplash.com/photo-1509440159598-8b9f6937f2a6?auto=format&fit=crop&w=1800&q=80",
    href: "/menu",
  },
  {
    name: "Double Chocolate",
    note: "Cocoa dough + chocolate chips. Deep & fudgy.",
    price: "$3.70",
    tags: ["Chocolate", "Fudgy"],
    imageUrl:
      "https://images.unsplash.com/photo-1519869325930-281384150729?auto=format&fit=crop&w=1800&q=80",
    href: "/menu",
  },
  {
    name: "Oatmeal Raisin",
    note: "Chewy oats, warm spice, lightly sweet.",
    price: "$3.30",
    tags: ["Chewy", "Cozy"],
    imageUrl:
      "https://images.unsplash.com/photo-1600369672770-985fd30004eb?auto=format&fit=crop&w=1800&q=80",
    href: "/menu",
  },
  {
    name: "Salted Caramel",
    note: "Caramel pockets with a little salt finish.",
    price: "$3.90",
    tags: ["Caramel", "Premium"],
    imageUrl:
      "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1800&q=80",
    href: "/menu",
  },
];

export function CookiesShowcase() {
  return (
    <section className="relative overflow-hidden py-16 md:py-20">
      {/* Full-width background to avoid “empty sides” feeling */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10
        bg-gradient-to-b from-white via-white to-black/[0.03]
        dark:from-black dark:via-black dark:to-white/[0.04]"
      />

      {/* subtle blobs */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-56 top-10 -z-10 h-[440px] w-[440px] rounded-full bg-lime-300/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-56 bottom-10 -z-10 h-[440px] w-[440px] rounded-full bg-amber-300/10 blur-3xl"
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

        {/* grid */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {COOKIES.map((c) => (
            <article
              key={c.name}
              className="group relative overflow-hidden rounded-3xl border border-black/10 bg-white shadow-sm transition
                         hover:-translate-y-1 hover:shadow-lg
                         dark:border-white/10 dark:bg-white/5"
            >
              {/* image */}
              <div className="relative h-52 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-[1.05]"
                  style={{ backgroundImage: `url(${c.imageUrl})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                {/* tags */}
                <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                  {c.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs text-white/90 backdrop-blur"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                {/* price pill */}
                <div className="absolute right-4 top-4 rounded-full bg-black/50 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                  {c.price}
                </div>
              </div>

              {/* content */}
              <div className="p-5">
                <h3 className="text-lg font-semibold">{c.name}</h3>
                <p className="mt-1 text-sm text-black/60 dark:text-white/70">
                  {c.note}
                </p>

                <div className="mt-5 flex items-center justify-between">
                  <Link
                    href={c.href}
                    className="text-sm font-medium text-black/80 hover:text-black dark:text-white/80 dark:hover:text-white"
                  >
                    View details
                  </Link>

                  <Link
                    href="/menu"
                    className="rounded-md bg-lime-300 px-4 py-2 text-sm font-medium text-black transition hover:bg-lime-200"
                  >
                    Order
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}