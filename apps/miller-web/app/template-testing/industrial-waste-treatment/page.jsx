// Sandbox page: industrial-waste-treatment rendered via components-v2 templates.
// Section order, aria IDs, and content are byte-identical to the real page at
// /industrial-services/industrial-waste-treatment — this route exists for pixel diffing only.
// noindex: this route must not be crawled.

import { ServiceHero01 } from "@/components-v2/06_sections/heroes/service-hero-01";
import { FacilityShowcase01 } from "@/components-v2/06_sections/grids/facility-showcase-01";
import { CapabilityGrid01 } from "@/components-v2/06_sections/grids/capability-grid-01";
import { DispatchCta01 } from "@/components-v2/06_sections/callouts/dispatch-cta-01";
import { RelatedRail01 } from "@/components-v2/06_sections/rails/related-rail-01";
import { hero, facility, capabilities, cta, related } from "./content";

export const metadata = {
  title: "TT — industrial-waste-treatment",
  robots: { index: false, follow: false },
};

export default function IndustrialWasteTreatmentSandboxPage() {
  return (
    <>
      <ServiceHero01 content={hero} config={{ alert: true, photoHalf: true, ghostPhone: true, reveal: true }} />
      <FacilityShowcase01 content={facility} />
      <CapabilityGrid01 content={capabilities} />
      <DispatchCta01 content={cta} />
      <RelatedRail01 content={related} />
    </>
  );
}
