import Link from "next/link";
import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";

// L3 · service-hero-02 — light masthead with a chain-of-custody strip (CWC v2,
// the first interior v2 page). Distinct from service-hero-01: the photo bleed
// runs the full hero height on the right, and a manifest-style custody strip
// (your dock → Miller truck → VBEC gate) closes the hero base — the page's
// "documented route" signature. §12 rules hold: light surface, ONE eyebrow,
// home-button pair at equal height, no breadcrumb.
//
// content: { titleId, eyebrow, title, titleEm, lead, photo,
//            emergencyDisplay, emergencyHref, cta { label, href },
//            custody { caption, nodes[{ num, label }] } }
// config:  { reveal = true } — standard data-reveal entrances on/off.
export function ServiceHero02({ content, config = {} }) {
  const { reveal = true } = config;
  const rv = reveal ? { "data-reveal": true } : {};

  return (
    <section className="mw-cwc-hero" aria-labelledby={content.titleId} {...sectionProps(config)}>
      <div className="mw-cwc-hero__main">
        <div className="mw-cwc-hero__inner mw-inner">
          <div className="mw-cwc-hero__content">
            <p className="mw-section-tag" {...rv} aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{content.eyebrow}</span>
            </p>
            <h1 id={content.titleId} className="mw-cwc-hero__title" {...rv}>
              {content.title}
              <br />
              <span className="mw-cwc-hero__title-em"><StopText>{content.titleEm}</StopText></span>
            </h1>
            <p className="mw-cwc-hero__lead" {...rv}>{content.lead}</p>
            <div className="mw-cwc-hero__ctas" {...rv}>
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
        <div className="mw-cwc-hero__bleed" aria-hidden="true">
          <img className="mw-cwc-hero__photo" src={content.photo} alt="" />
        </div>
      </div>

      <div className="mw-cwc-hero__custody" {...rv}>
        <div className="mw-cwc-hero__custody-inner mw-inner">
          <p className="mw-cwc-hero__custody-cap">{content.custody.caption}</p>
          <ol className="mw-cwc-hero__custody-route" aria-label="Chain of custody">
            {content.custody.nodes.map((n) => (
              <li key={n.num} className="mw-cwc-hero__custody-node">
                <span className="mw-cwc-hero__custody-mark" aria-hidden="true" />
                <span className="mw-cwc-hero__custody-num" aria-hidden="true">{n.num}</span>
                <span className="mw-cwc-hero__custody-label">{n.label}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
