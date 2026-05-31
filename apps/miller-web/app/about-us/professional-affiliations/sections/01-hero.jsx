import { PageHero } from "@white-owl/brand/components";
import { aboutProfessionalAffiliations as c } from "@/lib/content/about-professional-affiliations";

export function HeroSection() {
  const h = c.hero;
  return (
    <PageHero eyebrow={h.eyebrow} title={h.title} lead={h.lead} />
  );
}
