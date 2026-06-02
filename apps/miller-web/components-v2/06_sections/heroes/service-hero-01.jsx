// L3 · service-hero-01 — alert masthead used on all 6 service pages.
// Server component — NO "use client".
//
// Config knobs:
//   media:     "photo-bleed" | "transparent-png" | "video" (default "photo-bleed").
//              "photo-bleed" and "transparent-png" both emit a <div mw-svc-hero__bleed-photo>
//              placed OUTSIDE mw-inner (sibling after it). "video" emits a
//              <div mw-svc-hero__media data-reveal> (with the mw-svc-photo figure /
//              LiteYouTube / figcaption inside) placed INSIDE mw-inner as a second column —
//              matching REM's 01-hero.jsx layout exactly. The video branch also renders
//              the secondary CTA without label spans (REM source style).
//   alert:     bool → adds mw-svc-hero--alert (default false).
//   photoHalf: bool → adds mw-svc-hero--photo-50 (default false). CWC uses this to pull
//              the photo to 50% width; ER does not.
//   reveal:    bool → when true, places data-reveal on eyebrow / title / lead / ctas
//              exactly as CWC's and REM's source do; when false (ER), emits NONE (default false).
//
//   ghostPhone: bool → renders the ghost-phone CTA block (default false). It is an
//              explicit knob, NOT content-presence-gated: CWC's hero content carries
//              emergencyDisplay/emergencyHref yet shows NO ghost-phone, so presence
//              alone would emit a phantom CTA. ER and REM pass ghostPhone:true; CWC omits it.
//              (The block still requires content.emergencyDisplay + emergencyHref to be
//              present, so the knob never produces a broken link.)
//
// ER config:  { media:"transparent-png", alert:true, ghostPhone:true }
// CWC config: { alert:true, photoHalf:true, reveal:true }
// REM config: { media:"video", reveal:true, ghostPhone:true }
//
// Content keys consumed (match the existing lib/content/service-*.js hero shape directly):
//   eyebrow, title, titleEm, lead, photo,
//   emergencyDisplay, emergencyHref (optional — triggers ghost-phone block),
//   secondaryCta: { label, labelShort, href },
//   titleId (the <section aria-labelledby> + <h1 id> value, e.g. "er-hero-title"),
//   caption (video branch only — the figcaption text, e.g. from hero.caption).
//
// For media:"video", also requires content.video: { id, title } — the YouTube video
//   id and title passed directly to <LiteYouTube id={…} title={…} />. In the REM
//   adapter, source this from REMEDIATION.videos.films[0] (id + title).

import Link from "next/link";
import { StopText } from "@/components/StopText";
import { LiteYouTube } from "@/components/LiteYouTube";
import { sectionProps } from "@/components-v2/section-config";

export function ServiceHero01({ content, config = {} }) {
  const { media = "photo-bleed", alert = false, photoHalf = false, reveal = false, ghostPhone = false } = config;

  const cls =
    "mw-svc-hero" +
    (alert ? " mw-svc-hero--alert" : "") +
    (photoHalf ? " mw-svc-hero--photo-50" : "");

  const hasGhostPhone = ghostPhone && !!(content.emergencyDisplay && content.emergencyHref);

  // Content column — shared by all media variants.
  const contentCol = (
    <div className="mw-svc-hero__content">
      <p className="mw-section-tag" {...(reveal ? { "data-reveal": true } : {})} aria-hidden="true">
        <span className="mw-section-tag-mark" />
        <span className="mw-section-tag-label">{content.eyebrow}</span>
      </p>
      <h1 id={content.titleId} className="mw-svc-hero__title" {...(reveal ? { "data-reveal": true } : {})}>
        {content.title}<br />
        <span className="mw-svc-hero__title-em"><StopText>{content.titleEm}</StopText></span>
      </h1>
      <p className="mw-svc-hero__lead" {...(reveal ? { "data-reveal": true } : {})}>{content.lead}</p>
      <div className="mw-svc-hero__ctas" {...(reveal ? { "data-reveal": true } : {})}>
        {hasGhostPhone && (
          <a
            href={content.emergencyHref}
            className="mw-cta mw-cta--ghost"
            aria-label={`Call 24/7 emergency: ${content.emergencyDisplay}`}
          >
            <span className="mw-cta__sup">24/7 emergency</span>
            <span className="mw-cta__num">{content.emergencyDisplay}</span>
          </a>
        )}
        {media === "video" ? (
          <Link href={content.secondaryCta.href} className="mw-cta mw-cta--solid">
            {content.secondaryCta.label} <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <Link href={content.secondaryCta.href} className="mw-cta mw-cta--solid">
            <span className="mw-svc-hero__cta-label mw-svc-hero__cta-label--full">{content.secondaryCta.label}</span>
            <span className="mw-svc-hero__cta-label mw-svc-hero__cta-label--short">{content.secondaryCta.labelShort}</span>{" "}
            <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>
    </div>
  );

  // media:"video" — media column lives INSIDE mw-inner (REM 2-column layout).
  // "photo-bleed"/"transparent-png" — bleed-photo div lives OUTSIDE mw-inner (ER/CWC layout).
  if (media === "video") {
    return (
      <section className={cls} aria-labelledby={content.titleId} {...sectionProps(config)}>
        <div className="mw-svc-hero__inner mw-inner">
          {contentCol}
          <div className="mw-svc-hero__media" data-reveal>
            <figure className="mw-svc-photo mw-svc-hero__videoframe">
              <LiteYouTube id={content.video.id} title={content.video.title} className="mw-svc-hero__video" />
              <figcaption className="mw-svc-hero__cap">
                <span className="mw-svc-hero__cap-mark" aria-hidden="true" />
                {content.caption}
              </figcaption>
            </figure>
          </div>
        </div>
      </section>
    );
  }

  // photo-bleed / transparent-png — bleed-photo outside mw-inner.
  return (
    <section className={cls} aria-labelledby={content.titleId} {...sectionProps(config)}>
      <div className="mw-svc-hero__inner mw-inner">
        {contentCol}
      </div>
      <div className="mw-svc-hero__bleed-photo" aria-hidden="true">
        <img className="mw-svc-hero__photo" src={content.photo} alt="" />
      </div>
    </section>
  );
}
