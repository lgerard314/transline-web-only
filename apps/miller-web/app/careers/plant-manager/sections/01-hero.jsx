import { PageHero } from "@white-owl/brand/components";
import { jobPlantManager as c } from "@/lib/content/job-plant-manager";

export function HeroSection() {
  const meta = c.location ? [{ k: "Location ", v: c.location }] : null;

  return (
    <PageHero
      eyebrow={c.hero.eyebrow}
      title={c.hero.title}
      lead={c.hero.lead}
      meta={meta}
    />
  );
}
