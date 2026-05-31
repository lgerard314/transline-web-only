import { PageHero } from "@white-owl/brand/components";
import { caseSteinbachFire as c } from "@/lib/content/case-steinbach-fire";

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
