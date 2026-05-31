import { PageHero } from "@white-owl/brand/components";
import { contactContent as c } from "@/lib/content/contact";

export function HeroSection() {
  const h = c.hero;
  return (
    <PageHero eyebrow={h.eyebrow} title={h.title} lead={h.lead} photo={h.photo} />
  );
}
