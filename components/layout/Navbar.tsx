"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export function Navbar() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="text-white font-semibold text-lg">
          CookieShop
        </Link>

        {/* Links */}
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

        {/* Cart */}
        <Link
          href="/cart"
          className="flex items-center gap-2 bg-lime-300 text-black px-4 py-2 rounded-md text-sm font-medium hover:bg-lime-200 transition"
        >
          <ShoppingCart className="h-4 w-4" />
          Cart
        </Link>
      </div>
    </header>
  );
}