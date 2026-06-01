import { ScheduleForm } from "@/components/ScheduleForm";
import { customerWasteCollection as c } from "@/lib/content/service-customer-waste-collection";
import { StopText } from "@/components/StopText";

// §5 — Get on the schedule. Two columns: a deep-walnut "what happens next"
// panel on the left (carries the section heading + 24/7 line) and the purpose-
// built pickup-scheduling form on the right, floating as a dark-glass card over
// a truck photo that full-bleeds the right half of the section.
export function CtaSection() {
  const cta = c.cta;
  return (
    <section className="mw-sched" aria-labelledby="cwc-cta-title">
      <div className="mw-sched__bg" aria-hidden="true" />
      <div className="mw-sched__inner mw-inner">
        <div className="mw-sched__grid">
          <div className="mw-sched__panel">
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label mw-section-tag-label--invert">{cta.eyebrow}</span>
            </p>
            <h2 id="cwc-cta-title" className="mw-section-title mw-sched__title" data-reveal>
              {cta.title}{" "}
              <em className="mw-sched__title-em"><StopText>{cta.titleEm}</StopText></em>
            </h2>
            <p className="mw-sched__body" data-reveal>{cta.body}</p>

            <div className="mw-sched__next">
              <p className="mw-sched__next-eyebrow" data-reveal>{cta.nextEyebrow}</p>
              <ol className="mw-sched__steps" data-reveal-stagger>
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
          </div>

          <div className="mw-sched__form-col">
            <div className="mw-sched__card" data-reveal>
              <div className="mw-sched__card-head">
                <p className="mw-sched__form-title">{cta.formTitle}</p>
              </div>
              <ScheduleForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
