// Sandbox page: industrial-cleaning rendered via components-v2 templates.
// Section order, aria IDs, and content are byte-identical to the real page at
// /industrial-services/industrial-cleaning — this route exists for pixel diffing only.
// noindex: this route must not be crawled.

import { ServiceHero01 } from "@/components-v2/06_sections/heroes/service-hero-01";
import { PhotoCardGrid01 } from "@/components-v2/06_sections/grids/photo-card-grid-01";
import { FleetSplit01 } from "@/components-v2/06_sections/splits/fleet-split-01";
import { WhyBand01 } from "@/components-v2/06_sections/grids/why-band-01";
import { DispatchCta01 } from "@/components-v2/06_sections/callouts/dispatch-cta-01";
import { RelatedRail01 } from "@/components-v2/06_sections/rails/related-rail-01";
import { hero, capabilities, fleet, why, cta, related } from "./content";

export const metadata = {
  title: "TT — industrial-cleaning",
  robots: { index: false, follow: false },
};

export default function IndustrialCleaningSandboxPage() {
  return (
    <>
      <ServiceHero01 content={hero} config={{ alert: true, photoHalf: true, ghostPhone: true, reveal: true }} />
      <PhotoCardGrid01 content={capabilities} config={{ cardStyle: "thumb", head: "split" }} />
      <FleetSplit01 content={fleet} />
      <WhyBand01 content={why} config={{ marker: "number", columns: 4 }} />
      <DispatchCta01 content={cta} />
      <RelatedRail01 content={related} />
    </>
  );
}
