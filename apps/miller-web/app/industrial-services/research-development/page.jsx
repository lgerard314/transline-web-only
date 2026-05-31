import { HeroSection } from "./sections/01-hero";
import { BodySection } from "./sections/02-body";
import { RelatedSection } from "./sections/03-related";

export const metadata = { title: "Research & Development" };

export default function ResearchDevelopmentPage() {
  return (
    <>
      <HeroSection />
      <BodySection />
      <RelatedSection />
    </>
  );
}
