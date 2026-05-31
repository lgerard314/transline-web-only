import { PageHero } from "@white-owl/brand/components";
import { caseBrandonPower as c } from "@/lib/content/case-brandon-power";

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
