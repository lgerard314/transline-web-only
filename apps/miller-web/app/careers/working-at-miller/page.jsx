import { HeroSection } from "./sections/01-hero";
import { ProseSection } from "./sections/02-prose";

export const metadata = { title: "Working at Miller" };

export default function WorkingAtMillerPage() {
  return (
    <>
      <HeroSection />
      <ProseSection />
    </>
  );
}
