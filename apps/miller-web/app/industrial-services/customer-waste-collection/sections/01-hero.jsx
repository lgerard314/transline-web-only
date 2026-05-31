import Link from "next/link";
import { customerWasteCollection as c } from "@/lib/content/service-customer-waste-collection";

// HERO — service masthead. Split content/photo, deliberately lighter
// than the home hero (no full-viewport, no cycling headline).
export function HeroSection() {
  const h = c.hero;
  return (
    <section className="mw-svc-hero" aria-labelledby="cwc-hero-title">
      <div className="mw-svc-hero__inner mw-inner">
        <div className="mw-svc-hero__content">
          <p className="mw-section-tag" aria-hidden="true">
            <span className="mw-section-tag-mark" />
            <span className="mw-section-tag-label">{h.eyebrow}</span>
          </p>
          <h1 id="cwc-hero-title" className="mw-svc-hero__title">
            {h.title}<br />
            <span className="mw-svc-hero__title-em">{h.titleEm}</span><span className="mw-stop" aria-hidden="true" />
          </h1>
          <p className="mw-svc-hero__lead">{h.lead}</p>
          <div className="mw-svc-hero__ctas">
            <Link href={h.primaryCta.href} className="mw-cta mw-cta--solid">
              {h.primaryCta.label} <span aria-hidden="true">→</span>
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

        <div className="mw-svc-hero__media">
          <figure className="mw-svc-photo mw-svc-hero__frame">
            <img className="mw-svc-hero__photo" src={h.photo} alt="" />
            <figcaption className="mw-svc-hero__cap">
              <span className="mw-svc-hero__cap-mark" aria-hidden="true" />
              <span>{h.caption}</span>
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
