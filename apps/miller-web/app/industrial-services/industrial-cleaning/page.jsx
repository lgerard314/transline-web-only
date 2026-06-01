import { industrialCleaning as c } from "@/lib/content/service-industrial-cleaning";
import { HeroSection } from "./sections/01-hero";
import { CapabilitiesSection } from "./sections/02-capabilities";
import { FleetSection } from "./sections/03-fleet";
import { WhySection } from "./sections/04-why";
import { CtaSection } from "./sections/05-cta";
import { RelatedSection } from "./sections/06-related";

export const metadata = {
  title: "Industrial Cleaning",
  description: c.hero.lead,
  alternates: { canonical: "/industrial-services/industrial-cleaning/" },
};

export default function IndustrialCleaningPage() {
  return (
    <>
      <HeroSection />
      <CapabilitiesSection />
      <FleetSection />
      <WhySection />
      <CtaSection />
      <RelatedSection />
    </>
  );
}
