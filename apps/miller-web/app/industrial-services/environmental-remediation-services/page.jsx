import { HeroSection } from "./sections/01-hero";
import { WhatWeDoSection } from "./sections/02-what-we-do";
import { IndustriesSection } from "./sections/03-industries";
import { ProcessSection } from "./sections/04-process";
import { CaseStudiesSection } from "./sections/05-case-studies";
import { WhyChooseSection } from "./sections/06-why-choose";
import { CallbackSection } from "./sections/07-callback";

export const metadata = {
  title: "Environmental Remediation Services",
  description:
    "Comprehensive environmental remediation — contaminated soil, hazardous material excavation, spill response, fire-damaged site recovery, brownfield prep, and UST work — backed by a licensed Manitoba treatment facility.",
  alternates: {
    canonical: "/industrial-services/environmental-remediation-services/",
  },
};

export default function RemediationPage() {
  return (
    <>
      <HeroSection />
      <WhatWeDoSection />
      <IndustriesSection />
      <ProcessSection />
      <CaseStudiesSection />
      <WhyChooseSection />
      <CallbackSection />
    </>
  );
}
