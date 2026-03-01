// components/checkout/AddressAutocomplete.tsx
"use client";

import { useEffect, useRef, useState } from "react";

type Suggestion = {
  display_name: string;
  address: {
    road?: string;
    house_number?: string;
    city?: string;
    town?: string;
    village?: string;
    postcode?: string;
    country_code?: string;
    country?: string;
  };
};

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder,
  required,
}: {
  value: string;
  onChange: (v: string) => void;
  onSelect: (data: {
    line1: string;
    city: string;
    postalCode: string;
    country: string;
  }) => void;
  placeholder?: string;
  required?: boolean;
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Suggestion[]>([]);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (!open) return;

    const q = query.trim();
    if (q.length < 3) {
      setItems([]);
      return;
    }

    const t = setTimeout(async () => {
      try {
        setLoading(true);

        abortRef.current?.abort();
        const controller = new AbortController();
        abortRef.current = controller;

        // Nominatim search (OpenStreetMap)
        const url =
          `https://nominatim.openstreetmap.org/search?` +
          new URLSearchParams({
            q,
            format: "json",
            addressdetails: "1",
            limit: "6",
          });

        const res = await fetch(url, {
          signal: controller.signal,
          headers: {
            // Some browsers/dev setups require a user agent/referrer; this usually works:
            "Accept-Language": "en",
          },
        });

        const data = (await res.json()) as Suggestion[];
        setItems(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (e?.name !== "AbortError") setItems([]);
      } finally {
        setLoading(false);
      }
    }, 350);

    return () => clearTimeout(t);
  }, [query, open]);

  function pick(s: Suggestion) {
    const a = s.address || {};
    const city = a.city || a.town || a.village || "";
    const postalCode = a.postcode || "";
    const country = (a.country_code || "").toUpperCase() || "FR";

    const road = a.road || "";
    const house = a.house_number || "";
    const line1 = [house, road].filter(Boolean).join(" ").trim() || query;

    onSelect({
      line1,
      city,
      postalCode,
      country,
    });

    setOpen(false);
    setItems([]);
  }

  return (
    <div className="relative">
      <input
        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        required={required}
        autoComplete="street-address"
      />

      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-xl border border-border bg-card shadow-lg">
          <div className="max-h-64 overflow-auto">
            {loading ? (
              <div className="px-4 py-3 text-sm text-muted-foreground">
                Searching…
              </div>
            ) : items.length === 0 ? (
              <div className="px-4 py-3 text-sm text-muted-foreground">
                Type at least 3 characters…
              </div>
            ) : (
              items.map((s, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => pick(s)}
                  className="block w-full px-4 py-3 text-left text-sm hover:bg-accent transition"
                >
                  {s.display_name}
                </button>
              ))
            )}
          </div>

          <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground">
            Powered by OpenStreetMap
          </div>
        </div>
      ) : null}
    </div>
  );
}