import { ScheduleForm } from "@/components/ScheduleForm";
import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";

// L3 · schedule-cta-02 — light closing CTA (CWC v2 §6). The page's dark
// anchor moved to the fleet section (§4), so the conversion close is a warm
// split panel per §12 ("the last section before the footer is never dark" —
// the related rail follows, also light): pitch + what-happens-next steps
// beside a white form card with a clay top edge. Reuses the shared
// ScheduleForm (composed, not forked; its dark-card label colors are
// re-bound for the light card in this page's CSS). data-reveal sits on the
// form column wrapper, not the card, so the card's focus-within lift can't
// be overridden by the reveal's fill-mode (§13).
//
// content: { titleId, eyebrow, title, titleEm, body, formTitle, nextEyebrow,
//            next[{ num, name, text }] }
// config:  standard sectionProps passthrough.
export function ScheduleCta02({ content, config = {} }) {
  return (
    <section className="mw-cwc-sched" aria-labelledby={content.titleId} {...sectionProps(config)}>
      <div className="mw-cwc-sched__inner mw-inner">
        <div className="mw-cwc-sched__grid">
          <div className="mw-cwc-sched__panel">
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{content.eyebrow}</span>
            </p>
            <h2 id={content.titleId} className="mw-section-title mw-cwc-sched__title" data-reveal>
              {content.title}{" "}
              <em className="mw-cwc-sched__title-em"><StopText>{content.titleEm}</StopText></em>
            </h2>
            <p className="mw-cwc-sched__body" data-reveal>{content.body}</p>

            {/* Mono caps label only — a diamond here made the section read
                as opening twice (consult, 2026-06-12). */}
            <p className="mw-cwc-sched__next-cap" data-reveal aria-hidden="true">
              {content.nextEyebrow}
            </p>
            <ol className="mw-cwc-sched__steps" data-reveal-stagger>
              {content.next.map((n) => (
                <li key={n.name} className="mw-cwc-sched__step">
                  <span className="mw-cwc-sched__step-mark" aria-hidden="true" />
                  <div className="mw-cwc-sched__step-body">
                    <h3 className="mw-cwc-sched__step-name">{n.name}</h3>
                    <p className="mw-cwc-sched__step-text">{n.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mw-cwc-sched__form-col" data-reveal>
            <div className="mw-cwc-sched__card">
              <p className="mw-cwc-sched__form-title">{content.formTitle}</p>
              <ScheduleForm />
            </div>
            {/* Quiet mono microcopy, no diamond (consult, 2026-06-12). */}
            {content.formNote && (
              <p className="mw-cwc-sched__card-note">{content.formNote}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
