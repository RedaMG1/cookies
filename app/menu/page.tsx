// app/menu/page.tsx
import { PRODUCTS } from "@/data/products";
import { ProductCard } from "@/components/products/ProductsCard";

export default function MenuPage() {
  return (
    <main className="relative overflow-hidden">
      {/* background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-35 dark:opacity-25
        bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.10)_1px,transparent_0)]
        dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.16)_1px,transparent_0)]
        [background-size:18px_18px]"
      />

      <div className="mx-auto max-w-screen-2xl px-6 py-24">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Menu</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Explore our cookies. Pick your favorite, choose a box size, and order.
            </p>
          </div>

          {/* later: filters/search */}
          <div className="text-sm text-muted-foreground">
            {PRODUCTS.length} cookies
          </div>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => (
            <ProductCard
              key={p.id}
              name={p.name}
              description={p.description}
              imageUrl={p.imageUrl}
              fromPrice={p.fromPrice}
              tags={p.tags}
              featured={p.featured}
              href={`/menu/${p.slug}`} // later we’ll build this page
            />
          ))}
        </div>
      </div>
    </main>
  );
}