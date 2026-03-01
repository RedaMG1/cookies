import { Hero } from "@/components/hero";
import { TopSellers } from "@/components/home/TopSellers";
import { CookiesShowcase } from "@/components/home/CookiesShowcase";
import Reveal from "@/components/ui/Reveal";

export default function Home() {
  return (
    <>
      <Reveal>
        <Hero />
      </Reveal>

      <Reveal delay={0.05}>
        <TopSellers />
      </Reveal>

      <Reveal delay={0.1}>
        <CookiesShowcase />
      </Reveal>
    </>
  );
}