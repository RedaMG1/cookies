// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";

type CheckoutBody = {
  userId: string;
  email: string;
  items: { variantId: string; quantity: number }[];
};

export async function POST(req: Request) {
  try {
    // quick env checks (gives clear error)
    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
    }
    if (!process.env.SUPABASE_URL) {
      return NextResponse.json({ error: "Missing SUPABASE_URL" }, { status: 500 });
    }
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: "Missing SUPABASE_SERVICE_ROLE_KEY" }, { status: 500 });
    }

    const body = (await req.json()) as CheckoutBody;

    if (!body?.userId) {
      return NextResponse.json({ error: "Not logged in" }, { status: 401 });
    }
    if (!body?.email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }
    if (!body?.items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

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
    const total = subtotal;

    // Create order
    const { data: order, error: oErr } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: body.userId,
        email: body.email,
        status: "pending_payment",
        currency: "usd",
        subtotal_cents: subtotal,
        total_cents: total,
      })
      .select("id")
      .single();

    if (oErr) throw new Error(oErr.message);

    // Create order_items
    const { error: oiErr } = await supabaseAdmin.from("order_items").insert(
      orderItems.map((it) => ({
        order_id: order.id,
        ...it,
      }))
    );
    if (oiErr) throw new Error(oiErr.message);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: body.email,
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

    // Save payment record
    const { error: payErr } = await supabaseAdmin.from("payments").insert({
      order_id: order.id,
      stripe_checkout_session_id: session.id,
      status: "processing",
      amount_cents: total,
      currency: "usd",
      raw: { checkout_session_id: session.id },
    });
    if (payErr) throw new Error(payErr.message);

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Checkout failed" },
      { status: 500 }
    );
  }
}