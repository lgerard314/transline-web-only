import { PageHero } from "@white-owl/brand/components";
import { specialtyRecycling as c } from "@/lib/content/service-specialty-recycling";

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
