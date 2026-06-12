import Link from "next/link";
import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";

// L3 · service-hero-02 — light masthead with a chain-of-custody strip (CWC v2,
// the first interior v2 page). Distinct from service-hero-01: the photo bleed
// runs the full hero height on the right, and a manifest-style custody strip
// (your dock → Miller truck → VBEC gate) closes the hero base — the page's
// "documented route" signature. §12 rules hold: light surface, ONE eyebrow,
// no breadcrumb, and a SINGLE primary CTA (the 24/7 emergency pair is
// home + emergency-page-only per the locked hero rule, logan 2026-06-12).
//
// content: { titleId, eyebrow, title, titleEm, lead, photo,
//            cta { label, href },
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

      <div className="mw-cwc-hero__custody">
        <div className="mw-cwc-hero__custody-inner mw-inner">
          <p className="mw-cwc-hero__custody-cap" {...rv}>{content.custody.caption}</p>
          {/* Stagger on the route list: the three custody nodes cascade
              left→right (the strip's surface stays put; only the nodes
              arrive) — a SMALL per the page's motion budget. */}
          <ol
            className="mw-cwc-hero__custody-route"
            aria-label="Chain of custody"
            {...(reveal ? { "data-reveal-stagger": true } : {})}
          >
            {/* No sequential mono numerals (banned in the eyebrow register,
                logan 2026-06-12) — the diamond + label carry each node. */}
            {content.custody.nodes.map((n) => (
              <li key={n.num} className="mw-cwc-hero__custody-node">
                <span className="mw-cwc-hero__custody-mark" aria-hidden="true" />
                <span className="mw-cwc-hero__custody-label">{n.label}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
