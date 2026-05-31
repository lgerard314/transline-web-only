import { HeroSection } from "./sections/01-hero";
import { WhyMillerSection } from "./sections/02-why-miller";
import { OpenPositionsSection } from "./sections/03-open-positions";
import { BenefitsTeaserSection } from "./sections/04-benefits-teaser";
import { DeiSection } from "./sections/05-dei";
import { CloseSection } from "./sections/06-close";

export const metadata = {
  title: "Careers",
  description:
    "Join the Miller Environmental team — current openings, core values, total rewards, and our commitment to a diverse and inclusive workforce.",
  alternates: { canonical: "/careers/" },
};

export default function CareersPage() {
  return (
    <>
      <HeroSection />
      <WhyMillerSection />
      <OpenPositionsSection />
      <BenefitsTeaserSection />
      <DeiSection />
      <CloseSection />
    </>
  );
}
