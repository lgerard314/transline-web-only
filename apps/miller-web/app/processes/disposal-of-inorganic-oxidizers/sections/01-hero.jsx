import { PageHero } from "@white-owl/brand/components";
import { processInorganicOxidizers as c } from "@/lib/content/process-disposal-of-inorganic-oxidizers";

export function HeroSection() {
  const h = c.hero;
  return <PageHero eyebrow={h.eyebrow} title={h.title} lead={h.lead} photo={h.photo} />;
}
