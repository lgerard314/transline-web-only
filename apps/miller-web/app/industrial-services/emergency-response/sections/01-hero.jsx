import Link from "next/link";
import { emergencyResponse as c } from "@/lib/content/service-emergency-response";

// HERO — alert masthead. The 24/7 line is the primary action.
export function HeroSection() {
  const h = c.hero;
  return (
    <section className="mw-svc-hero mw-svc-hero--alert" aria-labelledby="er-hero-title">
      <div className="mw-svc-hero__inner mw-inner">
        <div className="mw-svc-hero__content">
          <p className="mw-section-tag" aria-hidden="true">
            <span className="mw-section-tag-mark" />
            <span className="mw-section-tag-label">{h.eyebrow}</span>
          </p>
          <h1 id="er-hero-title" className="mw-svc-hero__title">
            {h.title}<br />
            <span className="mw-svc-hero__title-em">{h.titleEm}</span><span className="mw-stop" aria-hidden="true" />
          </h1>
          <p className="mw-svc-hero__lead">{h.lead}</p>
          <div className="mw-svc-hero__ctas">
            <a
              href={h.emergencyHref}
              className="mw-cta mw-cta--ghost"
              aria-label={`Call 24/7 emergency: ${h.emergencyDisplay}`}
            >
              <span className="mw-cta__sup">24/7 emergency</span>
              <span className="mw-cta__num">{h.emergencyDisplay}</span>
            </a>
            <Link href={h.secondaryCta.href} className="mw-cta mw-cta--solid">
              {h.secondaryCta.label} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="mw-svc-hero__bleed-photo" aria-hidden="true">
        <img className="mw-svc-hero__photo" src={h.photo} alt="" />
      </div>
    </section>
  );
}
