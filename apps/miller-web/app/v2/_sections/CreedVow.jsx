import { CustodyRule } from "../_components/CustodyThread";
import { MxStop } from "../_components/marks";

// CLAUSE — THE STANDARD. The de-statted creed: a pure typographic vow (no giant
// number — that is reserved for ScaleTally). The statement rises line by line;
// the closing clause settles from ink to clay as it lands, and the stamp drops
// last. A quiet, wide band between the certified strip and the services ledger.
export function CreedVow({ content }) {
  const c = content;
  // Break the lead into two display lines at its midpoint so each masked line
  // fits its column (the line-rise wrapper clips horizontal overflow).
  const words = c.statement.lead.split(" ");
  const mid = Math.ceil(words.length / 2);
  const leadA = words.slice(0, mid).join(" ");
  const leadB = words.slice(mid).join(" ");
  return (
    <section className="mx-creed mx-section mx-cream" aria-labelledby={c.headingId}>
      <CustodyRule />
      <div className="mx-inner mx-creed__inner">
        <p className="mx-field">
          <span>{c.eyebrow}</span>
          <span className="mx-field__rule" />
          <span>{c.field}</span>
        </p>
        <h2 id={c.headingId} className="mx-creed__statement" data-mx-reveal="line">
          <span className="mx-line"><span className="mx-line__in">{leadA}</span></span>
          <span className="mx-line"><span className="mx-line__in">{leadB}</span></span>
          <span className="mx-line"><span className="mx-line__in mx-creed__em">{c.statement.em}<MxStop /></span></span>
        </h2>
        <p className="mx-creed__body" data-mx-reveal="fade">{c.body}</p>
      </div>
    </section>
  );
}
