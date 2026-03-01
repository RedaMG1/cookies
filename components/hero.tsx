"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/demos/ui/avatar";
import { Button } from "@/components/demos/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const teamAvatars = [
  { initials: "JD", src: "https://i.pravatar.cc/100?img=3" },
  { initials: "HJ", src: "https://i.pravatar.cc/100?img=5" },
  { initials: "PT", src: "https://i.pravatar.cc/100?img=8" },
  { initials: "KD", src: "https://i.pravatar.cc/100?img=11" },
];

const MARQUEE_ITEMS = [
  "🍪 10+ flavors every week",
  "⭐ 4.9/5 customer rating",
  "🚚 Delivery & pickup",
  "🎁 Gift boxes available",
];

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);

  // parallax
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 26]);
  const overlay = useTransform(scrollYProgress, [0, 1], [0.55, 0.7]);

  return (
    <section ref={ref} className="relative overflow-hidden rounded-none">
      {/* background image */}
      <motion.div
        style={{ y }}
        className="absolute inset-0 bg-cover bg-center will-change-transform"
        aria-hidden="true"
      />

      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=2400&q=80)",
        }}
      />

      {/* dark overlay */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-black"
        style={{ opacity: overlay }}
      />

      {/* warm glow */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(1000px_520px_at_15%_0%,rgba(190,255,90,0.20),transparent_60%),radial-gradient(900px_520px_at_85%_15%,rgba(255,215,140,0.20),transparent_60%)]"
      />

      <div className="relative mx-auto max-w-screen-2xl px-6 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          {/* top row */}
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {teamAvatars.map((a) => (
                <Avatar key={a.initials} className="border-2 border-black/60">
                  <AvatarImage src={a.src} alt={a.initials} />
                  <AvatarFallback>{a.initials}</AvatarFallback>
                </Avatar>
              ))}
            </div>

            <div className="text-xs text-white/80">
              <span className="font-semibold text-white">Fresh</span> cookies baked daily
            </div>
          </div>

          {/* marquee stats bar */}
          <div className="mt-6 rounded-full bg-black/30 px-4 py-2 backdrop-blur-md border border-white/10 overflow-hidden">
            <div className="relative">
              <div className="marquee-track flex gap-10 whitespace-nowrap text-xs text-white/80">
                {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((t, i) => (
                  <span key={`${t}-${i}`} className="inline-flex items-center gap-2">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* main content */}
          <div className="mt-10 grid gap-10 md:grid-cols-2 md:items-end">
            <div>
              <h1 className="text-4xl font-semibold leading-tight text-white md:text-6xl">
                Warm cookies,
                <span className="text-lime-300"> big smiles</span>.
              </h1>

              <div className="mt-6 flex items-center gap-3">
                <Link href="/menu">
                  <Button className="bg-lime-300 text-black hover:bg-lime-200 active:scale-[0.98] transition">
                    Order now <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>

                <Link href="/menu">
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 active:scale-[0.98] transition"
                  >
                    View menu
                  </Button>
                </Link>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-lime-200/90 md:text-base">
              From classic chocolate chip to seasonal specials, we bake small batches with premium
              ingredients. Choose your box, pick delivery or pickup, and enjoy fresh-out-the-oven
              goodness.
            </p>
          </div>
        </motion.div>
      </div>

      {/* local CSS for marquee */}
      <style jsx>{`
        .marquee-track {
          animation: marquee 18s linear infinite;
          will-change: transform;
        }
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-33.333%);
          }
        }
      `}</style>
    </section>
  );
}