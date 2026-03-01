// app/checkout/address/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";

export default function CheckoutAddressPage() {
  const supabase = createSupabaseBrowserClient();

  const [loadingUser, setLoadingUser] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [line1, setLine1] = useState("");
  const [line2, setLine2] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("FR");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      const u = data.user;
      setUserId(u?.id ?? null);
      setLoadingUser(false);

      if (!u) {
        window.location.href = "/login?next=/checkout/address";
      }
    });

    return () => {
      mounted = false;
    };
  }, [supabase]);

  async function saveAddress(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!userId) return;

    setSaving(true);
    try {
      // unset previous defaults
      await supabase
        .from("addresses")
        .update({ is_default: false })
        .eq("user_id", userId)
        .eq("is_default", true);

      // create new default
      const { error: insErr } = await supabase.from("addresses").insert({
        user_id: userId,
        full_name: fullName,
        phone,
        line1,
        line2: line2 || null,
        city,
        postal_code: postalCode,
        country,
        is_default: true,
      });

      if (insErr) throw insErr;

      // go to pay page
      window.location.href = "/checkout/pay";
    } catch (e: any) {
      setError(e?.message ?? "Failed to save address");
      setSaving(false);
    }
  }

  if (loadingUser) {
    return <div className="mx-auto max-w-2xl px-6 py-24">Loading…</div>;
  }

  return (
    <main className="relative overflow-hidden">
      <div className="mx-auto max-w-2xl px-6 py-24">
        <h1 className="text-4xl font-semibold tracking-tight">Delivery details</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Add your address before paying.
        </p>

        <form
          onSubmit={saveAddress}
          className="mt-10 rounded-3xl border border-border bg-card p-6 space-y-4"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium">Full name</label>
              <input
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
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
          </div>

          <div>
            <label className="text-sm font-medium">Address line 1</label>
            <input
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none"
              value={line1}
              onChange={(e) => setLine1(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Address line 2 (optional)</label>
            <input
              className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none"
              value={line2}
              onChange={(e) => setLine2(e.target.value)}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
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
            <div>
              <label className="text-sm font-medium">Country</label>
              <select
                className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              >
                <option value="FR">FR</option>
                <option value="BE">BE</option>
                <option value="DE">DE</option>
                <option value="ES">ES</option>
              </select>
            </div>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button
            disabled={saving}
            className="w-full rounded-xl bg-lime-300 px-4 py-3 text-sm font-semibold text-black hover:bg-lime-200 transition disabled:opacity-60"
          >
            {saving ? "Saving…" : "Continue to payment"}
          </button>
        </form>
      </div>
    </main>
  );
}