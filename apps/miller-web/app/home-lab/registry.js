// Home lab registry — mirrors app/(home)/page.jsx with real production content.
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
import {
  HERO,
  CERTS_BANNER,
  SERVICES_GRID,
  LIFETIME_REEL,
  SECTORS_V2,
  FACILITY,
  HISTORY,
  CAREERS,
  AFFILIATES_BANNER,
  FINAL_CTA,
} from "@/lib/content/template-testing-home";

export const HOME_LAB_SECTIONS = [
  {
    slug: "hero",
    label: "Hero",
    templatePath: "components-v2/06_sections/heroes/monument-hero-01",
    Component: MonumentHero01,
    content: HERO,
    config: { revealOnLoad: true },
    pin: false,
  },
  {
    slug: "certs",
    label: "Certifications",
    templatePath: "components-v2/06_sections/banners/tall-static-banner-01",
    Component: TallStaticBanner01,
    content: CERTS_BANNER,
    config: {},
    pin: false,
  },
  {
    slug: "services",
    label: "Services",
    templatePath: "components-v2/06_sections/grids/roster-collage-02",
    Component: RosterCollage02,
    content: SERVICES_GRID,
    config: {},
    pin: true,
  },
  {
    slug: "sectors",
    label: "Who we serve",
    templatePath: "components-v2/06_sections/grids/sector-diamonds-04",
    Component: SectorDiamonds04,
    content: SECTORS_V2,
    config: {},
    pin: true,
  },
  {
    slug: "lifetime",
    label: "Lifetime impact",
    templatePath: "components-v2/06_sections/statements/lifetime-reel-01",
    Component: LifetimeReel01,
    content: LIFETIME_REEL,
    config: { autoScroll: false },
    pin: true,
  },
  {
    slug: "facility",
    label: "VBEC facility",
    templatePath: "components-v2/06_sections/splits/media-split-01",
    Component: MediaSplit01,
    content: FACILITY,
    config: { autoScroll: false },
    pin: true,
  },
  {
    slug: "history",
    label: "History",
    templatePath: "components-v2/06_sections/splits/timeline-split-01",
    Component: TimelineSplit01,
    content: HISTORY,
    config: {},
    pin: false,
  },
  {
    slug: "careers",
    label: "Careers",
    templatePath: "components-v2/06_sections/callouts/zoom-collage-01",
    Component: ZoomCollage01,
    content: CAREERS,
    config: { autoScroll: false },
    pin: true,
  },
  {
    slug: "affiliates",
    label: "Affiliates",
    templatePath: "components-v2/06_sections/banners/rotating-banner-01",
    Component: RotatingBanner01,
    content: AFFILIATES_BANNER,
    config: {},
    pin: false,
  },
  {
    slug: "final-cta",
    label: "Final CTA",
    templatePath: "components-v2/06_sections/callouts/multi-column-cta-01",
    Component: MultiColumnCta01,
    content: FINAL_CTA,
    config: {},
    pin: false,
  },
];

export function getHomeLabSection(slug) {
  return HOME_LAB_SECTIONS.find((s) => s.slug === slug) ?? null;
}
