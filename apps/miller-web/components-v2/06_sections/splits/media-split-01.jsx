import Link from "next/link";
import { SolidCta01 } from "@/components-v2/02_buttons/solid/solid-cta-01";
import { ActionArrow01 } from "@/components-v2/01_marks/arrows/action-arrow-01";
import { FigureStat01 } from "@/components-v2/04_blocks/stats/figure-stat-01";
import { ImageAccordion01 } from "@/components-v2/05_widgets/galleries/image-accordion-01";
import { sectionProps } from "@/components-v2/section-config";

// MediaSplit01 — the home VBEC (facility) section. A 40/60 two-column split:
//   LEFT (40%):  the intro (eyebrow + terracotta title + lead + actions), top-aligned to
//                the photos. Each part is wrapped in a .mw-fac2__rise mask and rises in
//                (overflow-clipped translateY, the hero gesture), staggered top-down and
//                scroll-scrubbed AFTER the photos resolve (the gallery widget drives --p).
//   RIGHT (60%): the ImageAccordion01 gallery — each photo reveals as a clay plate whose
//                window opens + zoom-settles + rises, staggered left-to-right (the hero /
//                "our history" plate gesture), with diagonal parallax.
// Below the split, full width: the 3-figure spec band + the onsite-capabilities grid.
// Home-only template (blast radius 1). Styling: app/styles/04-home.css.
export function MediaSplit01({ content, config = {} }) {
  const { eyebrow, stage, title, lead, figures, capsTitle, capabilities, primaryCta, aboutLink, headingId, photos } = content;
  return (
    <section className="mw-fac2" aria-labelledby={headingId} {...sectionProps(config)}>
      <div className="mw-inner">
        <div className="mw-fac2__grid">
          {/* LEFT — the intro, centred to the photos' middle. Each part (eyebrow /
              header / body / buttons) reveals with the hero mask-rise, scrubbed by --p
              AFTER the photos finish (the gallery widget drives --p on .mw-fac2__intro). */}
          <div className="mw-fac2__left">
            <div className="mw-fac2__intro">
              <header className="mw-fac2__head">
                <div className="mw-fac2__rise"><div className="mw-fac2__rise-in">
                  <p className="mw-fac2__field">
                    {stage ? <span>{stage}</span> : null}
                    <span className="mw-fac2__field-rule" />
                    <span>{eyebrow}</span>
                  </p>
                </div></div>
                <div className="mw-fac2__rise"><div className="mw-fac2__rise-in">
                  <h2 id={headingId} className="mw-fac2__title">{title.em}</h2>
                </div></div>
              </header>

              <div className="mw-fac2__rise"><div className="mw-fac2__rise-in">
                <p className="mw-fac2__lead">{lead}</p>
              </div></div>

              <div className="mw-fac2__rise"><div className="mw-fac2__rise-in">
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
              </div></div>
            </div>
          </div>

          {/* RIGHT — the facility gallery; pushes downward out of the section above. */}
          <div className="mw-fac2__right">
            <ImageAccordion01 photos={photos} label="Vaughn Bullough Environmental Centre photo gallery" />
          </div>
        </div>

        {/* Spec band — 3 highlights, full width below the split. */}
        <dl className="mw-fac2__figs" aria-label="Facility figures" data-reveal-stagger>
          {figures.map((f) => (<FigureStat01 key={f.label} label={f.label} num={f.num} unit={f.unit} />))}
        </dl>

        {/* Onsite capabilities — numbered editorial grid, full width below the split. */}
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
