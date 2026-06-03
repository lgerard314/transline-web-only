import { ServiceHero01 } from "@/components-v2/06_sections/heroes/service-hero-01";
import { CapacityLadder01 } from "@/components-v2/06_sections/grids/capacity-ladder-01";
import { ProcessFlow01 } from "@/components-v2/06_sections/flows/process-flow-01";
import { PhotoCardGrid01 } from "@/components-v2/06_sections/grids/photo-card-grid-01";
import { ScheduleCta01 } from "@/components-v2/06_sections/callouts/schedule-cta-01";
import { RelatedRail01 } from "@/components-v2/06_sections/rails/related-rail-01";
import { customerWasteCollection as c } from "@/lib/content/service-customer-waste-collection";

export const metadata = {
  title: "Customer Waste Collection",
  description: c.hero.lead,
  alternates: { canonical: "/industrial-services/customer-waste-collection/" },
};

export default function CustomerWasteCollectionPage() {
  return (
    <>
      <ServiceHero01 content={c.hero} config={{ alert: true, photoHalf: true, reveal: true }} />
      <CapacityLadder01 content={c.scale} />
      <ProcessFlow01 content={c.process} />
      <PhotoCardGrid01 content={c.industries} config={{ cardStyle: "gallery", head: "split", trailingCta: true }} />
      <ScheduleCta01 content={c.cta} />
      <RelatedRail01 content={c.related} />
    </>
  );
}
