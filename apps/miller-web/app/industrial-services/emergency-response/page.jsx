import { emergencyResponse as c } from "@/lib/content/service-emergency-response";
import { HeroSection } from "./sections/01-hero";
import { TimelineSection } from "./sections/02-timeline";
import { IncidentsSection } from "./sections/03-incidents";
import { CoverageSection } from "./sections/04-coverage";
import { CtaSection } from "./sections/05-cta";
import { RelatedSection } from "./sections/06-related";

export const metadata = {
  title: "Emergency Response",
  description: c.hero.lead,
  alternates: { canonical: "/industrial-services/emergency-response/" },
};

export default function EmergencyResponsePage() {
  return (
    <>
      <HeroSection />
      <TimelineSection />
      <IncidentsSection />
      <CoverageSection />
      <CtaSection />
      <RelatedSection />
    </>
  );
}
