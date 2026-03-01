// app/checkout/success/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const runtime = "nodejs";

import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

function formatMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

type PageProps = {
  searchParams: Promise<{
    order?: string;
    session_id?: string;
  }>;
};

export default async function SuccessPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const orderId = sp.order ?? "";

  if (!orderId) {
    return (
      <main className="relative overflow-hidden">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="rounded-3xl border border-border bg-card/90 backdrop-blur p-10">
            <h1 className="text-3xl font-semibold">Payment successful ✅</h1>
            <p className="mt-2 text-sm text-red-600">Missing order id in URL.</p>
            <p className="mt-2 text-xs text-muted-foreground">
              URL example: <span className="font-mono">/checkout/success?order=YOUR_ORDER_ID</span>
            </p>

            <Link href="/" className="mt-6 inline-block underline">
              Back home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const SUPABASE_URL = process.env.SUPABASE_URL!;
  const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY!;

  // ⚠️ Server-only client (service role). Never use this in client components.
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { persistSession: false },
  });

  // 1) Load order
  const { data: order, error: orderErr } = await admin
    .from("orders")
    .select(
      "id, order_no, status, email, phone, notes, subtotal_cents, tax_cents, shipping_cents, discount_cents, total_cents, created_at"
    )
    .eq("id", orderId)
    .maybeSingle();

  if (orderErr) {
    return (
      <main className="relative overflow-hidden">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="rounded-3xl border border-border bg-card/90 backdrop-blur p-10">
            <h1 className="text-3xl font-semibold">Payment successful ✅</h1>
            <p className="mt-3 text-sm text-red-600">{orderErr.message}</p>

            <Link href="/" className="mt-6 inline-block underline">
              Back home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="relative overflow-hidden">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <div className="rounded-3xl border border-border bg-card/90 backdrop-blur p-10">
            <h1 className="text-3xl font-semibold">Payment successful ✅</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Order not found (id: <span className="font-mono">{orderId}</span>)
            </p>

            <Link href="/" className="mt-6 inline-block underline">
              Back home
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 2) Load items for this order
  const { data: items, error: itemsErr } = await admin
    .from("order_items")
    .select("id, product_name, variant_name, quantity, unit_price_cents")
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });

  const safeItems = items ?? [];

  const totalCents = Number(order.total_cents ?? order.subtotal_cents ?? 0);

  return (
    <main className="relative overflow-hidden">
      {/* warm bakery background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_520px_at_18%_-10%,rgba(255,215,140,0.55),transparent_55%),radial-gradient(900px_520px_at_82%_10%,rgba(255,215,140,0.25),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.16] [background-image:radial-gradient(#000000_1px,transparent_1px)] [background-size:18px_18px]"
      />

      <div className="mx-auto max-w-screen-2xl px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-border bg-card/90 backdrop-blur p-10">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight">Order confirmed ✅</h1>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Your order has been created successfully.
            </p>

            {/* summary cards */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-border bg-background/60 p-5">
                <div className="text-xs text-muted-foreground">Order number</div>
                <div className="mt-1 text-xl font-semibold">#{order.order_no ?? "—"}</div>

                <div className="mt-4 text-xs text-muted-foreground">Status</div>
                <div className="mt-1 inline-flex rounded-full bg-black/5 px-3 py-1 text-sm font-medium">
                  {order.status ?? "—"}
                </div>

                <div className="mt-4 text-xs text-muted-foreground">Order ID</div>
                <div className="mt-1 break-all font-mono text-xs">{order.id}</div>
              </div>

              <div className="rounded-2xl border border-border bg-background/60 p-5">
                <div className="text-xs text-muted-foreground">Total</div>
                <div className="mt-1 text-xl font-semibold">{formatMoney(totalCents)}</div>

                <div className="mt-4 text-xs text-muted-foreground">Email</div>
                <div className="mt-1 text-sm font-medium">{order.email ?? "—"}</div>

                <div className="mt-4 text-xs text-muted-foreground">Phone</div>
                <div className="mt-1 text-sm font-medium">{order.phone ?? "—"}</div>
              </div>
            </div>

            {/* items */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold">Items</h2>

              {itemsErr ? (
                <p className="mt-3 text-sm text-red-600">{itemsErr.message}</p>
              ) : safeItems.length ? (
                <div className="mt-4 grid gap-3">
                  {safeItems.map((it) => {
                    const qty = Number(it.quantity ?? 1);
                    const unit = Number(it.unit_price_cents ?? 0);
                    return (
                      <div
                        key={it.id}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-border bg-background/60 p-4"
                      >
                        <div>
                          <div className="font-semibold">
                            {it.product_name ?? "Item"}
                            {it.variant_name ? (
                              <span className="text-muted-foreground"> — {it.variant_name}</span>
                            ) : null}
                          </div>
                          <div className="mt-1 text-sm text-muted-foreground">
                            {formatMoney(unit)} × {qty}
                          </div>
                        </div>
                        <div className="font-semibold">{formatMoney(unit * qty)}</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">No items found for this order.</p>
              )}
            </div>

            {/* notes */}
            <div className="mt-8">
              <h2 className="text-lg font-semibold">Delivery / notes</h2>
              <div className="mt-4 rounded-2xl border border-border bg-background/60 p-5 text-sm">
                <div className="whitespace-pre-line text-muted-foreground">
                  {order.notes ?? "—"}
                </div>
              </div>
            </div>

            {/* actions */}
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md bg-lime-300 px-4 py-2 text-sm font-semibold text-black hover:bg-lime-200 transition"
              >
                Back home
              </Link>
              <Link
                href="/menu"
                className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-accent transition"
              >
                Order more
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Tip: bookmark this page. Your order id is in the URL.
          </p>
        </div>
      </div>
    </main>
  );
}