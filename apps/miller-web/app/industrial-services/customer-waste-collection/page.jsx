import { customerWasteCollection as c } from "@/lib/content/service-customer-waste-collection";
import { HeroSection } from "./sections/01-hero";
import { ScaleSection } from "./sections/02-scale";
import { ProcessSection } from "./sections/03-process";
import { IndustriesSection } from "./sections/04-industries";
import { CtaSection } from "./sections/05-cta";
import { RelatedSection } from "./sections/06-related";

export const metadata = {
  title: "Customer Waste Collection",
  description: c.hero.lead,
  alternates: { canonical: "/industrial-services/customer-waste-collection/" },
};

export default function CustomerWasteCollectionPage() {
  return (
    <>
      <HeroSection />
      <ScaleSection />
      <ProcessSection />
      <IndustriesSection />
      <CtaSection />
      <RelatedSection />
    </>
  );
}
