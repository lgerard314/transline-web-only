import Link from "next/link";
import { IWT as c } from "@/lib/content/service-industrial-waste-treatment";
import { StopText } from "@/components/StopText";

// HERO — alert masthead (photo bleeds across the right half). Contact Miller is
// the primary action; the 24/7 line is the standing emergency affordance.
export function HeroSection() {
  const h = c.hero;
  return (
    <section className="mw-svc-hero mw-svc-hero--alert mw-svc-hero--photo-50" aria-labelledby="iwt-hero-title">
      <div className="mw-svc-hero__inner mw-inner">
        <div className="mw-svc-hero__content">
          <p className="mw-section-tag" data-reveal aria-hidden="true">
            <span className="mw-section-tag-mark" />
            <span className="mw-section-tag-label">{h.eyebrow}</span>
          </p>
          <h1 id="iwt-hero-title" className="mw-svc-hero__title" data-reveal>
            {h.title}<br />
            <span className="mw-svc-hero__title-em"><StopText>{h.titleEm}</StopText></span>
          </h1>
          <p className="mw-svc-hero__lead" data-reveal>{h.lead}</p>
          <div className="mw-svc-hero__ctas" data-reveal>
            <a
              href={h.emergencyHref}
              className="mw-cta mw-cta--ghost"
              aria-label={`Call 24/7 emergency: ${h.emergencyDisplay}`}
            >
              <span className="mw-cta__sup">24/7 emergency</span>
              <span className="mw-cta__num">{h.emergencyDisplay}</span>
            </a>
            <Link href={h.secondaryCta.href} className="mw-cta mw-cta--solid">
              <span className="mw-svc-hero__cta-label mw-svc-hero__cta-label--full">{h.secondaryCta.label}</span>
              <span className="mw-svc-hero__cta-label mw-svc-hero__cta-label--short">{h.secondaryCta.labelShort}</span>{" "}
              <span aria-hidden="true">→</span>
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
