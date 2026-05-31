import { HeroSection } from "./sections/01-hero";
import { GridSection } from "./sections/02-grid";

export const metadata = { title: "Case Studies" };

export default function CaseStudiesIndexPage() {
  return (
    <>
      <HeroSection />
      <GridSection />
    </>
  );
}
