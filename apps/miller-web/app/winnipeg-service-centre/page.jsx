import { winnipegServiceCentre as c } from "@/lib/content/winnipeg-service-centre";
import { HeroSection } from "./sections/01-hero";
import { AddressMapSection } from "./sections/02-address-map";
import { CapabilitiesSection } from "./sections/03-capabilities";
import { ContactSection } from "./sections/04-contact";

export const metadata = {
  title: "Winnipeg Service Centre",
  description: c.hero.lead,
};

export default function WinnipegServiceCentrePage() {
  return (
    <>
      <HeroSection />
      <AddressMapSection />
      <CapabilitiesSection />
      <ContactSection />
    </>
  );
}
