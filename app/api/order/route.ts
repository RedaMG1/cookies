// app/api/order/route.ts
import { NextResponse } from "next/server";
import { supabaseAdminServer } from "@/lib/supabase/admin-server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get("order");

    if (!orderId) {
      return NextResponse.json({ error: "Missing order query param" }, { status: 400 });
    }

    const { data: order, error: oErr } = await supabaseAdminServer
      .from("orders")
      .select(
        "id, order_no, email, phone, status, currency, total_cents, delivery_address_id, notes"
      )
      .eq("id", orderId)
      .maybeSingle();

    if (oErr) {
      return NextResponse.json({ error: oErr.message }, { status: 500 });
    }
    if (!order) {
      return NextResponse.json({ error: "Order not found", orderId }, { status: 404 });
    }

    const { data: items, error: iErr } = await supabaseAdminServer
      .from("order_items")
      .select("product_name, variant_name, quantity, unit_price_cents, line_total_cents")
      .eq("order_id", orderId);

    if (iErr) {
      return NextResponse.json({ error: iErr.message }, { status: 500 });
    }

    let addressText: string | null = null;

    if (order.delivery_address_id) {
      const { data: addr, error: aErr } = await supabaseAdminServer
        .from("addresses")
        .select("name,line1,line2,city,region")
        .eq("id", order.delivery_address_id)
        .maybeSingle();

      if (!aErr && addr) {
        addressText =
          `${addr.name ?? ""}\n` +
          `${addr.line1 ?? ""}${addr.line2 ? `, ${addr.line2}` : ""}\n` +
          `${(addr.region ?? "")} ${(addr.city ?? "")}`.trim();
      }
    }

    return NextResponse.json(
      { order, items: items ?? [], addressText },
      { status: 200 }
    );
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}