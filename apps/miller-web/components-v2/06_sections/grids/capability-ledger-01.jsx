import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";

// L3 · capability-ledger-01 — six capabilities as a type-led ledger sheet
// (REM v2 §3). Deliberately typographic: the page is image-heavy on both
// sides of this section, so the ledger is a 3×2 sheet of shared-border
// cells (no photos) — name + mono tag + two-line body + corner diamond
// that fills on hover. No leading numbers on stacked lists.
//
// content: { titleId, eyebrow, title, lead, items[{ name, tag, body }] }
// config:  standard sectionProps passthrough.
export function CapabilityLedger01({ content, config = {} }) {
  return (
    <section className="mw-rem2-cap" aria-labelledby={content.titleId} {...sectionProps(config)}>
      <div className="mw-rem2-cap__inner mw-inner">
        <header className="mw-rem2-cap__head">
          <div>
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{content.eyebrow}</span>
            </p>
            <h2 id={content.titleId} className="mw-section-title mw-rem2-cap__title" data-reveal>
              <StopText>{content.title}</StopText>
            </h2>
          </div>
          <p className="mw-rem2-cap__lead" data-reveal>{content.lead}</p>
        </header>

        <ul className="mw-rem2-cap__sheet" data-reveal-stagger>
          {content.items.map((it) => (
            <li key={it.name} className="mw-rem2-cap__cell">
              <span className="mw-rem2-cap__corner" aria-hidden="true" />
              <p className="mw-rem2-cap__tag">{it.tag}</p>
              <h3 className="mw-rem2-cap__name">{it.name}</h3>
              <p className="mw-rem2-cap__body">{it.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
