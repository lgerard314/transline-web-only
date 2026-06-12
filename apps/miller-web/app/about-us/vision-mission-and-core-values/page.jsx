import { ManifestoHero01 } from "@/components-v2/06_sections/heroes/manifesto-hero-01";
import { CreedBand01 } from "@/components-v2/06_sections/statements/creed-band-01";
import { ValuesGrid01 } from "@/components-v2/06_sections/grids/values-grid-01";
import { DoorsClose01 } from "@/components-v2/06_sections/callouts/doors-close-01";
import { visionMissionValues as c } from "@/lib/content/vision-mission-values";

// VMV v2 — the "company creed" page. Thin composition only: the creed
// diptych (vision on cream, mission on walnut, both with the marker-sweep
// scroll signature) between a manifesto masthead, the staggered values
// grid, and the two-door close.

export const metadata = {
  title: "Vision, Mission and Core Values",
  description: c.vision.statement,
  alternates: { canonical: "/about-us/vision-mission-and-core-values/" },
};

export default function VisionMissionAndCoreValuesPage() {
  return (
    <>
      <ManifestoHero01 content={c.hero} />
      <CreedBand01 content={c.vision} />
      <CreedBand01 content={c.mission} config={{ scheme: "dark", flip: true }} />
      <ValuesGrid01 content={c.values} />
      <DoorsClose01 content={c.close} />
    </>
  );
}
