import { HeroSection } from "./sections/01-hero";
import { ProseSection } from "./sections/02-prose";

export const metadata = { title: "Benefits & Rewards" };

export default function BenefitsRewardsPage() {
  return (
    <>
      <HeroSection />
      <ProseSection />
    </>
  );
}
