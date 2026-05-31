import { PageHero } from "@white-owl/brand/components";
import { careersBenefitsRewards as c } from "@/lib/content/careers-benefits-rewards";

export function HeroSection() {
  const h = c.hero;

  return (
    <PageHero eyebrow={h.eyebrow} title={h.title} lead={h.lead} photo={h.photo} />
  );
}
