// Sandbox page: customer-waste-collection rendered via components-v2 templates.
// Section order, aria IDs, and content are byte-identical to the real page at
// /industrial-services/customer-waste-collection — this route exists for pixel diffing only.
// The real page.jsx has no hero <link rel="preload"> hint, so none is reproduced here.
// noindex: this route must not be crawled.

import { ServiceHero01 } from "@/components-v2/06_sections/heroes/service-hero-01";
import { CapacityLadder01 } from "@/components-v2/06_sections/grids/capacity-ladder-01";
import { ProcessFlow01 } from "@/components-v2/06_sections/flows/process-flow-01";
import { PhotoCardGrid01 } from "@/components-v2/06_sections/grids/photo-card-grid-01";
import { ScheduleCta01 } from "@/components-v2/06_sections/callouts/schedule-cta-01";
import { RelatedRail01 } from "@/components-v2/06_sections/rails/related-rail-01";
import { hero, scale, process, industries, cta, related } from "./content";

export const metadata = {
  title: "TT — customer-waste-collection",
  robots: { index: false, follow: false },
};

export default function CustomerWasteCollectionSandboxPage() {
  return (
    <>
      <ServiceHero01 content={hero} config={{ alert: true, photoHalf: true, reveal: true }} />
      <CapacityLadder01 content={scale} />
      <ProcessFlow01 content={process} />
      <PhotoCardGrid01 content={industries} config={{ cardStyle: "gallery", head: "split", trailingCta: true }} />
      <ScheduleCta01 content={cta} />
      <RelatedRail01 content={related} />
    </>
  );
}
