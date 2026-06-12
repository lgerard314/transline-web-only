import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";

// L3 · escalation-band-01 — the page's single dark-walnut anchor (PM v2 §5):
// the ER → Projects continuity statement. Statement panel + 24/7 dispatch
// block over a full-width handoff meter (emergency response ◆ projects
// group). §12 dark-section text colors (careers band). Standard reveals
// only — no new motion mechanics.
//
// content: { titleId, eyebrow, title, titleEm, body,
//            meter { from, to }, emergencyDisplay, emergencyHref,
//            hotlineNote }
// config:  standard sectionProps passthrough.
export function EscalationBand01({ content, config = {} }) {
  return (
    <section className="mw-pm-esc" aria-labelledby={content.titleId} {...sectionProps(config)}>
      <div className="mw-pm-esc__inner mw-inner">
        <div className="mw-pm-esc__grid">
          <div className="mw-pm-esc__panel">
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{content.eyebrow}</span>
            </p>
            <h2 id={content.titleId} className="mw-section-title mw-pm-esc__title" data-reveal>
              {content.title}{" "}
              <em className="mw-pm-esc__title-em"><StopText>{content.titleEm}</StopText></em>
            </h2>
            <p className="mw-pm-esc__body" data-reveal>{content.body}</p>
          </div>

          <div className="mw-pm-esc__dispatch" data-reveal>
            <a
              href={content.emergencyHref}
              className="mw-pm-esc__hotline"
              aria-label={`Call the 24/7 emergency line: ${content.emergencyDisplay}`}
            >
              <img
                className="mw-pm-esc__hotline-logo"
                src="/miller/logo/miller-logomark-1.webp"
                alt=""
                aria-hidden="true"
              />
              <span className="mw-pm-esc__hotline-text">
                <span className="mw-pm-esc__hotline-sup">24/7 emergency line</span>
                <span className="mw-pm-esc__hotline-num">{content.emergencyDisplay}</span>
              </span>
            </a>
            <p className="mw-pm-esc__hotline-note">{content.hotlineNote}</p>
          </div>
        </div>

        <div className="mw-pm-esc__meter" data-reveal aria-hidden="true">
          <span className="mw-pm-esc__meter-end">{content.meter.from}</span>
          <span className="mw-pm-esc__meter-line">
            <span className="mw-pm-esc__meter-mark" />
          </span>
          <span className="mw-pm-esc__meter-end mw-pm-esc__meter-end--to">{content.meter.to}</span>
        </div>
      </div>
    </section>
  );
}
