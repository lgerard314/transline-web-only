import { PageHero } from "@white-owl/brand/components";
import { QA } from "@/lib/content/about-quality-assurance";

export function HeroSection() {
  return (
    <PageHero
      eyebrow={QA.eyebrow}
      title={QA.title}
      lead={QA.lead}
      photo={QA.photo}
    />
  );
}
