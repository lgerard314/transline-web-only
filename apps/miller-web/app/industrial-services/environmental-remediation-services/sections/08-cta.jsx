import { ContactForm } from "@/components/ContactForm";
import { REMEDIATION as c } from "@/lib/content/service-environmental-remediation";
import { StopText } from "@/components/StopText";

// §8 — Closing CTA. Dark walnut dispatch panel: the callback form floats as a
// warm cream card on the left; the 24/7 hotline is the focal element on the right.
export function CtaSection() {
  const h = c.hero;
  const cta = c.cta;
  return (
    <section className="mw-svc-cta mw-svc-cta--dark" aria-labelledby="rem-cta-title">
      <div className="mw-svc-cta__inner mw-inner mw-svc-cta__grid mw-svc-cta__grid--reverse">
        <div className="mw-svc-cta__form-col" data-reveal>
          <div className="mw-svc-cta__form">
            <div className="mw-svc-cta__form-head">
              <p className="mw-svc-cta__form-title">{cta.formTitle}</p>
              <p className="mw-svc-cta__form-note">{cta.formNote}</p>
            </div>
            <ContactForm showOptionalFields={false} />
          </div>
        </div>

        <div className="mw-svc-cta__content" data-reveal>
          <p className="mw-section-tag" aria-hidden="true">
            <span className="mw-section-tag-mark" />
            <span className="mw-section-tag-label">{cta.eyebrow}</span>
          </p>
          <h2 id="rem-cta-title" className="mw-section-title mw-svc-cta__title">
            {cta.title}{" "}
            <em className="mw-svc-cta__title-em">{cta.titleEm}</em>{" "}
            <StopText>{cta.titleAfter}</StopText>
          </h2>
          <p className="mw-svc-cta__body">{cta.body}</p>

          <div className="mw-svc-cta__dispatch">
            <div className="mw-svc-cta__dispatch-row">
              <img
                className="mw-svc-cta__dispatch-logo"
                src="/miller/logo/miller-logomark.webp"
                alt=""
                aria-hidden="true"
              />
              <a
                href={h.emergencyHref}
                className="mw-svc-cta__hotline"
                aria-label={`Call the 24/7 emergency line: ${h.emergencyDisplay}`}
              >
                <span className="mw-svc-cta__hotline-dot" aria-hidden="true" />
                <span className="mw-svc-cta__hotline-text">
                  <span className="mw-svc-cta__hotline-sup">24/7 emergency line</span>
                  <span className="mw-svc-cta__hotline-num">{h.emergencyDisplay}</span>
                </span>
              </a>
            </div>
            <p className="mw-svc-cta__hotline-note">
              Answered by a trained responder — every hour, every day of the year.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
