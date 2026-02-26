// components/layout/Footer.tsx
import Link from "next/link";
import { Clock, Instagram, Mail, MapPin, Phone } from "lucide-react";

const QUICK_LINKS = [
  { label: "Menu", href: "/menu" },
  { label: "Top sellers", href: "/" }, // later: use "#top-sellers" if you add anchors
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const LEGAL_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Allergens", href: "/allergens" },
];

export function Footer() {
  return (
    <footer className="mt-0 bg-black text-white">
      {/* top glow */}
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-24 h-24 bg-gradient-to-t from-black to-transparent"
        />
      </div>

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

            {/* Social */}
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

            {/* tiny note */}
            <p className="mt-6 text-xs text-white/50">
              Replace the brand name, socials, and contact info with yours.
            </p>
          </div>

          {/* Quick links */}
          <div className="md:col-span-3">
            <h3 className="text-sm font-semibold">Quick links</h3>
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

          {/* Info */}
          <div className="md:col-span-4">
            <h3 className="text-sm font-semibold">Info</h3>

            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <MapPin className="mt-0.5 h-5 w-5 text-lime-300" />
                <div>
                  <p className="text-sm font-medium">Pickup location</p>
                  <p className="text-sm text-white/70">
                    Your City, Your Street (update this)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <Clock className="mt-0.5 h-5 w-5 text-lime-300" />
                <div>
                  <p className="text-sm font-medium">Hours</p>
                  <p className="text-sm text-white/70">
                    Mon–Sat: 10:00–20:00 • Sun: 12:00–18:00
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
                <Phone className="mt-0.5 h-5 w-5 text-lime-300" />
                <div>
                  <p className="text-sm font-medium">Contact</p>
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