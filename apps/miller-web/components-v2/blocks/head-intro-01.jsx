// L1 · head-intro-01 — canonical section header (mw-section-head):
// eyebrow -> title -> intro. title is a node (already includes its stop).
import { Eyebrow01 } from "@/components-v2/items/eyebrow-01";

export function HeadIntro01({ eyebrow, headingId, title, intro, stagger = true }) {
  const staggerAttr = stagger ? { "data-reveal-stagger": "" } : {};
  return (
    <header className="mw-section-head mw-services__head" {...staggerAttr}>
      <Eyebrow01 label={eyebrow} />
      <h2 id={headingId} className="mw-section-title">{title}</h2>
      <p className="mw-services__intro">{intro}</p>
    </header>
  );
}
