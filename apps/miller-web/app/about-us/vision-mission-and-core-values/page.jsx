import { HeroSection } from "./sections/01-hero";
import { ProseContainerSection, ProseSection } from "./sections/02-prose";
import { CoreValuesSection } from "./sections/03-core-values";

export const metadata = { title: "Vision, Mission and Core Values" };

export default function VisionMissionAndCoreValuesPage() {
  return (
    <>
      <HeroSection />
      <ProseContainerSection>
        <ProseSection />
        <CoreValuesSection />
      </ProseContainerSection>
    </>
  );
}
