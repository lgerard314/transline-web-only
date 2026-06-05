import Link from "next/link";
import { SolidCta01 } from "@/components-v2/02_buttons/solid/solid-cta-01";
import { ActionArrow01 } from "@/components-v2/01_marks/arrows/action-arrow-01";
import { FigureStat01 } from "@/components-v2/04_blocks/stats/figure-stat-01";
import { ThumbGallery01 } from "@/components-v2/05_widgets/galleries/thumb-gallery-01";
import { sectionProps } from "@/components-v2/section-config";

export function MediaSplit01({ content, config = {} }) {
  const { eyebrow, stage, title, lead, figures, capsTitle, capabilities, primaryCta, aboutLink, headingId, photos } = content;
  return (
    <section className="mw-fac2" aria-labelledby={headingId} {...sectionProps(config)}>
      <div className="mw-inner">
        <div className="mw-fac2__split" data-layout={config.layout}>
          <div className="mw-fac2__content" data-reveal-stagger>
            <header className="mw-fac2__head">
              {/* Field-head: the /v2 manifest grammar — a mono `stage —— field` document line above the title. */}
              <p className="mw-fac2__field">
                {stage ? <span>{stage}</span> : null}
                <span className="mw-fac2__field-rule" />
                <span>{eyebrow}</span>
              </p>
              <h2 id={headingId} className="mw-fac2__title">{title.em}</h2>
            </header>
            <p className="mw-fac2__lead">{lead}</p>
            {/* Capabilities ledger — a document-style manifest of onsite
                capabilities, zero-indexed with a clay draw-in on hover. */}
            <div className="mw-fac2__caplist-block" data-reveal-stagger>
              <p className="mw-fac2__caplist-title"><span>{capsTitle}</span></p>
              <ol className="mw-fac2__caplist" aria-label="Onsite capabilities">
                {capabilities.map((cap, i) => (
                  <li className="mw-fac2__cap" key={i}>
                    <span className="mw-fac2__cap-idx" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    <span className="mw-fac2__cap-name">{cap}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div className="mw-fac2__actions">
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
          <div className="mw-fac2__media-col">
            <ThumbGallery01 photos={photos} />
            {/* The 3 highlights (spec band) — moved beneath the gallery. */}
            <dl className="mw-fac2__figs" aria-label="Facility figures">
              {figures.map((f) => (<FigureStat01 key={f.label} label={f.label} num={f.num} unit={f.unit} />))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}
