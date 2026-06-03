// /v2 — award home (preview). Thin composition: order the manifest sections,
// feed each its V2_* content object. The custody thread is carried per-section
// (each section renders its own CustodyRule/Node). No <main> here — the root
// layout owns <main id="main">.
import { HeroManifest } from "./_sections/HeroManifest";
import { CertSeals } from "./_sections/CertSeals";
import { CreedVow } from "./_sections/CreedVow";
import { ServicesIndex } from "./_sections/ServicesIndex";
import { SectorsLedger } from "./_sections/SectorsLedger";
import { FacilitySplit } from "./_sections/FacilitySplit";
import { InTransit } from "./_sections/InTransit";
import { HistoryTimeline } from "./_sections/HistoryTimeline";
import { ScaleTally } from "./_sections/ScaleTally";
import { CareersCallout } from "./_sections/CareersCallout";
import { AffiliatesMarquee } from "./_sections/AffiliatesMarquee";
import { DispositionCta } from "./_sections/DispositionCta";
import {
  V2_HERO, V2_CERTS, V2_CREED, V2_SERVICES, V2_SECTORS, V2_FACILITY,
  V2_HISTORY, V2_SCALE, V2_CAREERS, V2_AFFILIATES, V2_DISPOSITION,
} from "./_content";

export default function V2Home() {
  return (
    <>
      {/* LCP preload — the hero photograph. React 19 hoists <link> into <head>. */}
      <link rel="preload" as="image" fetchPriority="high" href="/miller/v2/hero.jpg" />
      <HeroManifest content={V2_HERO} />
      <CertSeals content={V2_CERTS} />
      <CreedVow content={V2_CREED} />
      <ServicesIndex content={V2_SERVICES} />
      <SectorsLedger content={V2_SECTORS} />
      <FacilitySplit content={V2_FACILITY} />
      <InTransit />
      <HistoryTimeline content={V2_HISTORY} />
      <ScaleTally content={V2_SCALE} />
      <CareersCallout content={V2_CAREERS} />
      <AffiliatesMarquee content={V2_AFFILIATES} />
      <DispositionCta content={V2_DISPOSITION} />
    </>
  );
}
