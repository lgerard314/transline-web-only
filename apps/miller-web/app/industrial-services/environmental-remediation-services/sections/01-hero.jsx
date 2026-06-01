import Link from "next/link";
import { REMEDIATION as c } from "@/lib/content/service-environmental-remediation";
import { StopText } from "@/components/StopText";

// HERO — remediation masthead. In-grid 2-column variant (a lightly modified
// version of the service hero) with a captioned site photo and a terracotta
// stat badge, so the page reads as a worked field document from the first scroll.
export function HeroSection() {
  const h = c.hero;
  return (
    <section className="mw-svc-hero" aria-labelledby="rem-hero-title">
      <div className="mw-svc-hero__inner mw-inner">
        <div className="mw-svc-hero__content">
          <p className="mw-section-tag" data-reveal aria-hidden="true">
            <span className="mw-section-tag-mark" />
            <span className="mw-section-tag-label">{h.eyebrow}</span>
          </p>
          <h1 id="rem-hero-title" className="mw-svc-hero__title" data-reveal>
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
              {h.secondaryCta.label} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="mw-svc-hero__media" data-reveal>
          <figure className="mw-svc-photo">
            <img className="mw-svc-hero__photo" src={h.photo} alt="" />
            <figcaption className="mw-svc-hero__cap">
              <span className="mw-svc-hero__cap-mark" aria-hidden="true" />
              {h.caption}
            </figcaption>
          </figure>
          <div className="mw-svc-hero__stat" aria-hidden="true">
            <span className="mw-svc-hero__stat-val">{h.stat.value}</span>
            <span className="mw-svc-hero__stat-label">{h.stat.label}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
