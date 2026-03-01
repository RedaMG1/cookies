"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

function formatMoney(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

type OrderRow = {
  id: string;
  order_no: number | null;
  status: string | null;
  email: string | null;
  phone: string | null;
  notes: string | null;
  subtotal_cents: number | null;
  tax_cents: number | null;
  shipping_cents: number | null;
  discount_cents: number | null;
  total_cents: number | null;
  created_at: string | null;
};

type OrderItemRow = {
  id: string;
  product_name: string | null;
  variant_name: string | null;
  quantity: number | null;
  unit_price_cents: number | null;
};

export default function SuccessPage() {
  const searchParams = useSearchParams();

  const orderIdFromUrl = searchParams.get("order") ?? "";
  const orderIdFromStorage =
    typeof window !== "undefined" ? localStorage.getItem("last_order_id") ?? "" : "";

  const orderId = useMemo(
    () => orderIdFromUrl || orderIdFromStorage,
    [orderIdFromUrl, orderIdFromStorage]
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [order, setOrder] = useState<OrderRow | null>(null);
  const [items, setItems] = useState<OrderItemRow[]>([]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        if (!orderId) throw new Error("Missing order id in URL.");

        const res = await fetch(`/api/order?order=${encodeURIComponent(orderId)}`);
        const json = await res.json();

        if (!res.ok) throw new Error(json?.error ?? "Failed to load order");

        if (!mounted) return;

        setOrder(json.order ?? null);
        setItems(json.items ?? []);

        localStorage.setItem("last_order_id", orderId);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message ?? "Failed to load order");
      } finally {
        if (!mounted) return;
        setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [orderId]);

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
              <h1 className="text-3xl font-semibold tracking-tight">Order confirmed</h1>
              <CheckCircle2 className="h-8 w-8 text-lime-500" />
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              Your order has been created successfully.
            </p>

            {loading ? (
              <p className="mt-6 text-sm text-muted-foreground">Loading your order…</p>
            ) : error ? (
              <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
                <div className="mt-2 text-xs text-red-600">
                  Debug: url order = {orderIdFromUrl || "null"} | localStorage last_order_id ={" "}
                  {orderIdFromStorage || "null"}
                </div>
              </div>
            ) : !order ? (
              <p className="mt-6 text-sm text-muted-foreground">No order found.</p>
            ) : (
              <>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border bg-background/60 p-5">
                    <div className="text-xs text-muted-foreground">Order number</div>
                    <div className="mt-1 text-xl font-semibold">#{order.order_no ?? "—"}</div>

                    <div className="mt-4 text-xs text-muted-foreground">Status</div>
                    <div className="mt-1 inline-flex rounded-full bg-black/5 px-3 py-1 text-sm font-medium">
                      {order.status ?? "—"}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-border bg-background/60 p-5">
                    <div className="text-xs text-muted-foreground">Total</div>
                    <div className="mt-1 text-xl font-semibold">
                      {formatMoney(order.total_cents ?? order.subtotal_cents ?? 0)}
                    </div>

                    <div className="mt-4 text-xs text-muted-foreground">Email</div>
                    <div className="mt-1 text-sm font-medium">{order.email ?? "—"}</div>
                  </div>
                </div>

                <div className="mt-8">
                  <h2 className="text-lg font-semibold">Items</h2>
                  <div className="mt-4 grid gap-3">
                    {items.length ? (
                      items.map((it) => {
                        const qty = it.quantity ?? 1;
                        const unit = it.unit_price_cents ?? 0;
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
                      })
                    ) : (
                      <p className="text-sm text-muted-foreground">No items found.</p>
                    )}
                  </div>
                </div>

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
              </>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Tip: You can bookmark this page. The order id is in the URL.
          </p>
        </div>
      </div>
    </main>
  );
}