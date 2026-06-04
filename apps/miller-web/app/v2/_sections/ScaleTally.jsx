import { MxTallyReel } from "../_components/MxTallyReel";
import { CustodyRule } from "../_components/CustodyThread";

// Σ · TO DATE — THE money shot. A three-diamond "reel" of lifetime highlights
// that auto-advances once the section scrolls into view: each crescendo number
// counts up inside its diamond seal while the seal draws closed in lockstep,
// then the diamond parks aside as the next enters centred. Short labels sit
// beneath each; the fuller story surfaces on hover/tap over the numeral. The
// frame you would submit to Awwwards. Dark surface with a soft radial warmth.
// Sequence, responsive collapse, and reduced-motion handling live in MxTallyReel.
export function ScaleTally({ content }) {
  const c = content;
  return (
    <section className="mx-scale mx-section mx-dark-2 mx-section" aria-labelledby={c.headingId}>
      <CustodyRule />
      <span className="mx-scale__glow" aria-hidden="true" />
      <div className="mx-inner mx-scale__inner">
        <MxTallyReel
          eyebrow={
            <p className="mx-field mx-field--on-dark mx-scale__field" id={c.headingId}>
              <span>{c.field}</span>
              <span className="mx-field__rule" />
              <span>{c.eyebrow}</span>
            </p>
          }
          highlights={c.highlights}
        />
      </div>
    </section>
  );
}
