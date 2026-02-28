// app/checkout/success/page.tsx
import Link from "next/link";
import { supabasePublic } from "@/lib/supabase/public-server";

function money(cents: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(
    (cents || 0) / 100
  );
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: { order?: string; session_id?: string };
}) {
  const orderId = searchParams.order;

  if (!orderId) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-24">
        <h1 className="text-3xl font-semibold">Payment successful ✅</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          We couldn't find your order id in the URL.
        </p>
        <Link className="mt-6 inline-block underline" href="/">
          Back home
        </Link>
      </main>
    );
  }

  const { data: order } = await supabasePublic
    .from("orders")
    .select("id, order_no, email, phone, status, currency, subtotal_cents, total_cents, notes, created_at")
    .eq("id", orderId)
    .maybeSingle();

  const { data: items } = await supabasePublic
    .from("order_items")
    .select("product_name, variant_name, quantity, unit_price_cents, line_total_cents")
    .eq("order_id", orderId);

  return (
    <main className="mx-auto max-w-4xl px-6 py-24">
      <div className="rounded-3xl border border-border bg-card p-8">
        <h1 className="text-4xl font-semibold">Payment successful ✅</h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Your order is saved. If you paid in test mode, you can check the payment in Stripe.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-background p-4">
            <p className="text-xs text-muted-foreground">Order ID</p>
            <p className="mt-1 font-semibold">
              #{order?.order_no ?? "—"}{" "}
              <span className="text-muted-foreground text-sm">
                ({orderId.slice(0, 8)}…)
              </span>
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Status</p>
            <p className="font-medium">{order?.status ?? "processing"}</p>
          </div>

          <div className="rounded-2xl border border-border bg-background p-4">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="mt-1 font-semibold">
              {money(order?.total_cents ?? 0, (order?.currency ?? "usd").toUpperCase())}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">Email</p>
            <p className="font-medium">{order?.email ?? "—"}</p>
          </div>
        </div>

        {/* Items */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold">Items</h2>
          <div className="mt-3 space-y-3">
            {(items ?? []).map((it, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-2xl border border-border bg-background p-4"
              >
                <div>
                  <p className="font-medium">
                    {it.product_name} {it.variant_name ? `— ${it.variant_name}` : ""}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {money(it.unit_price_cents ?? 0, (order?.currency ?? "usd").toUpperCase())} ×{" "}
                    {it.quantity}
                  </p>
                </div>
                <p className="font-semibold">
                  {money(it.line_total_cents ?? 0, (order?.currency ?? "usd").toUpperCase())}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Notes (contains address + phone + name) */}
        {order?.notes ? (
          <div className="mt-8">
            <h2 className="text-lg font-semibold">Delivery info</h2>
            <pre className="mt-3 whitespace-pre-wrap rounded-2xl border border-border bg-background p-4 text-sm text-muted-foreground">
              {order.notes}
            </pre>
          </div>
        ) : null}

        <div className="mt-10 flex flex-wrap gap-3">
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
      </div>
    </main>
  );
}