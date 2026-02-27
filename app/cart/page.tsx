// app/cart/page.tsx
"use client";

import Link from "next/link";
import { useCart, formatMoney } from "@/components/cart/CartProvider";

export default function CartPage() {
  const { items, totalItems, subtotalCents, removeItem, setQuantity, clear } = useCart();

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

      <div className="mx-auto max-w-screen-2xl px-6 py-24">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Your cart</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              {totalItems} item{totalItems === 1 ? "" : "s"}
            </p>
          </div>

          {items.length > 0 ? (
            <button
              onClick={clear}
              className="rounded-md border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-accent transition"
            >
              Clear cart
            </button>
          ) : null}
        </div>

        {items.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-border bg-card p-8">
            <p className="text-lg font-semibold">Cart is empty</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Add some cookies from the menu.
            </p>
            <Link
              href="/menu"
              className="mt-5 inline-flex rounded-md bg-lime-300 px-4 py-2 text-sm font-semibold text-black hover:bg-lime-200 transition"
            >
              Go to menu
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 lg:grid-cols-12">
            {/* items */}
            <div className="lg:col-span-8 space-y-4">
              {items.map((it) => (
                <div
                  key={it.id}
                  className="flex gap-4 rounded-3xl border border-border bg-card p-4"
                >
                  <div
                    className="h-20 w-28 rounded-2xl bg-cover bg-center"
                    style={{ backgroundImage: `url(${it.imageUrl})` }}
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold">{it.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatMoney(it.unitPriceCents)} each
                        </p>
                      </div>

                      <button
                        onClick={() => removeItem(it.id)}
                        className="text-sm text-muted-foreground hover:text-foreground"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-xl border border-border bg-background">
                        <button
                          className="px-3 py-2 text-sm"
                          onClick={() => setQuantity(it.id, it.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="w-10 text-center text-sm">{it.quantity}</span>
                        <button
                          className="px-3 py-2 text-sm"
                          onClick={() => setQuantity(it.id, it.quantity + 1)}
                        >
                          +
                        </button>
                      </div>

                      <p className="font-semibold">
                        {formatMoney(it.unitPriceCents * it.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* summary */}
            <div className="lg:col-span-4">
              <div className="rounded-3xl border border-border bg-card p-6 sticky top-24">
                <p className="text-lg font-semibold">Summary</p>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatMoney(subtotalCents)}</span>
                </div>

                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-medium">Calculated at checkout</span>
                </div>

                <div className="mt-4 border-t border-border pt-4 flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">{formatMoney(subtotalCents)}</span>
                </div>

                <Link
                  href="/checkout"
                  className="mt-5 inline-flex w-full justify-center rounded-md bg-lime-300 px-4 py-3 text-sm font-semibold text-black hover:bg-lime-200 transition"
                >
                  Checkout
                </Link>

                <Link
                  href="/menu"
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-border bg-background px-4 py-3 text-sm font-semibold hover:bg-accent transition"
                >
                  Continue shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}