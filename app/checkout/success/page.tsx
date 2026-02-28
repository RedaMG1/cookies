// app/checkout/success/page.tsx
import Link from "next/link";

export default function SuccessPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <h1 className="text-4xl font-semibold">Payment successful ✅</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Thanks! Your order was created and your payment is processing.
      </p>

      <div className="mt-8 flex gap-3">
        <Link
          href="/"
          className="rounded-md bg-lime-300 px-4 py-2 text-sm font-semibold text-black hover:bg-lime-200 transition"
        >
          Back home
        </Link>
        <Link
          href="/menu"
          className="rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-accent transition"
        >
          Order more
        </Link>
      </div>
    </main>
  );
}