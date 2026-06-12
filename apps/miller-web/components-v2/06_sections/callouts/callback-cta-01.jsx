import { ContactForm } from "@/components/ContactForm";
import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";

// L3 · callback-cta-01 — light conversion close (REM v2 §7; the dark
// anchor is §6's screening room, and the related rail follows light per
// §12). Pitch + "what we'll ask" checklist left; form card RIGHT crowned
// with a dark walnut header band carrying the form title and the 24/7
// line — the card reads as a dispatch ticket. Shared ContactForm composed;
// light-card label/error re-binds live in this page's CSS.
//
// content: { titleId, eyebrow, title, titleEm, body, askEyebrow,
//            ask[string], formTitle, formNote,
//            emergencyDisplay, emergencyHref }
// config:  standard sectionProps passthrough.
export function CallbackCta01({ content, config = {} }) {
  return (
    <section className="mw-rem2-cta" aria-labelledby={content.titleId} {...sectionProps(config)}>
      <div className="mw-rem2-cta__inner mw-inner">
        <div className="mw-rem2-cta__grid">
          <div className="mw-rem2-cta__panel">
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{content.eyebrow}</span>
            </p>
            <h2 id={content.titleId} className="mw-section-title mw-rem2-cta__title" data-reveal>
              {content.title}{" "}
              <em className="mw-rem2-cta__title-em"><StopText>{content.titleEm}</StopText></em>
            </h2>
            <p className="mw-rem2-cta__body" data-reveal>{content.body}</p>

            <p className="mw-rem2-cta__ask-cap" data-reveal aria-hidden="true">
              <span className="mw-rem2-cta__ask-cap-mark" />
              {content.askEyebrow}
            </p>
            <ul className="mw-rem2-cta__ask" data-reveal-stagger>
              {content.ask.map((a) => (
                <li key={a} className="mw-rem2-cta__ask-row">
                  <span className="mw-rem2-cta__ask-mark" aria-hidden="true" />
                  <span className="mw-rem2-cta__ask-text">{a}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mw-rem2-cta__form-col" data-reveal>
            <div className="mw-rem2-cta__card">
              <div className="mw-rem2-cta__card-crown">
                <p className="mw-rem2-cta__form-title">{content.formTitle}</p>
                <a
                  href={content.emergencyHref}
                  className="mw-rem2-cta__crown-line"
                  aria-label={`Call 24/7 emergency: ${content.emergencyDisplay}`}
                >
                  <span className="mw-rem2-cta__crown-dot" aria-hidden="true" />
                  {content.emergencyDisplay}
                </a>
              </div>
              <div className="mw-rem2-cta__card-body">
                <ContactForm showOptionalFields={false} />
              </div>
            </div>
            <p className="mw-rem2-cta__card-note">
              <span className="mw-rem2-cta__card-note-mark" aria-hidden="true" />
              {content.formNote}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
