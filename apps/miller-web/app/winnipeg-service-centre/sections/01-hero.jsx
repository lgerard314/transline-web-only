import { PageHero } from "@white-owl/brand/components";
import { winnipegServiceCentre as c } from "@/lib/content/winnipeg-service-centre";

export function HeroSection() {
  const h = c.hero;
  return (
    <PageHero eyebrow={h.eyebrow} title={h.title} lead={h.lead} photo={h.photo} />
  );
}
