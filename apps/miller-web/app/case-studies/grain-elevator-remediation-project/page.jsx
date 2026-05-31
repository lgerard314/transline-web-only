import { HeroSection } from "./sections/01-hero";
import { ProblemSection } from "./sections/02-problem";
import { ApproachSection } from "./sections/03-approach";
import { ResultsSection } from "./sections/04-results";
import { CtaSection } from "./sections/05-cta";

export const metadata = { title: "Grain Elevator Remediation Project" };

export default function GrainElevatorCaseStudyPage() {
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
