import { CustodyRule, CustodyNode } from "../_components/CustodyThread";
import { MxArrow } from "../_components/marks";

// 02 · SERVICES — the line-item ledger. Each service is a numbered ledger entry
// the custody thread runs through: lineNo · title · scope · a hairline baseline.
// At rest the rows carry full document weight (no hover required — the cold-
// scroll gate). The user-driven move is row-local: on hover the baseline draws
// clay, the line-number stamps, the arrow advances. The cross-border entry is
// the one external (countersigned) line at the foot of the index.
export function ServicesIndex({ content }) {
  const c = content;
  return (
    <section className="mx-svcs mx-section mx-cream" aria-labelledby={c.headingId}>
      <CustodyRule />
      <CustodyNode />
      <div className="mx-inner">
        <div className="mx-svcs__head">
          <p className="mx-field">
            <span>{c.stage}</span>
            <span className="mx-field__rule" />
            <span>{c.field}</span>
          </p>
          <h2 id={c.headingId} className="mx-h2">
            {c.title.lead} <span className="mx-h2__em">{c.title.em}</span>
          </h2>
          <p className="mx-lead">{c.intro}</p>
        </div>

        {/* per-row fade (not container-stagger): a long ledger must not carry an
            accumulating index delay — each row settles as it enters view */}
        <ul className="mx-svcs__ledger">
          {c.items.map((s) => (
            <li className="mx-svcs__row" key={s.slug} data-mx-reveal="fade">
              <a className="mx-svcs__link" href={s.href}>
                <span className="mx-svcs__no">{s.lineNo}</span>
                <span className="mx-svcs__main">
                  <span className="mx-svcs__title">{s.title}</span>
                  <span className="mx-svcs__sum">{s.summary}</span>
                </span>
                <span className="mx-svcs__go"><MxArrow /></span>
                <span className="mx-svcs__base" aria-hidden="true" />
              </a>
            </li>
          ))}
          <li className="mx-svcs__row mx-svcs__row--ext" data-mx-reveal="fade">
            <a className="mx-svcs__link" href={c.external.href} target="_blank" rel="noopener noreferrer">
              <span className="mx-svcs__no">{c.external.lineNo}</span>
              <span className="mx-svcs__main">
                <span className="mx-svcs__title">{c.external.title} <span className="mx-svcs__ext">↗ TransLine49</span></span>
                <span className="mx-svcs__sum">{c.external.summary}</span>
              </span>
              <span className="mx-svcs__go"><MxArrow /></span>
              <span className="mx-svcs__base" aria-hidden="true" />
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
