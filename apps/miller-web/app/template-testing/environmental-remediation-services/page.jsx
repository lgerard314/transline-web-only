// Sandbox page: environmental-remediation-services rendered via components-v2 templates.
// Section order, aria IDs, and content are byte-identical to the real page at
// /industrial-services/environmental-remediation-services — this route exists for pixel diffing only.
// The real page.jsx has no hero <link rel="preload"> hint, so none is reproduced here.
// noindex: this route must not be crawled.

import { ServiceHero01 } from "@/components-v2/06_sections/heroes/service-hero-01";
import { PhotoCardGrid01 } from "@/components-v2/06_sections/grids/photo-card-grid-01";
import { PickerGallery01 } from "@/components-v2/06_sections/pickers/picker-gallery-01";
import { ProcessFlow01 } from "@/components-v2/06_sections/flows/process-flow-01";
import { VideoPicker01 } from "@/components-v2/06_sections/pickers/video-picker-01";
import { WhyBand01 } from "@/components-v2/06_sections/grids/why-band-01";
import { DispatchCta01 } from "@/components-v2/06_sections/callouts/dispatch-cta-01";
import { RelatedRail01 } from "@/components-v2/06_sections/rails/related-rail-01";
import { hero, whatWeDo, whoWeServe, process, videos, caseStudies, whyChoose, cta, related } from "./content";

export const metadata = {
  title: "TT — environmental-remediation-services",
  robots: { index: false, follow: false },
};

export default function EnvironmentalRemediationSandboxPage() {
  return (
    <>
      <ServiceHero01 content={hero} config={{ media: "video", reveal: true, ghostPhone: true }} />
      <PhotoCardGrid01 content={whatWeDo} config={{ cardStyle: "wwd", head: "split", variant: "mw-rem-wwd" }} />
      <PickerGallery01 content={whoWeServe} config={{ serve: true }} />
      <ProcessFlow01 content={process} config={{ wide: true }} />
      <VideoPicker01 content={videos} />
      <PhotoCardGrid01 content={caseStudies} config={{ cardStyle: "case", head: "split", variant: "mw-rem-case" }} />
      <WhyBand01 content={whyChoose} config={{ statCycle: true, variant: "mw-why--rem" }} />
      <DispatchCta01 content={cta} />
      <RelatedRail01 content={related} />
    </>
  );
}
