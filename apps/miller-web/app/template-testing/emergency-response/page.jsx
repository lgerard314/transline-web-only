// Sandbox page: emergency-response rendered via components-v2 templates.
// Section order, aria IDs, and content are byte-identical to the real page at
// /industrial-services/emergency-response — this route exists for pixel diffing only.
// The real page.jsx has no hero <link rel="preload"> hint, so none is reproduced here.
// noindex: this route must not be crawled.

import { ServiceHero01 } from "@/components-v2/06_sections/heroes/service-hero-01";
import { ResponseTimeline01 } from "@/components-v2/06_sections/flows/response-timeline-01";
import { PhotoCardGrid01 } from "@/components-v2/06_sections/grids/photo-card-grid-01";
import { PickerGallery01 } from "@/components-v2/06_sections/pickers/picker-gallery-01";
import { DispatchCta01 } from "@/components-v2/06_sections/callouts/dispatch-cta-01";
import { RelatedRail01 } from "@/components-v2/06_sections/rails/related-rail-01";
import { hero, timeline, incidents, coverage, cta, related } from "./content";

export const metadata = {
  title: "TT — emergency-response",
  robots: { index: false, follow: false },
};

export default function EmergencyResponseSandboxPage() {
  return (
    <>
      <ServiceHero01 content={hero} config={{ media: "transparent-png", alert: true, ghostPhone: true }} />
      <ResponseTimeline01 content={timeline} />
      <PhotoCardGrid01 content={incidents} config={{ cardStyle: "thumb", head: "media-split" }} />
      <PickerGallery01 content={coverage} />
      <DispatchCta01 content={cta} />
      <RelatedRail01 content={related} />
    </>
  );
}
