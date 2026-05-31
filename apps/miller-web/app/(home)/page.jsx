import { OVER_25_YEARS } from "../../lib/content/brand";
import { AffiliatesBanner } from "./banners/affiliates";
import { CertsBanner } from "./banners/certs";
import { HeroSection } from "./sections/01-hero";
import { ServicesSection } from "./sections/02-services";
import { SectorsSection } from "./sections/03-sectors";
import { FacilitySection } from "./sections/04-facility";
import { HistorySection } from "./sections/05-history";
import { CareersSection } from "./sections/06-careers";
import { FinalCtaSection } from "./sections/07-final-cta";

export const metadata = {
  title: "Miller Environmental — Hazardous Waste Management",
  description: `Manitoba-based hazardous waste management with three ISO certifications and ${OVER_25_YEARS.toLowerCase()} of operating history. Routine pickup, scheduled treatment, and 24/7 emergency response.`,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* High-priority preload for the hero background — the LCP element on
          mobile. React 19 hoists <link> tags into <head>. */}
      <link
        rel="preload"
        href="/miller/hero/home-frame-1.webp"
        as="image"
        fetchPriority="high"
      />
      <HeroSection />
      <CertsBanner />
      <ServicesSection />
      <SectorsSection />
      <FacilitySection />
      <HistorySection />
      <CareersSection />
      <AffiliatesBanner />
      <FinalCtaSection />
    </>
  );
}
