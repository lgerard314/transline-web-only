import { HeadingSection } from "./sections/01-heading";
import { ServicesGridSection } from "./sections/02-services-grid";
import { EmergencySection } from "./sections/03-emergency";

// Services landing page — simple grid + emergency callout (no hero).
export const metadata = { title: "Industrial Services" };

export default function ServicesLandingPage() {
  return (
    <>
      <HeadingSection />
      <ServicesGridSection />
      <EmergencySection />
    </>
  );
}
