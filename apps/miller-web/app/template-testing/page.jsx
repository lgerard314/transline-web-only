import { MonumentHero01 } from "@/components-v2/06_sections/heroes/monument-hero-01";
import { TallStaticBanner01 } from "@/components-v2/06_sections/banners/tall-static-banner-01";
import { BentoGrid01 } from "@/components-v2/06_sections/grids/bento-grid-01";
import { HoverCardGrid01 } from "@/components-v2/06_sections/grids/hover-card-grid-01";
import { MediaSplit01 } from "@/components-v2/06_sections/splits/media-split-01";
import { TimelineSplit01 } from "@/components-v2/06_sections/splits/timeline-split-01";
import { PhotoBleedCards01 } from "@/components-v2/06_sections/callouts/photo-bleed-cards-01";
import { RotatingBanner01 } from "@/components-v2/06_sections/banners/rotating-banner-01";
import { MultiColumnCta01 } from "@/components-v2/06_sections/callouts/multi-column-cta-01";

export const metadata = {
  title: "Template Testing — components-v2 sandbox",
  robots: { index: false, follow: false },
};

export default function TemplateTestingPage() {
  return (
    <>
      <link rel="preload" href="/miller/hero/home-frame-1.png" as="image" fetchPriority="high" />
      <MonumentHero01 />
      <TallStaticBanner01 />
      <BentoGrid01 />
      <HoverCardGrid01 />
      <MediaSplit01 />
      <TimelineSplit01 />
      <PhotoBleedCards01 />
      <RotatingBanner01 />
      <MultiColumnCta01 />
    </>
  );
}
