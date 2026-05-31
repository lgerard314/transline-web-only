import { stewardship as c } from "@/lib/content/service-stewardship";
import { HeroSection } from "./sections/01-hero";
import { BodySection } from "./sections/02-body";
import { ExtraListsSection } from "./sections/03-extra-lists";
import { RelatedSection } from "./sections/04-related";

export const metadata = {
  title: "Stewardship",
  description: c.hero.lead,
  alternates: { canonical: "/industrial-services/stewardship/" },
};

export default function StewardshipPage() {
  return (
    <>
      <HeroSection />
      <BodySection />
      <ExtraListsSection />
      <RelatedSection />
    </>
  );
}
