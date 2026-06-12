import Link from "next/link";
import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";

// L3 · titleblock-hero-01 — drawing-sheet masthead (PM v2, the "project
// dossier" page). Structurally distinct from service-hero-01/-02: a
// full-width light masthead sits ABOVE a full-bleed site photo band, and a
// drafting title block — the corner block of an engineering drawing sheet —
// overlaps the photo's lower-right edge. §12 rules hold: light surface, ONE
// eyebrow, home-button pair at equal height, no breadcrumb.
//
// content: { titleId, eyebrow, title, titleEm, lead, photo, photoAlt,
//            emergencyDisplay, emergencyHref, cta { label, href },
//            titleblock { caption, cells[{ k, v }] } }
// config:  { reveal = true } — standard data-reveal entrances on/off.
export function TitleblockHero01({ content, config = {} }) {
  const { reveal = true } = config;
  const rv = reveal ? { "data-reveal": true } : {};

  return (
    <section className="mw-pm-hero" aria-labelledby={content.titleId} {...sectionProps(config)}>
      <div className="mw-pm-hero__inner mw-inner">
        <div className="mw-pm-hero__masthead">
          <p className="mw-section-tag" {...rv} aria-hidden="true">
            <span className="mw-section-tag-mark" />
            <span className="mw-section-tag-label">{content.eyebrow}</span>
          </p>
          <h1 id={content.titleId} className="mw-pm-hero__title" {...rv}>
            {content.title}
            <br />
            <span className="mw-pm-hero__title-em"><StopText>{content.titleEm}</StopText></span>
          </h1>
          <div className="mw-pm-hero__side" {...rv}>
            <p className="mw-pm-hero__lead">{content.lead}</p>
            <div className="mw-pm-hero__ctas">
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
      </div>

      <div className="mw-pm-hero__stage" {...rv}>
        <img className="mw-pm-hero__photo" src={content.photo} alt={content.photoAlt} />
        <div className="mw-pm-hero__anchor mw-inner">
          <div className="mw-pm-hero__tblock">
            <p className="mw-pm-hero__tblock-cap">
              <span className="mw-pm-hero__tblock-mark" aria-hidden="true" />
              {content.titleblock.caption}
            </p>
            <dl className="mw-pm-hero__tblock-grid">
              {content.titleblock.cells.map((c) => (
                <div key={c.k} className="mw-pm-hero__tblock-cell">
                  <dt className="mw-pm-hero__tblock-k">{c.k}</dt>
                  <dd className="mw-pm-hero__tblock-v">{c.v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
