import { HeroSection } from "./sections/01-hero";
import { IntroSection } from "./sections/02-intro";
import { AffiliationsGridSection } from "./sections/03-affiliations-grid";

export const metadata = { title: "Professional Affiliations" };

export default function ProfessionalAffiliationsPage() {
  return (
    <>
      <HeroSection />
      <IntroSection />
      <AffiliationsGridSection />
    </>
  );
}
