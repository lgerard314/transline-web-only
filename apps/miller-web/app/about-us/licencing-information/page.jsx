import { HeroSection } from "./sections/01-hero";
import { ProseSection } from "./sections/02-prose";
import { LicencesGridSection } from "./sections/03-licences-grid";

export const metadata = { title: "Licencing Information" };

export default function LicencingInformationPage() {
  return (
    <>
      <HeroSection />
      <ProseSection />
      <LicencesGridSection />
    </>
  );
}
