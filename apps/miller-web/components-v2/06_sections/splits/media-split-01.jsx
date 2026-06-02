import Link from "next/link";
import { Eyebrow01 } from "@/components-v2/01_marks/eyebrows/eyebrow-01";
import { StopText01 } from "@/components-v2/01_marks/stops/stop-text-01";
import { SolidCta01 } from "@/components-v2/02_buttons/solid/solid-cta-01";
import { ActionArrow01 } from "@/components-v2/01_marks/arrows/action-arrow-01";
import { FigureStat01 } from "@/components-v2/04_blocks/stats/figure-stat-01";
import { CapItem01 } from "@/components-v2/04_blocks/stats/cap-item-01";
import { ThumbGallery01 } from "@/components-v2/05_widgets/galleries/thumb-gallery-01";

export function MediaSplit01({ content, config = {} }) {
  const { eyebrow, title, lead, figures, capsTitle, capabilities, primaryCta, aboutLink, headingId, photos } = content;
  return (
    <section className="mw-fac2" aria-labelledby={headingId}>
      <div className="mw-inner">
        <div className="mw-fac2__split">
          <div className="mw-fac2__content" data-reveal-stagger>
            <header className="mw-fac2__head">
              <Eyebrow01 label={eyebrow} />
              <h2 id={headingId} className="mw-fac2__title">
                <StopText01>{title.top}</StopText01><br /><span className="mw-fac2__title-em"><StopText01>{title.em}</StopText01></span>
              </h2>
            </header>
            <p className="mw-fac2__lead">{lead}</p>
            <dl className="mw-fac2__figs" aria-label="Facility figures">
              {figures.map((f) => (<FigureStat01 key={f.label} label={f.label} num={f.num} unit={f.unit} />))}
            </dl>
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
          <ThumbGallery01 photos={photos} />
        </div>
        <div className="mw-fac2__caps">
          <header className="mw-fac2__caps-head" data-reveal>
            <h3 className="mw-fac2__caps-title">
              <span className="mw-fac2__caps-mark" aria-hidden="true" />
              <span>{capsTitle}</span>
            </h3>
          </header>
          <ol className="mw-fac2__caps-grid" aria-label="Onsite capabilities" data-reveal-stagger>
            {capabilities.map((cap, i) => (<CapItem01 key={i} n={i + 1} name={cap} />))}
          </ol>
        </div>
      </div>
    </section>
  );
}
