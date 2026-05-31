import { PageHero } from "@white-owl/brand/components";
import { caseHwy16Diesel as c } from "@/lib/content/case-hwy16-diesel";

export function HeroSection() {
  const h = c.hero;
  return (
    <PageHero
      eyebrow={h.eyebrow}
      title={h.title}
      lead={h.lead}
      photo={h.photo}
      meta={h.meta}
    />
  );
}
