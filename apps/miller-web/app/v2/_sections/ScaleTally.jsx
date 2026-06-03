import { MxTally } from "../_components/MxTally";
import { CustodyRule, CustodyNode } from "../_components/CustodyThread";

// Σ · TO DATE — THE money shot. The single crescendo number: it counts up inside
// the diamond seal, the seal draws closed on the final value (one continuous
// gesture), a divider draws, and the supporting trio staggers in. This is the
// frame you would submit to Awwwards. Dark surface with a soft radial warmth
// behind the seal. Sequence + reduced-motion handling live in MxTally.
export function ScaleTally({ content }) {
  const c = content;
  return (
    <section className="mx-scale mx-section mx-dark-2 mx-section" aria-labelledby={c.headingId}>
      <CustodyRule />
      <CustodyNode />
      <span className="mx-scale__glow" aria-hidden="true" />
      <div className="mx-inner mx-scale__inner">
        <MxTally
          eyebrow={
            <p className="mx-field mx-field--on-dark mx-scale__field" id={c.headingId}>
              <span>{c.field}</span>
              <span className="mx-field__rule" />
              <span>{c.eyebrow}</span>
            </p>
          }
          figure={c.figure}
          unit={c.figure.unit}
          body={c.body}
          support={c.support}
        />
      </div>
    </section>
  );
}
