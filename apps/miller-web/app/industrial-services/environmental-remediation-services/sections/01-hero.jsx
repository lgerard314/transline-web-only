import Link from "next/link";
import { REMEDIATION as c } from "@/lib/content/service-environmental-remediation";
import { StopText } from "@/components/StopText";
import { LiteYouTube } from "@/components/LiteYouTube";

// HERO — remediation masthead. In-grid 2-column variant (a lightly modified
// version of the service hero) with the featured field film in the photo frame.
export function HeroSection() {
  const h = c.hero;
  const film = c.videos.films[0];
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
          <figure className="mw-svc-photo mw-svc-hero__videoframe">
            <LiteYouTube id={film.id} title={film.title} className="mw-svc-hero__video" />
            <figcaption className="mw-svc-hero__cap">
              <span className="mw-svc-hero__cap-mark" aria-hidden="true" />
              {h.caption}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
