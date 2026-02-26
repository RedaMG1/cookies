// components/layout/Footer.tsx
import Link from "next/link";
import { Clock, Instagram, Mail, MapPin, Phone } from "lucide-react";

const QUICK_LINKS = [
  { label: "Menu", href: "/menu" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Cart", href: "/cart" },
];

const LEGAL_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Allergens", href: "/allergens" },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#0B0B0B] text-white">
      {/* Dark chocolate gradient base */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10
        bg-gradient-to-b from-[#0B0B0B] via-[#070707] to-[#000000]"
      />

      {/* Warm glow accents */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-56 top-8 -z-10 h-[520px] w-[520px] rounded-full bg-amber-400/18 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-56 bottom-0 -z-10 h-[520px] w-[520px] rounded-full bg-orange-400/14 blur-3xl"
      />

      {/* subtle grain */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-[0.06]
        [background-image:radial-gradient(#fff_1px,transparent_0)]
        [background-size:22px_22px]"
      />

      <div className="mx-auto max-w-screen-2xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-xl font-semibold tracking-tight">
                CookieShop
              </span>
              <span className="rounded-full bg-lime-300 px-2 py-0.5 text-xs font-semibold text-black">
                fresh
              </span>
            </Link>

            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
              Warm cookies, baked in small batches with premium ingredients.
              Pickup or delivery — your next favorite bite is a few clicks away.
            </p>

            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="mailto:hello@cookieshop.com"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/80 transition hover:bg-white/10 hover:text-white"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>

            <p className="mt-6 text-xs text-white/50">
              Replace the brand name, socials, and contact info with yours.
            </p>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold text-white">Quick links</h3>
            <ul className="mt-4 space-y-2">
              {QUICK_LINKS.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-white/70 transition hover:text-lime-300"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info cards */}
          <div className="md:col-span-4">
            <h3 className="text-sm font-semibold text-white">Info</h3>

            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-lime-300/20 text-lime-300">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-medium text-white">
                    Pickup location
                  </p>
                  <p className="text-sm text-white/70">
                    Your City, Your Street (update this)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-lime-300/20 text-lime-300">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-medium text-white">Hours</p>
                  <p className="text-sm text-white/70">
                    Mon–Sat: 10:00–20:00 • Sun: 12:00–18:00
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-lime-300/20 text-lime-300">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-medium text-white">Contact</p>
                  <p className="text-sm text-white/70">
                    +00 000 000 000 • hello@cookieshop.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-white/50">
            © {new Date().getFullYear()} CookieShop. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-xs text-white/50 transition hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}