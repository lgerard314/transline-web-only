// /v2 — award home (preview). Thin composition: order the manifest sections,
// feed each its V2_* content object. The custody thread is carried per-section
// (each section renders its own CustodyRule/Node). No <main> here — the root
// layout owns <main id="main">.
import { HeroManifest } from "./_sections/HeroManifest";
import { CertSeals } from "./_sections/CertSeals";
import { CreedVow } from "./_sections/CreedVow";
import { ServicesIndex } from "./_sections/ServicesIndex";
import { SectorsLedger } from "./_sections/SectorsLedger";
import {
  V2_HERO, V2_CERTS, V2_CREED, V2_SERVICES, V2_SECTORS,
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
    </>
  );
}
