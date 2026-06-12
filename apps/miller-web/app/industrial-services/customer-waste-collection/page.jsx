import { ServiceHero02 } from "@/components-v2/06_sections/heroes/service-hero-02";
import { ContainerLineup02 } from "@/components-v2/06_sections/grids/container-lineup-02";
import { ProcessFlow02 } from "@/components-v2/06_sections/flows/process-flow-02";
import { FleetShowcase02 } from "@/components-v2/06_sections/splits/fleet-showcase-02";
import { StreamIndex02 } from "@/components-v2/06_sections/pickers/stream-index-02";
import { ScheduleCta02 } from "@/components-v2/06_sections/callouts/schedule-cta-02";
import { RelatedRail02 } from "@/components-v2/06_sections/rails/related-rail-02";
import { customerWasteCollection as c } from "@/lib/content/customer-waste-collection";

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
      <FleetShowcase02 content={c.fleet} />
      <StreamIndex02 content={c.streams} />
      <ScheduleCta02 content={c.cta} />
      <RelatedRail02 content={c.related} />
    </>
  );
}
