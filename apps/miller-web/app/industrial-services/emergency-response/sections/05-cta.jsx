import { ContactForm } from "@/components/ContactForm";
import { emergencyResponse as c } from "@/lib/content/service-emergency-response";

// §5 — Closing CTA. Dark walnut "after-hours dispatch" panel: the 24/7 hotline
// is the focal element; the contact form floats as a warm cream card.
export function CtaSection() {
  const h = c.hero;
  const cta = c.cta;
  return (
    <section className="mw-svc-cta mw-svc-cta--dark" aria-labelledby="er-cta-title">
      <span className="mw-svc-cta__diamond" aria-hidden="true" />
      <div className="mw-svc-cta__inner mw-inner mw-svc-cta__grid">
        <div className="mw-svc-cta__content" data-reveal>
          <p className="mw-section-tag" aria-hidden="true">
            <span className="mw-section-tag-mark" />
            <span className="mw-section-tag-label">{cta.eyebrow}</span>
          </p>
          <h2 id="er-cta-title" className="mw-section-title mw-svc-cta__title">
            {cta.title}<span className="mw-stop" aria-hidden="true" />
          </h2>
          <p className="mw-svc-cta__body">{cta.body}</p>

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
            <span className="mw-svc-cta__hotline-arr" aria-hidden="true">→</span>
          </a>
          <p className="mw-svc-cta__hotline-note">
            Answered by a trained responder — every hour, every day of the year.
          </p>
        </div>

        <div className="mw-svc-cta__form" data-reveal>
          <div className="mw-svc-cta__form-head">
            <p className="mw-svc-cta__form-eyebrow" aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span>No emergency?</span>
            </p>
            <p className="mw-svc-cta__form-title">Request pre-incident planning</p>
            <p className="mw-svc-cta__form-note">
              Quotes, site planning, and general inquiries — we'll be in touch.
            </p>
          </div>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
