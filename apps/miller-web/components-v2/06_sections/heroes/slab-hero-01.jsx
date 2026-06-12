import Link from "next/link";
import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";

// L3 · slab-hero-01 — slab-over-photo masthead (REM v2 §1, the "site file"
// page). Third distinct hero architecture in the v2 set: a full-height
// site photo fills the right two-thirds; a cream content slab overlaps it
// from the left (eyebrow → title with clay em → lead → CTA pair). §12:
// light surface, ONE eyebrow, equal-height button pair.
//
// content: { titleId, eyebrow, title, titleEm, lead, photo, photoAlt,
//            emergencyDisplay, emergencyHref, cta { label, href } }
// config:  { reveal = true }
export function SlabHero01({ content, config = {} }) {
  const { reveal = true } = config;
  const rv = reveal ? { "data-reveal": true } : {};

  return (
    <section className="mw-rem2-hero" aria-labelledby={content.titleId} {...sectionProps(config)}>
      <div className="mw-rem2-hero__media" aria-hidden="true">
        <img className="mw-rem2-hero__photo" src={content.photo} alt="" />
      </div>
      <div className="mw-rem2-hero__inner mw-inner">
        <div className="mw-rem2-hero__slab" {...rv}>
          <p className="mw-section-tag" aria-hidden="true">
            <span className="mw-section-tag-mark" />
            <span className="mw-section-tag-label">{content.eyebrow}</span>
          </p>
          <h1 id={content.titleId} className="mw-rem2-hero__title">
            {content.title}
            <br />
            <span className="mw-rem2-hero__title-em"><StopText>{content.titleEm}</StopText></span>
          </h1>
          <p className="mw-rem2-hero__lead">{content.lead}</p>
          <div className="mw-rem2-hero__ctas">
            <a
              href={content.emergencyHref}
              className="mw-cta mw-cta--ghost"
              aria-label={`Call 24/7 emergency: ${content.emergencyDisplay}`}
            >
              <span className="mw-cta__sup">24/7 emergency</span>
              <span className="mw-cta__num">{content.emergencyDisplay}</span>
            </a>
            <Link href={content.cta.href} className="mw-cta mw-cta--solid">
              {content.cta.label} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
