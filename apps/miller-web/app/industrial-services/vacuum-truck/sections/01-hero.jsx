import { PageHero } from "@white-owl/brand/components";
import { vacuumTruck as c } from "@/lib/content/service-vacuum-truck";

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
