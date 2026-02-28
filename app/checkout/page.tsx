// app/checkout/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart, formatMoney } from "@/components/cart/CartProvider";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { AddressAutocomplete } from "@/components/checkout/AddressAutocomplete";

export default function CheckoutPage() {
    const supabase = createSupabaseBrowserClient();
    const { items, totalItems, subtotalCents } = useCart();

    const [userId, setUserId] = useState<string | null>(null);

    // form
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [line1, setLine1] = useState("");
    const [line2, setLine2] = useState("");
    const [city, setCity] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [country, setCountry] = useState("FR");
    const [note, setNote] = useState("");

    const [paying, setPaying] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // If logged in, prefill email (optional)
    useEffect(() => {
        supabase.auth.getUser().then(({ data }) => {
            const u = data.user;
            setUserId(u?.id ?? null);
            if (u?.email && !email) setEmail(u.email);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function validate() {
        if (items.length === 0) return "Your cart is empty.";
        if (!fullName.trim()) return "Full name is required.";
        if (!email.trim()) return "Email is required.";
        if (!phone.trim()) return "Phone is required.";
        if (!line1.trim()) return "Address line 1 is required.";
        if (!city.trim()) return "City is required.";
        if (!postalCode.trim()) return "Postal code is required.";
        if (!country.trim()) return "Country is required.";
        return null;
    }

    async function startCheckout() {
        setError(null);

        const v = validate();
        if (v) {
            setError(v);
            return;
        }

        setPaying(true);
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId, // can be null for guest
                    customer: {
                        fullName,
                        email,
                        phone,
                        note,
                    },
                    address: {
                        line1,
                        line2: line2 || null,
                        city,
                        postalCode,
                        country,
                    },
                    items: items.map((it) => ({
                        variantId: it.variantId,
                        quantity: it.quantity,
                    })),
                }),
            });

            const text = await res.text();
            const json = text ? JSON.parse(text) : null;

            if (!res.ok) throw new Error(json?.error ?? `Checkout failed (${res.status})`);
            if (!json?.url) throw new Error("Missing checkout url from server");

            window.location.href = json.url;
        } catch (e: any) {
            setError(e?.message ?? "Checkout failed");
            setPaying(false);
        }
    }

    return (
        <main className="relative overflow-hidden">
            <div className="mx-auto max-w-screen-2xl px-6 py-24">
                <h1 className="text-4xl font-semibold tracking-tight">Checkout</h1>
                <p className="mt-2 text-sm text-muted-foreground">
                    Enter your details and pay securely with Stripe.
                </p>

                <div className="mt-10 grid gap-6 lg:grid-cols-12">
                    {/* FORM */}
                    <div className="lg:col-span-7">
                        <div className="rounded-3xl border border-border bg-card p-6">
                            <h2 className="text-lg font-semibold">Your details</h2>

                            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <label className="text-sm font-medium">Full name</label>
                                    <input
                                        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Email</label>
                                    <input
                                        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        type="email"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Phone</label>
                                    <input
                                        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                        required
                                    />
                                </div>

                                <label className="text-sm font-medium">Address line 1</label>
                                <AddressAutocomplete
                                    value={line1}
                                    onChange={(v) => setLine1(v)}
                                    required
                                    placeholder="Start typing your address…"
                                    onSelect={({ line1, city, postalCode, country }) => {
                                        setLine1(line1);
                                        if (city) setCity(city);
                                        if (postalCode) setPostalCode(postalCode);
                                        if (country) setCountry(country);
                                    }}
                                />

                                <div className="sm:col-span-2">
                                    <label className="text-sm font-medium">Address line 2 (optional)</label>
                                    <input
                                        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none"
                                        value={line2}
                                        onChange={(e) => setLine2(e.target.value)}
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium">City</label>
                                    <input
                                        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="text-sm font-medium">Postal code</label>
                                    <input
                                        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none"
                                        value={postalCode}
                                        onChange={(e) => setPostalCode(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="text-sm font-medium">Country</label>
                                    <select
                                        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                    >
                                        <option value="FR">France</option>
                                        <option value="BE">Belgium</option>
                                        <option value="DE">Germany</option>
                                        <option value="ES">Spain</option>
                                    </select>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="text-sm font-medium">Order note (optional)</label>
                                    <textarea
                                        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none min-h-[90px]"
                                        value={note}
                                        onChange={(e) => setNote(e.target.value)}
                                    />
                                </div>
                            </div>

                            {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
                        </div>
                    </div>

                    {/* SUMMARY */}
                    <div className="lg:col-span-5">
                        <div className="rounded-3xl border border-border bg-card p-6 sticky top-24">
                            <h2 className="text-lg font-semibold">Summary</h2>

                            <div className="mt-4 space-y-3">
                                {items.map((it) => (
                                    <div key={it.variantId} className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">
                                            {it.productName} × {it.quantity}
                                        </span>
                                        <span className="font-medium">
                                            {formatMoney(it.unitPriceCents * it.quantity)}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 border-t border-border pt-4 space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Items</span>
                                    <span className="font-medium">{totalItems}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-medium">{formatMoney(subtotalCents)}</span>
                                </div>
                                <div className="flex items-center justify-between pt-2 border-t border-border">
                                    <span className="font-semibold">Total</span>
                                    <span className="font-semibold">{formatMoney(subtotalCents)}</span>
                                </div>
                            </div>

                            <button
                                onClick={startCheckout}
                                disabled={paying || items.length === 0}
                                className="mt-6 inline-flex w-full justify-center rounded-md bg-lime-300 px-4 py-3 text-sm font-semibold text-black hover:bg-lime-200 transition disabled:opacity-60"
                            >
                                {paying ? "Redirecting…" : "Pay with Stripe"}
                            </button>

                            <Link
                                href="/cart"
                                className="mt-3 inline-flex w-full justify-center rounded-md border border-border bg-background px-4 py-3 text-sm font-semibold hover:bg-accent transition"
                            >
                                Back to cart
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}