import { ServiceHero02 } from "@/components-v2/06_sections/heroes/service-hero-02";
import { ContainerLineup02 } from "@/components-v2/06_sections/grids/container-lineup-02";
import { ProcessFlow02 } from "@/components-v2/06_sections/flows/process-flow-02";
import { PhotoCardGrid01 } from "@/components-v2/06_sections/grids/photo-card-grid-01";
import { ScheduleCta01 } from "@/components-v2/06_sections/callouts/schedule-cta-01";
import { RelatedRail01 } from "@/components-v2/06_sections/rails/related-rail-01";
import { customerWasteCollection as c } from "@/lib/content/customer-waste-collection";
import { customerWasteCollection as v1 } from "@/lib/content/service-customer-waste-collection";

export const metadata = {
  title: "Customer Waste Collection",
  description: c.hero.lead,
  alternates: { canonical: "/industrial-services/customer-waste-collection/" },
};

export default function CustomerWasteCollectionPage() {
  return (
    <>
      <ServiceHero02 content={c.hero} />
      <ContainerLineup02 content={c.containers} />
      <ProcessFlow02 content={c.process} />
      <PhotoCardGrid01 content={v1.industries} config={{ cardStyle: "gallery", head: "split", trailingCta: true }} />
      <ScheduleCta01 content={v1.cta} />
      <RelatedRail01 content={c.related} />
    </>
  );
}
