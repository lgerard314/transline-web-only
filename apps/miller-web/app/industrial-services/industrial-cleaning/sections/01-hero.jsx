import { PageHero } from "@white-owl/brand/components";
import { industrialCleaning as c } from "@/lib/content/service-industrial-cleaning";

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
