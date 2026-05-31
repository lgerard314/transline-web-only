import { HeroSection } from "./sections/01-hero";
import { ProseSection } from "./sections/02-prose";
import { CertificationsSection } from "./sections/03-certifications";

export const metadata = {
  title: "Quality Assurance",
  description:
    "Miller Environmental's integrated management system covers ISO 9001:2015, ISO 14001:2015, ISO 45001:2018, and MHCA COR 2023 — the only such combination at a Canadian hazardous waste management company.",
  alternates: { canonical: "/about-us/quality-assurance/" },
};

export default function QualityAssurancePage() {
  return (
    <>
      <HeroSection />
      <ProseSection />
      <CertificationsSection />
    </>
  );
}
