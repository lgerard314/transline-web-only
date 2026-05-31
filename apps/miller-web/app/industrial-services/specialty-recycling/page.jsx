import { specialtyRecycling as c } from "@/lib/content/service-specialty-recycling";
import { HeroSection } from "./sections/01-hero";
import { BodySection } from "./sections/02-body";
import { RelatedSection } from "./sections/03-related";

export const metadata = {
  title: "Specialty Recycling",
  description: c.hero.lead,
  alternates: { canonical: "/industrial-services/specialty-recycling/" },
};

export default function SpecialtyRecyclingPage() {
  return (
    <>
      <HeroSection />
      <BodySection />
      <RelatedSection />
    </>
  );
}
