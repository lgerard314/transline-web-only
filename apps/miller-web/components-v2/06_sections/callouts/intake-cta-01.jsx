import { ContactForm } from "@/components/ContactForm";
import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";

// L3 · intake-cta-01 — light conversion close (PM v2 §6). The dark anchor is
// §5's escalation band, so the close stays warm per §12 (rail follows, also
// light). Layout mirrors the dossier motif: the form card sits LEFT with a
// drafting-strip header and a 1.5px ink border (the hero title block's
// frame), beside a pitch + "what to have ready" checklist. Shared
// ContactForm composed, not forked; its dark-card label colors are re-bound
// for the light card in this page's CSS. data-reveal sits on the form
// column wrapper, not the card, so focus-within lift isn't overridden by
// the reveal's fill-mode (§13).
//
// content: { titleId, eyebrow, title, titleEm, body, readyEyebrow,
//            ready[string], formTitle, formNote }
// config:  standard sectionProps passthrough.
export function IntakeCta01({ content, config = {} }) {
  return (
    <section className="mw-pm-intake" aria-labelledby={content.titleId} {...sectionProps(config)}>
      <div className="mw-pm-intake__inner mw-inner">
        <div className="mw-pm-intake__grid">
          <div className="mw-pm-intake__form-col" data-reveal>
            <div className="mw-pm-intake__card">
              <p className="mw-pm-intake__form-title">
                <span className="mw-pm-intake__form-mark" aria-hidden="true" />
                {content.formTitle}
              </p>
              <ContactForm showOptionalFields={false} />
            </div>
            <p className="mw-pm-intake__card-note">
              <span className="mw-pm-intake__card-note-mark" aria-hidden="true" />
              {content.formNote}
            </p>
          </div>

          <div className="mw-pm-intake__panel">
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{content.eyebrow}</span>
            </p>
            <h2 id={content.titleId} className="mw-section-title mw-pm-intake__title" data-reveal>
              {content.title}{" "}
              <em className="mw-pm-intake__title-em"><StopText>{content.titleEm}</StopText></em>
            </h2>
            <p className="mw-pm-intake__body" data-reveal>{content.body}</p>

            <p className="mw-pm-intake__ready-cap" data-reveal aria-hidden="true">
              <span className="mw-pm-intake__ready-cap-mark" />
              {content.readyEyebrow}
            </p>
            <ul className="mw-pm-intake__ready" data-reveal-stagger>
              {content.ready.map((r) => (
                <li key={r} className="mw-pm-intake__ready-row">
                  <span className="mw-pm-intake__ready-mark" aria-hidden="true" />
                  <span className="mw-pm-intake__ready-text">{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
