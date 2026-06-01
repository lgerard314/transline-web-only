import { IWT as c } from "@/lib/content/service-industrial-waste-treatment";
import { HeroSection } from "./sections/01-hero";
import { FacilitySection } from "./sections/02-facility";
import { CapabilitiesSection } from "./sections/03-capabilities";
import { CtaSection } from "./sections/04-cta";
import { RelatedSection } from "./sections/05-related";

export const metadata = {
  title: "Industrial Waste Treatment",
  description: c.hero.lead,
  alternates: { canonical: "/industrial-services/industrial-waste-treatment/" },
};

export default function IndustrialWasteTreatmentPage() {
  return (
    <>
      <HeroSection />
      <FacilitySection />
      <CapabilitiesSection />
      <CtaSection />
      <RelatedSection />
    </>
  );
}
