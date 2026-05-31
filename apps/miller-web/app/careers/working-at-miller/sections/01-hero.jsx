import { PageHero } from "@white-owl/brand/components";
import { careersWorkingAtMiller as c } from "@/lib/content/careers-working-at-miller";

export function HeroSection() {
  return (
    <PageHero
      eyebrow={c.hero.eyebrow}
      title={c.hero.title}
      lead={c.hero.lead}
      photo={c.hero.photo}
    />
  );
}
