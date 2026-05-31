import { PageHero } from "@white-owl/brand/components";
import { treatmentFacility as c } from "@/lib/content/treatment-facility";

export function HeroSection() {
  const h = c.hero;
  return (
    <PageHero eyebrow={h.eyebrow} title={h.title} lead={h.lead} photo={h.photo} />
  );
}
