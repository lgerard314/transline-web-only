import { HeroSection } from "./sections/01-hero";
import { AddressMapSection } from "./sections/02-address-map";
import { CapabilitiesSection } from "./sections/03-capabilities";
import { ContactSection } from "./sections/04-contact";

export const metadata = { title: "Treatment Facility (VBEC)" };

export default function TreatmentFacilityPage() {
  return (
    <>
      <HeroSection />
      <AddressMapSection />
      <CapabilitiesSection />
      <ContactSection />
    </>
  );
}
