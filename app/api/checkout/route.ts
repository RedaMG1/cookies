// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";

type Body = {
  userId: string | null;
  customer: {
    fullName: string;
    email: string;
    phone: string;
    note?: string;
  };
  address: {
    line1: string;
    line2: string | null;
    city: string;
    postalCode: string;
    country: string;
  };
  items: { variantId: string; quantity: number }[];
};

function formatAddress(a: Body["address"]) {
  const line2 = a.line2 ? `, ${a.line2}` : "";
  return `${a.line1}${line2}, ${a.postalCode} ${a.city}, ${a.country}`;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;

    if (!body?.items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const { customer, address } = body;
    if (!customer?.fullName || !customer?.email || !customer?.phone) {
      return NextResponse.json({ error: "Missing customer data" }, { status: 400 });
    }
    if (!address?.line1 || !address?.city || !address?.postalCode || !address?.country) {
      return NextResponse.json({ error: "Missing address data" }, { status: 400 });
    }

    // Load variants (trusted prices)
    const variantIds = body.items.map((i) => i.variantId);

    const { data: variants, error: vErr } = await supabaseAdmin
      .from("product_variants")
      .select(
        `
        id,
        name,
        price_cents,
        active,
        products ( name )
      `
      )
      .in("id", variantIds);

    if (vErr) throw new Error(vErr.message);

    const byId = new Map<string, any>();
    (variants ?? []).forEach((v) => byId.set(v.id, v));

    const orderItems = body.items.map((ci) => {
      const v = byId.get(ci.variantId);
      if (!v) throw new Error("Variant not found: " + ci.variantId);
      if (!v.active) throw new Error("Variant not active: " + ci.variantId);

      const qty = Math.max(1, Math.min(99, Number(ci.quantity || 1)));
      const unit = Number(v.price_cents);

      return {
        variant_id: v.id,
        product_name: v.products?.name ?? "Cookie",
        variant_name: v.name ?? "Variant",
        quantity: qty,
        unit_price_cents: unit,
        line_total_cents: unit * qty,
      };
    });

    const subtotal = orderItems.reduce((sum, it) => sum + it.line_total_cents, 0);
    const tax = 0;
    const shipping = 0;
    const discount = 0;
    const total = subtotal + tax + shipping - discount;

    // If you want: store address in addresses only when logged in (optional)
    // We DON'T know your addresses columns, so we skip it for now.
    // Later when you show addresses columns, we can insert and set delivery_address_id.

    const addressText = formatAddress(address);

    // Put everything into orders.notes
    const combinedNotes =
      `Customer: ${customer.fullName}\n` +
      `Phone: ${customer.phone}\n` +
      `Address: ${addressText}\n` +
      (customer.note ? `Note: ${customer.note}` : "");

    // Create order (fits your schema)
    const { data: order, error: oErr } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: body.userId, // nullable for guest
        email: customer.email,
        phone: customer.phone,
        status: "pending_payment",
        fulfillment_method: "delivery", // or "pickup" if you want
        currency: "usd",
        subtotal_cents: subtotal,
        tax_cents: tax,
        shipping_cents: shipping,
        discount_cents: discount,
        total_cents: total,
        notes: combinedNotes || null,
        // delivery_address_id: null (leave empty for now)
      })
      .select("id")
      .single();

    if (oErr) throw new Error(oErr.message);

    // Insert order items
    const { error: oiErr } = await supabaseAdmin.from("order_items").insert(
      orderItems.map((it) => ({ order_id: order.id, ...it }))
    );
    if (oiErr) throw new Error(oiErr.message);

    // Stripe session
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customer.email,
      success_url: `${siteUrl}/checkout/success?order=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel?order=${order.id}`,
      metadata: { order_id: order.id },
      line_items: orderItems.map((it) => ({
        quantity: it.quantity,
        price_data: {
          currency: "usd",
          unit_amount: it.unit_price_cents,
          product_data: { name: `${it.product_name} — ${it.variant_name}` },
        },
      })),
    });

    // payment row (keep raw data too)
    const { error: payErr } = await supabaseAdmin.from("payments").insert({
      order_id: order.id,
      stripe_checkout_session_id: session.id,
      status: "processing",
      amount_cents: total,
      currency: "usd",
      raw: {
        checkout_session_id: session.id,
        customer,
        address,
      },
    });
    if (payErr) throw new Error(payErr.message);

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Checkout failed" }, { status: 500 });
  }
}