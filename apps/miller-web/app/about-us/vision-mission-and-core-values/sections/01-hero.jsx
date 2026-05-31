import { PageHero } from "@white-owl/brand/components";
import { aboutVisionMissionAndCoreValues as c } from "@/lib/content/about-vision-mission-and-core-values";

export function HeroSection() {
  const h = c.hero;
  return (
    <PageHero eyebrow={h.eyebrow} title={h.title} lead={h.lead} />
  );
}
