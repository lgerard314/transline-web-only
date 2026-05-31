import { HeroSection } from "./sections/01-hero";
import { HighlightsSection } from "./sections/02-highlights";
import { ProseSection } from "./sections/03-prose";
import { FaqSection } from "./sections/04-faq";
import { CtaSection } from "./sections/05-cta";

export const metadata = { title: "Disposal of Inorganic Oxidizers" };

export default function DisposalOfInorganicOxidizersPage() {
  return (
    <>
      <HeroSection />
      <HighlightsSection />
      <ProseSection />
      <FaqSection />
      <CtaSection />
    </>
  );
}
