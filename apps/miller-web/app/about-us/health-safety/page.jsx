import { HeroSection } from "./sections/01-hero";
import { ProseSection } from "./sections/02-prose";

export const metadata = { title: "Health & Safety" };

export default function HealthSafetyPage() {
  return (
    <>
      <HeroSection />
      <ProseSection />
    </>
  );
}
