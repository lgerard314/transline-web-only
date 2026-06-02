import { Fragment } from "react";
import Link from "next/link";
import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";
import { IndThumbCard01 } from "@/components-v2/03_cards/ind/ind-thumb-card-01";
import { IndGalleryCard01 } from "@/components-v2/03_cards/ind/ind-gallery-card-01";

// PhotoCardGrid01 — shared mw-svc-inds section shell that composes a card
// sub-component selected by config.cardStyle. Reproduces the DOM of:
//   • ER   03-incidents.jsx  → cardStyle:"thumb",   head:"media-split"
//   • CWC  04-industries.jsx → cardStyle:"gallery", head:"split", trailingCta:true
//
// Config:
//   cardStyle: "thumb" | "gallery"  — picks IndThumbCard01 / IndGalleryCard01
//              "thumb"   → modifier class mw-svc-inds--photo
//              "gallery" → modifier class mw-svc-inds--gallery
//   head:      "media-split" | "split"
//              "media-split" → ER head: head-left (eyebrow + multi-line h2 + lead) +
//                              mw-svc-inds__head-media (decorative PNG from content.headMedia)
//                              data-reveal on the <header> element
//              "split"       → CWC head: head-left (eyebrow + h2) +
//                              sibling p.mw-svc-inds__lead
//                              data-reveal on each of: mw-section-tag, h2, p.lead
//   trailingCta: false | true — when true appends the mw-ind-cta-cell <li> from content.cta
//
// Content keys consumed:
//   Shared:            titleId, eyebrow, title, lead, items[]
//   head:"media-split" additionally: headMedia (PNG src, e.g. content.headMedia)
//   head:"split"       no extra keys (lead is a flat string)
//   trailingCta:true   additionally: cta { label, href }
//
// Server component — no "use client".

const CARD = { thumb: IndThumbCard01, gallery: IndGalleryCard01 };
const MODIFIER = { thumb: "mw-svc-inds--photo", gallery: "mw-svc-inds--gallery" };

export function PhotoCardGrid01({ content, config = {} }) {
  const { cardStyle = "thumb", head = "split", trailingCta = false } = config;
  const Card = CARD[cardStyle];
  const modifier = MODIFIER[cardStyle];

  return (
    <section
      className={`mw-svc-inds ${modifier}`}
      aria-labelledby={content.titleId}
      {...sectionProps(config)}
    >
      <div className="mw-svc-inds__inner mw-inner">

        {/* ── head: "media-split" (ER) ─────────────────────────────────── */}
        {head === "media-split" && (
          <header className="mw-svc-inds__head" data-reveal>
            <div className="mw-svc-inds__head-left">
              <p className="mw-section-tag" aria-hidden="true">
                <span className="mw-section-tag-mark" />
                <span className="mw-section-tag-label">{content.eyebrow}</span>
              </p>
              <h2 id={content.titleId} className="mw-section-title">
                {content.title.split("\n").map((line, i, arr) => {
                  const inner = i === arr.length - 1 ? <StopText>{line}</StopText> : line;
                  return (
                    <Fragment key={i}>
                      {i === 0 ? inner : <em className="mw-svc-inds__title-em">{inner}</em>}
                      {i < arr.length - 1 && <br />}
                    </Fragment>
                  );
                })}
              </h2>
              <p className="mw-svc-inds__lead">{content.lead}</p>
            </div>
            <div className="mw-svc-inds__head-media" aria-hidden="true">
              <img src={content.headMedia} alt="" loading="lazy" />
            </div>
          </header>
        )}

        {/* ── head: "split" (CWC) ──────────────────────────────────────── */}
        {head === "split" && (
          <header className="mw-svc-inds__head">
            <div className="mw-svc-inds__head-left">
              <p className="mw-section-tag" data-reveal aria-hidden="true">
                <span className="mw-section-tag-mark" />
                <span className="mw-section-tag-label">{content.eyebrow}</span>
              </p>
              <h2 id={content.titleId} className="mw-section-title" data-reveal>
                <StopText>{content.title}</StopText>
              </h2>
            </div>
            <p className="mw-svc-inds__lead" data-reveal>{content.lead}</p>
          </header>
        )}

        <ul className="mw-svc-inds__grid" data-reveal-stagger>
          {content.items.map((item) => (
            <Card key={item.name} item={item} />
          ))}

          {trailingCta && content.cta && (
            <li className="mw-ind-cta-cell">
              <Link href={content.cta.href} className="mw-ind-cta">
                {content.cta.label} <span className="mw-ind-cta__arrow" aria-hidden="true">→</span>
              </Link>
            </li>
          )}
        </ul>

      </div>
    </section>
  );
}
