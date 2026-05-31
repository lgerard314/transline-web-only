import { ContactForm } from "@/components/ContactForm";
import { emergencyResponse as c } from "@/lib/content/service-emergency-response";

// §5 — Closing CTA (terracotta) with the 24/7 line + a contact form.
export function CtaSection() {
  const h = c.hero;
  const cta = c.cta;
  return (
    <section className="mw-svc-cta mw-svc-cta--accent" aria-labelledby="er-cta-title">
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
          <div className="mw-svc-cta__actions">
            <a
              href={h.emergencyHref}
              className="mw-cta mw-cta--ghost"
              aria-label={`Call 24/7 emergency: ${h.emergencyDisplay}`}
            >
              <span className="mw-cta__sup">24/7 emergency</span>
              <span className="mw-cta__num">{h.emergencyDisplay}</span>
            </a>
          </div>
        </div>
        <div className="mw-svc-cta__form" data-reveal>
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
