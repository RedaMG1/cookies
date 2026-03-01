"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type Order = {
  id: string;
  order_no: number;
  email: string | null;
  phone: string | null;
  status: string;
  currency: string;
  total_cents: number;
  notes: string | null;
};

type OrderItem = {
  product_name: string | null;
  variant_name: string | null;
  quantity: number;
  unit_price_cents: number;
  line_total_cents: number;
};

function money(cents: number, currency = "USD") {
  return new Intl.NumberFormat(undefined, { style: "currency", currency }).format(
    (cents || 0) / 100
  );
}

export default function SuccessPage() {
  const params = useSearchParams();

  const [orderId, setOrderId] = useState<string | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [addressText, setAddressText] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // pick order id from URL OR localStorage fallback
  useEffect(() => {
    const fromUrl = params.get("order");
    const fromStorage = typeof window !== "undefined" ? localStorage.getItem("last_order_id") : null;
    setOrderId(fromUrl || fromStorage);
  }, [params]);

  // fetch order info
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        if (!orderId) {
          setErr("No order id found (URL and localStorage are empty).");
          return;
        }

        const res = await fetch(`/api/order?order=${encodeURIComponent(orderId)}`);
        const json = await res.json();

        if (!res.ok) throw new Error(json?.error ?? "Failed to load order");

        setOrder(json.order);
        setItems(json.items ?? []);
        setAddressText(json.addressText ?? null);
      } catch (e: any) {
        setErr(e?.message ?? "Failed to load order");
      } finally {
        setLoading(false);
      }
    })();
  }, [orderId]);

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-24">
        <h1 className="text-3xl font-semibold">Payment successful ✅</h1>
        <p className="mt-2 text-sm text-muted-foreground">Loading your order…</p>
      </main>
    );
  }

  if (err) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-24">
        <h1 className="text-3xl font-semibold">Payment successful ✅</h1>
        <p className="mt-2 text-sm text-red-600">{err}</p>
        <p className="mt-2 text-xs text-muted-foreground">
          Debug: url order = <code>{params.get("order") ?? "null"}</code> | localStorage last_order_id =
          <code>{typeof window !== "undefined" ? localStorage.getItem("last_order_id") ?? "null" : "null"}</code>
        </p>
        <Link className="mt-6 inline-block underline" href="/">
          Back home
        </Link>
      </main>
    );
  }

  if (!order) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-24">
        <h1 className="text-3xl font-semibold">Payment successful ✅</h1>
        <p className="mt-2 text-sm text-muted-foreground">Order not found.</p>
        <Link className="mt-6 inline-block underline" href="/">
          Back home
        </Link>
      </main>
    );
  }

  const currency = (order.currency ?? "usd").toUpperCase();

  return (
    <main className="mx-auto max-w-4xl px-6 py-24">
      <div className="rounded-3xl border border-border bg-card p-8">
        <h1 className="text-4xl font-semibold">Order confirmed ✅</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your order has been created successfully.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-background p-4">
            <p className="text-xs text-muted-foreground">Order number</p>
            <p className="mt-1 text-xl font-semibold">#{order.order_no}</p>
            <p className="mt-2 text-xs text-muted-foreground">Status</p>
            <p className="font-medium">{order.status}</p>
          </div>

          <div className="rounded-2xl border border-border bg-background p-4">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="mt-1 text-xl font-semibold">{money(order.total_cents, currency)}</p>
            <p className="mt-2 text-xs text-muted-foreground">Email</p>
            <p className="font-medium">{order.email}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="text-lg font-semibold">Items</h2>
            <div className="mt-3 space-y-3">
              {items.map((it, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-2xl border border-border bg-background p-4"
                >
                  <div>
                    <p className="font-medium">
                      {it.product_name}
                      {it.variant_name ? ` — ${it.variant_name}` : ""}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {money(it.unit_price_cents, currency)} × {it.quantity}
                    </p>
                  </div>
                  <p className="font-semibold">{money(it.line_total_cents, currency)}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Delivery info</h2>
            <div className="mt-3 rounded-2xl border border-border bg-background p-4 text-sm text-muted-foreground whitespace-pre-wrap">
              <div>
                <span className="font-medium text-foreground">Phone:</span>{" "}
                {order.phone ?? "—"}
              </div>
              <div className="mt-2">{addressText ?? order.notes ?? "—"}</div>
            </div>
          </div>
        </div>

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