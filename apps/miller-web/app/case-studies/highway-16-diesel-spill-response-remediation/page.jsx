import { HeroSection } from "./sections/01-hero";
import { ProblemSection } from "./sections/02-problem";
import { ApproachSection } from "./sections/03-approach";
import { ResultsSection } from "./sections/04-results";
import { CtaSection } from "./sections/05-cta";

export const metadata = { title: "Highway 16 Diesel Spill Response & Remediation" };

export default function Hwy16DieselCaseStudyPage() {
  return (
    <>
      <HeroSection />
      <ProblemSection />
      <ApproachSection />
      <ResultsSection />
      <CtaSection />
    </>
  );
}
