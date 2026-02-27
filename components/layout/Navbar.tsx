// components/layout/Navbar.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShoppingCart, LogOut, User } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { useCart } from "@/components/cart/CartProvider";

export function Navbar() {
  const supabase = createSupabaseBrowserClient();
  const { totalItems } = useCart();

  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setEmail(data.user?.email ?? null);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  async function logout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-white font-semibold text-lg">
          CookieShop
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-white/80">
          <Link href="/menu" className="hover:text-white transition">
            Menu
          </Link>
          <Link href="/about" className="hover:text-white transition">
            About
          </Link>
          <Link href="/contact" className="hover:text-white transition">
            Contact
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {/* Cart with badge */}
          <Link
            href="/cart"
            className="relative flex items-center gap-2 bg-lime-300 text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-lime-200 transition"
          >
            <ShoppingCart className="h-4 w-4" />
            Cart
            {totalItems > 0 ? (
              <span className="absolute -top-2 -right-2 h-6 min-w-[24px] px-1 rounded-full bg-black text-white text-xs font-semibold flex items-center justify-center">
                {totalItems}
              </span>
            ) : null}
          </Link>

          {email ? (
            <>
              <div className="hidden md:flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-xs text-white/80">
                <User className="h-4 w-4" />
                {email}
              </div>

              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-white hover:bg-white/10 transition"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white hover:bg-white/10 transition"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}