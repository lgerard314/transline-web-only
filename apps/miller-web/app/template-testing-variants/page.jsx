import "./../template-testing/template-testing.css";
import { TallStaticBanner01 } from "@/components-v2/06_sections/banners/tall-static-banner-01";
import { BentoGrid01 } from "@/components-v2/06_sections/grids/bento-grid-01";
import { HoverCardGrid01 } from "@/components-v2/06_sections/grids/hover-card-grid-01";
import { MediaSplit01 } from "@/components-v2/06_sections/splits/media-split-01";
import { TimelineSplit01 } from "@/components-v2/06_sections/splits/timeline-split-01";
import { RotatingBanner01 } from "@/components-v2/06_sections/banners/rotating-banner-01";
import { MultiColumnCta01 } from "@/components-v2/06_sections/callouts/multi-column-cta-01";
import { MonumentHero01 } from "@/components-v2/06_sections/heroes/monument-hero-01";
import { CERTS_BANNER, SERVICES_GRID, SECTORS, FACILITY, HISTORY, AFFILIATES_BANNER, FINAL_CTA, HERO } from "@/lib/content/template-testing-home";

export const metadata = { title: "TT variants", robots: { index: false, follow: false } };

const dark = { scheme: "dark" };

export default function P() {
  return (
    <>
      {/* ── existing fixtures (Phase-2 variant tests rely on these) ──────── */}
      {/* tokens override demo: recolor the signature accent on the hero subtree. */}
      <MonumentHero01 content={HERO} config={{ tokens: { "--c-accent": "#7a3d12" } }} />
      {/* scheme demo: `.mw-fac2` surface is `--c-surface-warm`; `cream` remaps it to `--c-bg`. */}
      <MediaSplit01 content={FACILITY} config={{ scheme: "cream" }} />
      {/* layout demo: reverse the facility split columns above the breakpoint. */}
      <MediaSplit01 content={FACILITY} config={{ layout: "reverse" }} />

      {/* ── dark-scheme fixtures: all 7 light sections rendered dark ──────── */}
      <TallStaticBanner01 content={CERTS_BANNER} config={dark} />
      <BentoGrid01 content={SERVICES_GRID} config={dark} />
      <HoverCardGrid01 content={SECTORS} config={dark} />
      <MediaSplit01 content={FACILITY} config={dark} />
      <TimelineSplit01 content={HISTORY} config={dark} />
      <RotatingBanner01 content={AFFILIATES_BANNER} config={dark} />
      <MultiColumnCta01 content={FINAL_CTA} config={dark} />
    </>
  );
}
