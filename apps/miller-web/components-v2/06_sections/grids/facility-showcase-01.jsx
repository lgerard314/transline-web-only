import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";

// FacilityShowcase01 — reproduces mw-vbec (Industrial Waste Treatment §2).
// Source: apps/miller-web/app/industrial-services/industrial-waste-treatment/sections/02-facility.jsx
//
// DOM: section.mw-vbec[aria-labelledby] > div.mw-vbec__inner.mw-inner
//   div.mw-vbec__top
//     div.mw-vbec__text (eyebrow p.mw-section-tag + h2.mw-vbec__title + p.mw-vbec__lead)
//     figure.mw-vbec__media (img + figcaption.mw-vbec__cap > span.mw-vbec__cap-mark + caption text)
//   ul.mw-vbec__stats[data-reveal-stagger] (4× li.mw-vbec__stat)
//   div.mw-vbec__proc[data-reveal] (span.__proc-eyebrow + ul.__proc-list > li.__proc-chip > span.__proc-mark + text)
//
// Content keys:
//   titleId        — id placed on <h2> and aria-labelledby on <section>
//   eyebrow        — section-tag label (label--invert; dark section)
//   title          — h2 text (wrapped in StopText)
//   lead           — lead paragraph
//   photo          — img src
//   caption        — figcaption text after the cap-mark
//   stats[]        — { value, unit, label }
//   processEyebrow — eyebrow span above the chip list
//   processes[]    — string[] — each becomes a proc-chip
//
// Server component — no "use client".

export function FacilityShowcase01({ content, config = {} }) {
  return (
    <section className="mw-vbec" aria-labelledby={content.titleId} {...sectionProps(config)}>
      <div className="mw-vbec__inner mw-inner">
        <div className="mw-vbec__top">
          <div className="mw-vbec__text">
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label mw-section-tag-label--invert">{content.eyebrow}</span>
            </p>
            <h2 id={content.titleId} className="mw-section-title mw-vbec__title" data-reveal>
              <StopText>{content.title}</StopText>
            </h2>
            <p className="mw-vbec__lead" data-reveal>{content.lead}</p>
          </div>
          <figure className="mw-vbec__media" data-reveal>
            <img src={content.photo} alt="" loading="lazy" />
            <figcaption className="mw-vbec__cap">
              <span className="mw-vbec__cap-mark" aria-hidden="true" />
              {content.caption}
            </figcaption>
          </figure>
        </div>

        <ul className="mw-vbec__stats" data-reveal-stagger>
          {content.stats.map((s) => (
            <li key={s.label} className="mw-vbec__stat">
              <span className="mw-vbec__stat-val">
                {s.value}<span className="mw-vbec__stat-unit">{s.unit}</span>
              </span>
              <span className="mw-vbec__stat-label">{s.label}</span>
            </li>
          ))}
        </ul>

        <div className="mw-vbec__proc" data-reveal>
          <span className="mw-vbec__proc-eyebrow">{content.processEyebrow}</span>
          <ul className="mw-vbec__proc-list">
            {content.processes.map((p) => (
              <li key={p} className="mw-vbec__proc-chip">
                <span className="mw-vbec__proc-mark" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
