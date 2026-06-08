import { OVER_25_YEARS } from "@/lib/content/brand";
import { MonumentHero01 } from "@/components-v2/06_sections/heroes/monument-hero-01";
import { TallStaticBanner01 } from "@/components-v2/06_sections/banners/tall-static-banner-01";
import { RosterCollage02 } from "@/components-v2/06_sections/grids/roster-collage-02";
import { LifetimeReel01 } from "@/components-v2/06_sections/statements/lifetime-reel-01";
import { SectorDiamonds04 } from "@/components-v2/06_sections/grids/sector-diamonds-04";
import { MediaSplit01 } from "@/components-v2/06_sections/splits/media-split-01";
import { TimelineSplit01 } from "@/components-v2/06_sections/splits/timeline-split-01";
import { ZoomCollage01 } from "@/components-v2/06_sections/callouts/zoom-collage-01";
import { RotatingBanner01 } from "@/components-v2/06_sections/banners/rotating-banner-01";
import { MultiColumnCta01 } from "@/components-v2/06_sections/callouts/multi-column-cta-01";
import { HERO, CERTS_BANNER, SERVICES_GRID, LIFETIME_REEL, SECTORS_V2, FACILITY, HISTORY, CAREERS, AFFILIATES_BANNER, FINAL_CTA } from "@/lib/content/template-testing-home";

export const metadata = {
  title: "Miller Environmental — Hazardous Waste Management",
  description: `Manitoba-based hazardous waste management with three ISO certifications and ${OVER_25_YEARS.toLowerCase()} of operating history. Routine pickup, scheduled treatment, and 24/7 emergency response.`,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* High-priority preload for the hero background — the LCP element on mobile. React 19 hoists <link> tags into <head>. */}
      <link rel="preload" href="/miller/custom/home-frame-1.png" as="image" fetchPriority="high" />
      <MonumentHero01 content={HERO} config={{ revealOnLoad: true }} />
      <TallStaticBanner01 content={CERTS_BANNER} />
      <RosterCollage02 content={SERVICES_GRID} />
      <SectorDiamonds04 content={SECTORS_V2} />
      <LifetimeReel01 content={LIFETIME_REEL} />
      <MediaSplit01 content={FACILITY} />
      <TimelineSplit01 content={HISTORY} />
      <ZoomCollage01 content={CAREERS} />
      <RotatingBanner01 content={AFFILIATES_BANNER} />
      <MultiColumnCta01 content={FINAL_CTA} />
    </>
  );
}
