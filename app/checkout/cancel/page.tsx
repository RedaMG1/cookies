// app/checkout/cancel/page.tsx
import Link from "next/link";

export default function CancelPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-4xl font-semibold">Payment canceled</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        No worries — you can try again anytime.
      </p>

      <div className="mt-8 flex gap-3">
        <Link
          href="/cart"
          className="rounded-md bg-lime-300 px-4 py-2 text-sm font-semibold text-black hover:bg-lime-200 transition"
        >
          Back to cart
        </Link>
        <Link
          href="/menu"
          className="rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-accent transition"
        >
          Continue shopping
        </Link>
      </div>
    </main>
  );
}