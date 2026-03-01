"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useCart, formatMoney } from "@/components/cart/CartProvider";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { Button } from "@/components/demos/ui/button";

type SavedAddress = {
  id: string;
  name: string | null;
  line1: string | null;
  line2: string | null;
  city: string | null;
  region: string | null; // postal code in your schema
};

export default function CheckoutPage() {
  // ✅ create browser supabase client once
  const supabase = useMemo(() => createSupabaseBrowserClient(), []);

  const { items, totalItems, subtotalCents } = useCart();

  // auth state
  const [userId, setUserId] = useState<string | null>(null);
  const [authEmail, setAuthEmail] = useState<string>("");

  // saved addresses (for logged in)
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

  // form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState<string>(""); // keep string
  const [phone, setPhone] = useState("");

  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("France");
  const [note, setNote] = useState("");

  // ui
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const summaryLine = useMemo(() => {
    if (!items.length) return "Your cart is empty.";
    if (items.length === 1) return `${items[0].productName} × ${items[0].quantity}`;
    return `${items[0].productName} + ${items.length - 1} more`;
  }, [items]);

  // Load auth session + saved address
  useEffect(() => {
    let mounted = true;

    (async () => {
      const { data } = await supabase.auth.getUser();
      const u = data?.user ?? null;

      if (!mounted) return;

      setUserId(u?.id ?? null);

      // ✅ TS-safe (u.email is string inside this if)
      if (u?.email) {
        setAuthEmail(u.email);
        setEmail((prev) => prev || u.email);
      }

      // If logged in, load addresses
      if (u?.id) {
        const { data: addrs } = await supabase
          .from("addresses")
          .select("id,name,line1,line2,city,region")
          .eq("user_id", u.id)
          .order("created_at", { ascending: false });

        const list = (addrs ?? []) as SavedAddress[];
        setSavedAddresses(list);

        // auto-select most recent address
        if (list.length && !selectedAddressId) {
          setSelectedAddressId(list[0].id);

          const a = list[0];
          setFullName((p) => p || (a.name ?? ""));
          setLine1((p) => p || (a.line1 ?? ""));
          setLine2((p) => p || (a.line2 ?? ""));
          setCity((p) => p || (a.city ?? ""));
          setPostalCode((p) => p || (a.region ?? ""));
        }
      }
    })();

    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  // keep form address in sync if user changes selected address
  useEffect(() => {
    if (!selectedAddressId) return;
    const a = savedAddresses.find((x) => x.id === selectedAddressId);
    if (!a) return;

    setFullName((p) => p || (a.name ?? ""));
    setLine1(a.line1 ?? "");
    setLine2(a.line2 ?? "");
    setCity(a.city ?? "");
    setPostalCode(a.region ?? "");
  }, [selectedAddressId, savedAddresses]);

  const canUseSavedAddress = Boolean(userId && selectedAddressId);

  const isFormValid = useMemo(() => {
    if (!fullName.trim()) return false;
    if (!email.trim()) return false;
    if (!phone.trim()) return false;

    // if using saved address, you can skip address validation
    if (canUseSavedAddress) return true;

    if (!line1.trim()) return false;
    if (!city.trim()) return false;
    if (!postalCode.trim()) return false;
    if (!country.trim()) return false;
    return true;
  }, [fullName, email, phone, line1, city, postalCode, country, canUseSavedAddress]);

  async function onPay() {
    setMessage(null);

    if (!items.length) {
      setMessage("Your cart is empty.");
      return;
    }

    if (!isFormValid) {
      setMessage("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        userId,
        selectedAddressId: userId ? selectedAddressId : null,
        customer: {
          fullName,
          email,
          phone,
          note: note || undefined,
        },
        address: {
          line1: line1 || "",
          line2: line2 || null,
          city: city || "",
          postalCode: postalCode || "",
          country: country || "",
        },
        items: items.map((it) => ({
          variantId: it.variantId,
          quantity: it.quantity,
        })),
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json?.error ?? "Checkout failed");

      if (json?.orderId) {
        localStorage.setItem("last_order_id", json.orderId);
      }
      if (json?.url) {
        window.location.href = json.url;
      } else {
        throw new Error("Missing Stripe checkout URL");
      }
    } catch (e: any) {
      setMessage(e?.message ?? "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative overflow-hidden">
      {/* warm bakery background */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(1200px_520px_at_18%_-10%,rgba(255,215,140,0.60),transparent_55%),radial-gradient(900px_520px_at_82%_10%,rgba(255,215,140,0.30),transparent_60%)]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.18] [background-image:radial-gradient(#000000_1px,transparent_1px)] [background-size:18px_18px]"
      />

      <div className="mx-auto max-w-screen-2xl px-6 py-16">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-semibold tracking-tight">Checkout</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your details and pay securely with Stripe.
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-[1.3fr_0.9fr]">
            {/* Left: form */}
            <section className="rounded-3xl border border-border bg-card/90 backdrop-blur p-6">
              <h2 className="text-lg font-semibold">Your details</h2>

              {userId && savedAddresses.length > 0 ? (
                <div className="mt-4">
                  <label className="text-sm font-medium">Saved address</label>
                  <select
                    className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={selectedAddressId ?? ""}
                    onChange={(e) => setSelectedAddressId(e.target.value || null)}
                  >
                    {savedAddresses.map((a) => (
                      <option key={a.id} value={a.id}>
                        {(a.name ?? "My address") +
                          " — " +
                          (a.line1 ?? "") +
                          ", " +
                          (a.city ?? "") +
                          " " +
                          (a.region ?? "")}
                      </option>
                    ))}
                    <option value="">Use a new address</option>
                  </select>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Select one to autofill. Choose “Use a new address” if you want another address.
                  </p>
                </div>
              ) : null}

              <div className="mt-6 grid gap-4">
                <div>
                  <label className="text-sm font-medium">
                    Full name <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    required
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@email.com"
                      required
                    />
                    {authEmail ? (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Prefilled from login: {authEmail}
                      </p>
                    ) : null}
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Phone <span className="text-red-500">*</span>
                    </label>
                    <input
                      className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone number"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Address line 1{" "}
                    {!canUseSavedAddress ? <span className="text-red-500">*</span> : null}
                  </label>
                  <input
                    className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={line1}
                    onChange={(e) => setLine1(e.target.value)}
                    placeholder="Street address"
                    required={!canUseSavedAddress}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">Address line 2 (optional)</label>
                  <input
                    className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={line2}
                    onChange={(e) => setLine2(e.target.value)}
                    placeholder="Apartment, suite, etc."
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium">
                      City {!canUseSavedAddress ? <span className="text-red-500">*</span> : null}
                    </label>
                    <input
                      className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="City"
                      required={!canUseSavedAddress}
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium">
                      Postal code{" "}
                      {!canUseSavedAddress ? <span className="text-red-500">*</span> : null}
                    </label>
                    <input
                      className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="Postal code"
                      required={!canUseSavedAddress}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Country {!canUseSavedAddress ? <span className="text-red-500">*</span> : null}
                  </label>
                  <select
                    className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    required={!canUseSavedAddress}
                  >
                    <option value="France">France</option>
                    <option value="Belgium">Belgium</option>
                    <option value="Germany">Germany</option>
                    <option value="Spain">Spain</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Order note (optional)</label>
                  <textarea
                    className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Any notes for your order?"
                    rows={4}
                  />
                </div>

                {message ? <p className="text-sm text-red-600">{message}</p> : null}
              </div>
            </section>

            {/* Right: summary */}
            <aside className="rounded-3xl border border-border bg-card/90 backdrop-blur p-6 h-fit">
              <h2 className="text-lg font-semibold">Summary</h2>

              <div className="mt-4 text-sm text-muted-foreground">{summaryLine}</div>

              <div className="mt-6 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-medium">{totalItems}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">{formatMoney(subtotalCents)}</span>
                </div>
                <div className="border-t border-border pt-3 flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold">{formatMoney(subtotalCents)}</span>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                <Button
                  onClick={onPay}
                  disabled={loading || !items.length}
                  className="bg-lime-300 text-black hover:bg-lime-200"
                >
                  {loading ? "Redirecting…" : "Pay with Stripe"}
                </Button>

                <Link
                  href="/cart"
                  className="inline-flex items-center justify-center rounded-md border border-border bg-background px-4 py-2 text-sm font-semibold hover:bg-accent transition"
                >
                  Back to cart
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}