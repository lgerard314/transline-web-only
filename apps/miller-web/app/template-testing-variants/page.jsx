import "./../template-testing/template-testing.css";
import { MediaSplit01 } from "@/components-v2/06_sections/splits/media-split-01";
import { MonumentHero01 } from "@/components-v2/06_sections/heroes/monument-hero-01";
import { FACILITY, HERO } from "@/lib/content/template-testing-home";

export const metadata = { title: "TT variants", robots: { index: false, follow: false } };

export default function P() {
  return (
    <>
      {/* tokens override demo: recolor the signature accent on the hero subtree. */}
      <MonumentHero01 content={HERO} config={{ tokens: { "--c-accent": "#7a3d12" } }} />
      {/* scheme demo: `.mw-fac2` surface is `--c-surface-warm`; `cream` remaps it to `--c-bg`. */}
      <MediaSplit01 content={FACILITY} config={{ scheme: "cream" }} />
      {/* layout demo: reverse the facility split columns above the breakpoint. */}
      <MediaSplit01 content={FACILITY} config={{ layout: "reverse" }} />
    </>
  );
}
