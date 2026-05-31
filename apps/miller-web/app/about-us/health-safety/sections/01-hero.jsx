import { PageHero } from "@white-owl/brand/components";
import { aboutHealthSafety as c } from "@/lib/content/about-health-safety";

export function HeroSection() {
  const h = c.hero;
  return (
    <PageHero eyebrow={h.eyebrow} title={h.title} lead={h.lead} photo={h.photo} />
  );
}
