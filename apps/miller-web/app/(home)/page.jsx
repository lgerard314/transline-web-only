import { OVER_25_YEARS } from "@/lib/content/brand";
import { MonumentHero01 } from "@/components-v2/06_sections/heroes/monument-hero-01";
import { TallStaticBanner01 } from "@/components-v2/06_sections/banners/tall-static-banner-01";
import { BentoGrid01 } from "@/components-v2/06_sections/grids/bento-grid-01";
import { HoverCardGrid01 } from "@/components-v2/06_sections/grids/hover-card-grid-01";
import { MediaSplit01 } from "@/components-v2/06_sections/splits/media-split-01";
import { TimelineSplit01 } from "@/components-v2/06_sections/splits/timeline-split-01";
import { PhotoBleedCards01 } from "@/components-v2/06_sections/callouts/photo-bleed-cards-01";
import { RotatingBanner01 } from "@/components-v2/06_sections/banners/rotating-banner-01";
import { MultiColumnCta01 } from "@/components-v2/06_sections/callouts/multi-column-cta-01";
import { HERO, CERTS_BANNER, SERVICES_GRID, SECTORS, FACILITY, HISTORY, CAREERS, AFFILIATES_BANNER, FINAL_CTA } from "@/lib/content/template-testing-home";

export const metadata = {
  title: "Miller Environmental — Hazardous Waste Management",
  description: `Manitoba-based hazardous waste management with three ISO certifications and ${OVER_25_YEARS.toLowerCase()} of operating history. Routine pickup, scheduled treatment, and 24/7 emergency response.`,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* High-priority preload for the hero background — the LCP element on mobile. React 19 hoists <link> tags into <head>. */}
      <link rel="preload" href="/miller/hero/home-frame-1.png" as="image" fetchPriority="high" />
      <MonumentHero01 content={HERO} />
      <TallStaticBanner01 content={CERTS_BANNER} />
      <BentoGrid01 content={SERVICES_GRID} />
      <HoverCardGrid01 content={SECTORS} />
      <MediaSplit01 content={FACILITY} />
      <TimelineSplit01 content={HISTORY} />
      <PhotoBleedCards01 content={CAREERS} />
      <RotatingBanner01 content={AFFILIATES_BANNER} />
      <MultiColumnCta01 content={FINAL_CTA} />
    </>
  );
}
