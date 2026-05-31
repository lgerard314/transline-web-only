import { HeroSection } from "./sections/01-hero";
import { BodySection } from "./sections/02-body";
import { RelatedSection } from "./sections/03-related";

export const metadata = { title: "Vacuum Truck" };

export default function VacuumTruckPage() {
  return (
    <>
      <HeroSection />
      <BodySection />
      <RelatedSection />
    </>
  );
}
