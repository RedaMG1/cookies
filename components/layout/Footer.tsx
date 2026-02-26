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
    <footer className="relative border-t border-border bg-background text-foreground">
      {/* subtle background pattern (same vibe as your sections) */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-35 dark:opacity-20
        bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.10)_1px,transparent_0)]
        dark:bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.16)_1px,transparent_0)]
        [background-size:18px_18px]"
      />

      {/* soft “gutter glow” so it doesn’t feel empty on large screens */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-56 top-12 -z-10 h-[420px] w-[420px] rounded-full bg-lime-300/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-56 bottom-8 -z-10 h-[420px] w-[420px] rounded-full bg-amber-300/10 blur-3xl"
      />

      <div className="mx-auto max-w-screen-2xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-xl font-semibold tracking-tight">
                CookieShop
              </span>

              {/* Accent pill (swap to bg-primary if you want pure theme colors) */}
              <span className="rounded-full bg-lime-300 px-2 py-0.5 text-xs font-semibold text-black">
                fresh
              </span>
            </Link>

            <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
              Warm cookies, baked in small batches with premium ingredients.
              Pickup or delivery — your next favorite bite is a few clicks away.
            </p>

            {/* Social */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground/80 transition hover:bg-accent hover:text-foreground"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>

              <a
                href="mailto:hello@cookieshop.com"
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground/80 transition hover:bg-accent hover:text-foreground"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>

            <p className="mt-6 text-xs text-muted-foreground">
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
                    className="text-sm text-muted-foreground transition hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info cards */}
          <div className="md:col-span-4">
            <h3 className="text-sm font-semibold">Info</h3>

            <div className="mt-4 space-y-4">
              <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-lime-300/20 text-lime-700 dark:text-lime-300">
                  <MapPin className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-medium">Pickup location</p>
                  <p className="text-sm text-muted-foreground">
                    Your City, Your Street (update this)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-lime-300/20 text-lime-700 dark:text-lime-300">
                  <Clock className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-medium">Hours</p>
                  <p className="text-sm text-muted-foreground">
                    Mon–Sat: 10:00–20:00 • Sun: 12:00–18:00
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-lime-300/20 text-lime-700 dark:text-lime-300">
                  <Phone className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-sm font-medium">Contact</p>
                  <p className="text-sm text-muted-foreground">
                    +00 000 000 000 • hello@cookieshop.com
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CookieShop. All rights reserved.
          </p>

          <div className="flex flex-wrap gap-x-6 gap-y-2">
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                className="text-xs text-muted-foreground transition hover:text-foreground"
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