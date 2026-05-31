import { PageHero } from "@white-owl/brand/components";
import { ABOUT_INDEX } from "@/lib/content/about-index";

export function HeroSection() {
  return (
    <PageHero
      eyebrow={ABOUT_INDEX.eyebrow}
      title={ABOUT_INDEX.title}
      lead={ABOUT_INDEX.lead}
      photo={ABOUT_INDEX.photo}
    />
  );
}
