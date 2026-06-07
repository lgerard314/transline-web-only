import Link from "next/link";
import { SolidCta01 } from "@/components-v2/02_buttons/solid/solid-cta-01";
import { ActionArrow01 } from "@/components-v2/01_marks/arrows/action-arrow-01";
import { FigureStat01 } from "@/components-v2/04_blocks/stats/figure-stat-01";
import { ImageAccordion01 } from "@/components-v2/05_widgets/galleries/image-accordion-01";
import { sectionProps } from "@/components-v2/section-config";

// MediaSplit01 — the home VBEC (facility) section. A vertical text block
// (manifest field-line → terracotta title → lead → actions) → a full-bleed
// hover-expand image accordion of the facility (its rightmost panel meets the
// screen's right edge) → spec figures → onsite-capabilities grid. Home-only
// template (blast radius 1). Styling: app/styles/04-home.css (.mw-fac2* / .mw-iacc*).
export function MediaSplit01({ content, config = {} }) {
  const { eyebrow, stage, title, lead, figures, capsTitle, capabilities, primaryCta, aboutLink, headingId, photos } = content;
  return (
    <section className="mw-fac2" aria-labelledby={headingId} {...sectionProps(config)}>
      <div className="mw-inner">
        {/* Manifest field-line + title. */}
        <header className="mw-fac2__head" data-reveal>
          <p className="mw-fac2__field">
            {stage ? <span>{stage}</span> : null}
            <span className="mw-fac2__field-rule" />
            <span>{eyebrow}</span>
          </p>
          <h2 id={headingId} className="mw-fac2__title">{title.em}</h2>
        </header>

        <p className="mw-fac2__lead" data-reveal>{lead}</p>

        <div className="mw-fac2__actions" data-reveal>
          <SolidCta01 href={primaryCta.href}>
            <span className="mw-fac2__lbl-long">{primaryCta.longLabel}</span>
            <span className="mw-fac2__lbl-short">{primaryCta.shortLabel}</span>
            {" "}<ActionArrow01 />
          </SolidCta01>
          <Link href={aboutLink.href} className="mw-fac2__about">
            <span className="mw-fac2__lbl-long">{aboutLink.longLabel}</span>
            <span className="mw-fac2__lbl-short">{aboutLink.shortLabel}</span>
            {" "}<span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {/* The facility — hover-expand image accordion, running off the right edge. */}
      <ImageAccordion01 photos={photos} label="Vaughn Bullough Environmental Centre photo gallery" />

      <div className="mw-inner">
        {/* Spec band — the three headline facility figures. */}
        <dl className="mw-fac2__figs" aria-label="Facility figures" data-reveal-stagger>
          {figures.map((f) => (<FigureStat01 key={f.label} label={f.label} num={f.num} unit={f.unit} />))}
        </dl>

        {/* Onsite capabilities — numbered editorial grid. */}
        <div className="mw-fac2__caps" data-reveal-stagger>
          <div className="mw-fac2__caps-head">
            <p className="mw-fac2__caps-title"><span className="mw-fac2__caps-mark" aria-hidden="true" />{capsTitle}</p>
          </div>
          <ul className="mw-fac2__caps-grid" aria-label="Onsite capabilities">
            {capabilities.map((cap, i) => (
              <li className="mw-fac2__caps-item" key={i}>
                <span className="mw-fac2__caps-num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <p className="mw-fac2__caps-name">{cap}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
