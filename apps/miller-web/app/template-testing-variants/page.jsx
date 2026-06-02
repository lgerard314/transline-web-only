import "./../template-testing/template-testing.css";
import { MediaSplit01 } from "@/components-v2/06_sections/splits/media-split-01";
import { MonumentHero01 } from "@/components-v2/06_sections/heroes/monument-hero-01";
import { FACILITY, HERO } from "@/lib/content/template-testing-home";

export const metadata = { title: "TT variants", robots: { index: false, follow: false } };

export default function P() {
  return (
    <>
      <MonumentHero01 content={HERO} config={{ scheme: "cream", tokens: { "--c-accent": "#7a3d12" } }} />
      <MediaSplit01 content={FACILITY} config={{ layout: "reverse" }} />
    </>
  );
}
