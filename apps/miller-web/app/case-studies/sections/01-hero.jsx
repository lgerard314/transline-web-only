import { PageHero } from "@white-owl/brand/components";
import { caseStudiesIndex as c } from "@/lib/content/case-studies";

export function HeroSection() {
  const h = c.hero;
  return (
    <PageHero eyebrow={h.eyebrow} title={h.title} lead={h.lead} photo={h.photo} />
  );
}
