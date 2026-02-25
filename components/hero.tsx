"use client";

import { ArrowRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/demos/ui/avatar";
import { Button } from "@/components/demos/ui/button";
import { Marquee } from "@/components/demos/ui/marquee";

const teamAvatars = [
  { initials: "JD", src: "https://i.pravatar.cc/100?img=3" },
  { initials: "HJ", src: "https://i.pravatar.cc/100?img=5" },
  { initials: "PT", src: "https://i.pravatar.cc/100?img=8" },
  { initials: "KD", src: "https://i.pravatar.cc/100?img=11" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-2xl">
      {/* background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
  backgroundImage:
    "url(https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=2400&q=80)",
}}
      />
      {/* dark overlay */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative mx-auto max-w-6xl px-6 py-16 md:py-24">
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
        <div className="mt-6 rounded-full bg-black/30 px-6 py-2 backdrop-blur-md border border-white/10">
  <div className="marquee">
    <div className="marquee__track whitespace-nowrap text-xs text-white/80">
      <span>🍪 10+ flavors every week</span>
      <span>⭐ 4.9/5 customer rating</span>
      <span>🚚 Delivery & pickup</span>
      <span>🎁 Gift boxes available</span>
      <span>🍪 10+ flavors every week</span>
      <span>⭐ 4.9/5 customer rating</span>
      <span>🚚 Delivery & pickup</span>
      <span>🎁 Gift boxes available</span>
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
              <Button className="bg-lime-300 text-black hover:bg-lime-200">
                Order now <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                View menu
              </Button>
            </div>
          </div>

          <p className="text-sm leading-relaxed text-lime-200/90 md:text-base">
            From classic chocolate chip to seasonal specials, we bake small batches with premium
            ingredients. Choose your box, pick delivery or pickup, and enjoy fresh-out-the-oven
            goodness.
          </p>
        </div>
      </div>
    </section>
  );
}