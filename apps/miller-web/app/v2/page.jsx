// /v2 — award home (preview). Thin composition: order the manifest sections,
// feed each its V2_* content object. The custody thread is carried per-section
// (each section renders its own CustodyRule/Node). No <main> here — the root
// layout owns <main id="main">.
import { HeroManifest } from "./_sections/HeroManifest";
import { V2_HERO } from "./_content";

export default function V2Home() {
  return (
    <>
      {/* LCP preload — the hero photograph. React 19 hoists <link> into <head>. */}
      <link rel="preload" as="image" fetchPriority="high" href="/miller/v2/hero.jpg" />
      <HeroManifest content={V2_HERO} />
    </>
  );
}
