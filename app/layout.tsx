// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import "../styles/animations.css";

import { Navbar } from "@/components/layout/Navbar";

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
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}