import Link from "next/link";
import { customerWasteCollection as c } from "@/lib/content/service-customer-waste-collection";

// §5 — Closing CTA (dark, transparent truck graphic).
export function CtaSection() {
  const h = c.hero;
  const cta = c.cta;
  return (
    <section className="mw-svc-cta" aria-labelledby="cwc-cta-title">
      <img
        className="mw-svc-cta__truck"
        src="/miller/truck-graphic-angled.png"
        alt=""
        aria-hidden="true"
        loading="lazy"
      />
      <div className="mw-svc-cta__inner mw-inner">
        <div className="mw-svc-cta__content" data-reveal>
          <p className="mw-section-tag" aria-hidden="true">
            <span className="mw-section-tag-mark" />
            <span className="mw-section-tag-label">{cta.eyebrow}</span>
          </p>
          <h2 id="cwc-cta-title" className="mw-section-title mw-svc-cta__title">
            {cta.title}<span className="mw-stop" aria-hidden="true" />
          </h2>
          <p className="mw-svc-cta__body">{cta.body}</p>
          <div className="mw-svc-cta__actions">
            <Link href="/contact-us/" className="mw-cta mw-cta--solid">
              Contact Miller <span aria-hidden="true">→</span>
            </Link>
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
      </div>
    </section>
  );
}
