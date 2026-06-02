// Sandbox page: project-management rendered via components-v2 templates.
// Section order, aria IDs, and content are byte-identical to the real page at
// /industrial-services/project-management — this route exists for pixel diffing only.
// noindex: this route must not be crawled.

import { ServiceHero01 } from "@/components-v2/06_sections/heroes/service-hero-01";
import { WhyBand01 } from "@/components-v2/06_sections/grids/why-band-01";
import { NumberedCardGrid01 } from "@/components-v2/06_sections/grids/numbered-card-grid-01";
import { DispatchCta01 } from "@/components-v2/06_sections/callouts/dispatch-cta-01";
import { RelatedRail01 } from "@/components-v2/06_sections/rails/related-rail-01";
import { hero, group, projects, cta, related } from "./content";

export const metadata = {
  title: "TT — project-management",
  robots: { index: false, follow: false },
};

export default function ProjectManagementSandboxPage() {
  return (
    <>
      <ServiceHero01 content={hero} config={{ alert: true, photoHalf: true, ghostPhone: true, reveal: true }} />
      <WhyBand01 content={group} config={{ variant: "mw-why--3up", marker: "number", columns: 3 }} />
      <NumberedCardGrid01 content={projects} />
      <DispatchCta01 content={cta} />
      <RelatedRail01 content={related} />
    </>
  );
}
