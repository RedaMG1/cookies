// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import "../styles/animations.css";

import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Cookie Shop",
  description: "Warm cookies, big smiles.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}