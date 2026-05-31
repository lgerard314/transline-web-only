import { PageHero } from "@white-owl/brand/components";
import { projectManagement as c } from "@/lib/content/service-project-management";

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
