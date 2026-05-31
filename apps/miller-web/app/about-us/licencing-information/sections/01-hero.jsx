import { PageHero } from "@white-owl/brand/components";
import { aboutLicencingInformation as c } from "@/lib/content/about-licencing-information";

export function HeroSection() {
  const h = c.hero;
  return <PageHero eyebrow={h.eyebrow} title={h.title} lead={h.lead} />;
}
