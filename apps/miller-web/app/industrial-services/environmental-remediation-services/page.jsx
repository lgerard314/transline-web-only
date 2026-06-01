import { REMEDIATION as c } from "@/lib/content/service-environmental-remediation";
import { HeroSection } from "./sections/01-hero";
import { WhatWeDoSection } from "./sections/02-what-we-do";
import { IndustriesSection } from "./sections/03-industries";
import { ProcessSection } from "./sections/04-process";
import { VideosSection } from "./sections/05-videos";
import { CaseStudiesSection } from "./sections/06-case-studies";
import { WhyChooseSection } from "./sections/07-why-choose";
import { CtaSection } from "./sections/08-cta";
import { RelatedSection } from "./sections/09-related";

export const metadata = {
  title: "Environmental Remediation Services",
  description: c.hero.lead,
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
      <VideosSection />
      <CaseStudiesSection />
      <WhyChooseSection />
      <CtaSection />
      <RelatedSection />
    </>
  );
}
