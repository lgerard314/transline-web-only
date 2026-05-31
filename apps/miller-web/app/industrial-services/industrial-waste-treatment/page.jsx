import { HeroSection } from "./sections/01-hero";
import { CapabilitiesSection } from "./sections/02-capabilities";
import { RelatedSection } from "./sections/03-related";

export const metadata = {
  title: "Industrial Waste Treatment",
  description:
    "Licensed treatment of industrial organic and inorganic waste — liquid and solid — at the Vaughn Bullough Environmental Centre.",
  alternates: { canonical: "/industrial-services/industrial-waste-treatment/" },
};

export default function IndustrialWasteTreatmentPage() {
  return (
    <>
      <HeroSection />
      <CapabilitiesSection />
      <RelatedSection />
    </>
  );
}
