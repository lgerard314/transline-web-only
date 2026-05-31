import { PageHero } from "@white-owl/brand/components";
import { researchDevelopment as c } from "@/lib/content/service-research-development";

export function HeroSection() {
  const h = c.hero;
  return (
    <PageHero
      eyebrow={h.eyebrow ?? "Service"}
      title={h.title}
      lead={h.lead}
      photo={h.photo}
    />
  );
}
