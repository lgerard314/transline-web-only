import { ScheduleForm } from "@/components/ScheduleForm";
import { customerWasteCollection as c } from "@/lib/content/service-customer-waste-collection";
import { StopText } from "@/components/StopText";

// §5 — Get on the schedule. Two columns: a deep-walnut "what happens next"
// panel (carries the section heading + 24/7 line) and a brand-new, purpose-
// built pickup-scheduling form floating as a cream card. DOM order is panel-
// first so the heading introduces the form for assistive tech; CSS floats the
// form to the left on desktop.
export function CtaSection() {
  const h = c.hero;
  const cta = c.cta;
  return (
    <section className="mw-sched" aria-labelledby="cwc-cta-title">
      <div className="mw-sched__inner mw-inner">
        <div className="mw-sched__grid">
          <div className="mw-sched__panel" data-reveal>
            <p className="mw-section-tag" aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label mw-section-tag-label--invert">{cta.eyebrow}</span>
            </p>
            <h2 id="cwc-cta-title" className="mw-section-title mw-sched__title">
              {cta.title}{" "}
              <em className="mw-sched__title-em"><StopText>{cta.titleEm}</StopText></em>
            </h2>
            <p className="mw-sched__body">{cta.body}</p>

            <div className="mw-sched__next">
              <p className="mw-sched__next-eyebrow">{cta.nextEyebrow}</p>
              <ol className="mw-sched__steps">
                {cta.next.map((n) => (
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

            <a
              href={h.emergencyHref}
              className="mw-sched__hotline"
              aria-label={`Call the 24/7 emergency line: ${h.emergencyDisplay}`}
            >
              <span className="mw-sched__hotline-dot" aria-hidden="true" />
              <span className="mw-sched__hotline-text">
                <span className="mw-sched__hotline-sup">24/7 emergency line</span>
                <span className="mw-sched__hotline-num">{h.emergencyDisplay}</span>
              </span>
              <span className="mw-sched__hotline-arrow" aria-hidden="true">→</span>
            </a>
          </div>

          <div className="mw-sched__form-col" data-reveal>
            <div className="mw-sched__card">
              <div className="mw-sched__card-head">
                <p className="mw-sched__form-title">{cta.formTitle}</p>
                <p className="mw-sched__form-note">{cta.formNote}</p>
              </div>
              <ScheduleForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
