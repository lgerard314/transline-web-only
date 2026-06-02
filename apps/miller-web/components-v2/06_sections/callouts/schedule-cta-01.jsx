import { ScheduleForm } from "@/components/ScheduleForm";
import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";

// ScheduleCta01 — full-bleed scheduling CTA (mw-sched).
// Source of truth: apps/miller-web/app/industrial-services/customer-waste-collection/sections/05-cta.jsx
// content keys: eyebrow, title, titleEm, body, nextEyebrow, next[] ({ num, name, text }), formTitle
// titleId is sourced from the adapter (e.g. "cwc-cta-title") and passed in content.titleId.
export function ScheduleCta01({ content, config = {} }) {
  return (
    <section className="mw-sched" aria-labelledby={content.titleId} {...sectionProps(config)}>
      <div className="mw-sched__bg" aria-hidden="true" />
      <div className="mw-sched__inner mw-inner">
        <div className="mw-sched__grid">
          <div className="mw-sched__panel">
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label mw-section-tag-label--invert">{content.eyebrow}</span>
            </p>
            <h2 id={content.titleId} className="mw-section-title mw-sched__title" data-reveal>
              {content.title}{" "}
              <em className="mw-sched__title-em"><StopText>{content.titleEm}</StopText></em>
            </h2>
            <p className="mw-sched__body" data-reveal>{content.body}</p>

            <div className="mw-sched__next">
              <p className="mw-sched__next-eyebrow" data-reveal>{content.nextEyebrow}</p>
              <ol className="mw-sched__steps" data-reveal-stagger>
                {content.next.map((n) => (
                  <li key={n.num} className="mw-sched__step">
                    <span className="mw-sched__step-num" aria-hidden="true">{n.num}</span>
                    <div className="mw-sched__step-body">
                      <h3 className="mw-sched__step-name">{n.name}</h3>
                      <p className="mw-sched__step-text">{n.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mw-sched__form-col">
            <div className="mw-sched__card" data-reveal>
              <div className="mw-sched__card-head">
                <p className="mw-sched__form-title">{content.formTitle}</p>
              </div>
              <ScheduleForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
