import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";

type Body = {
  userId: string | null;
  selectedAddressId: string | null;
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

    // 1) Load variants (trusted prices)
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

    // 2) Save / use delivery address id for logged-in users
    let delivery_address_id: string | null = null;

    if (body.userId) {
      if (body.selectedAddressId) {
        delivery_address_id = body.selectedAddressId;
      } else {
        // Insert address using your real columns:
        const { data: addrRow, error: addrErr } = await supabaseAdmin
          .from("addresses")
          .insert({
            user_id: body.userId,
            name: customer.fullName,
            line1: address.line1,
            line2: address.line2,
            city: address.city,
            region: address.postalCode, // ✅ store postalCode here (your schema)
          })
          .select("id")
          .single();

        if (addrErr) throw new Error(addrErr.message);
        delivery_address_id = addrRow.id;
      }
    }

    const addressText = `${address.line1}${address.line2 ? `, ${address.line2}` : ""}, ${
      address.postalCode
    } ${address.city}, ${address.country}`;

    const combinedNotes =
      `Customer: ${customer.fullName}\n` +
      `Phone: ${customer.phone}\n` +
      `Address: ${addressText}\n` +
      (customer.note ? `Note: ${customer.note}` : "");

    // 3) Create order
    const { data: order, error: oErr } = await supabaseAdmin
      .from("orders")
      .insert({
        user_id: body.userId,
        email: customer.email,
        phone: customer.phone,
        status: "pending_payment",
        fulfillment_method: "delivery",
        currency: "usd",
        subtotal_cents: subtotal,
        tax_cents: tax,
        shipping_cents: shipping,
        discount_cents: discount,
        total_cents: total,
        notes: combinedNotes || null,
        delivery_address_id,
      })
      .select("id, order_no")
      .single();

    if (oErr) throw new Error(oErr.message);

    // 4) Insert order items
    const { error: oiErr } = await supabaseAdmin.from("order_items").insert(
      orderItems.map((it) => ({
        order_id: order.id,
        ...it,
      }))
    );
    if (oiErr) throw new Error(oiErr.message);

    // 5) Stripe session
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customer.email,
      success_url: `${siteUrl}/checkout/success?order=${order.id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel?order=${order.id}`,
      metadata: { order_id: order.id, order_no: String(order.order_no ?? "") },
      line_items: orderItems.map((it) => ({
        quantity: it.quantity,
        price_data: {
          currency: "usd",
          unit_amount: it.unit_price_cents,
          product_data: { name: `${it.product_name} — ${it.variant_name}` },
        },
      })),
    });

    // 6) Payment row
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
        order_no: order.order_no,
        delivery_address_id,
      },
    });
    if (payErr) throw new Error(payErr.message);

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Checkout failed" }, { status: 500 });
  }
}