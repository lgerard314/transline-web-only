import { HeroSection } from "./sections/01-hero";
import { BodySection } from "./sections/02-body";
import { RelatedSection } from "./sections/03-related";

export const metadata = { title: "Industrial Cleaning" };

export default function IndustrialCleaningPage() {
  return (
    <>
      <HeroSection />
      <BodySection />
      <RelatedSection />
    </>
  );
}
