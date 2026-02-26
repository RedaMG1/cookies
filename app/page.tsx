import { Hero } from "@/components/hero";
import { TopSellers } from "@/components/home/TopSellers";
import { CookiesShowcase } from "@/components/home/CookiesShowcase";
export default function Home() {
  return (
    <>
      <Hero />
      <TopSellers />
      <CookiesShowcase />
    </>
  );
}