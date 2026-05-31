import { PageHero } from "@white-owl/brand/components";
import { CAREERS as c } from "@/lib/content/careers";

export function HeroSection() {
  return (
    <PageHero
      eyebrow={c.eyebrow}
      title={c.title}
      lead={c.lead}
      photo={c.photo}
    />
  );
}
