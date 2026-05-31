import { HeroSection } from "./sections/01-hero";
import { ProseContainerSection, ProseSection } from "./sections/02-prose";
import { LinksGridSection } from "./sections/03-links-grid";

export const metadata = {
  title: "About Miller Environmental",
  description:
    "Miller Environmental's company history, the Vaughn Bullough story, and our mission. Manitoba-based hazardous waste management with three ISO certifications.",
  alternates: { canonical: "/about-us/" },
};

export default function AboutIndexPage() {
  return (
    <>
      <HeroSection />
      <ProseContainerSection>
        <ProseSection />
        <LinksGridSection />
      </ProseContainerSection>
    </>
  );
}
