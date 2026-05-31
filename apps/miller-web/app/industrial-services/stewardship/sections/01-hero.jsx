import { PageHero } from "@white-owl/brand/components";
import { stewardship as c } from "@/lib/content/service-stewardship";

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
