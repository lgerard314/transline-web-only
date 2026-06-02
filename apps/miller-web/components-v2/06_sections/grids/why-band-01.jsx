import { StopText } from "@/components/StopText";
import { WhyChooseStatCycle } from "@/components/WhyChooseStatCycle";
import { sectionProps } from "@/components-v2/section-config";

// WhyBand01 — shared mw-why section shell. Reproduces the DOM of:
//   • REM  07-why-choose.jsx  → statCycle:true, variant:"mw-why--rem", marker:"none"
//   • IC / PM variants come in Sub-project C (statCycle:false, marker:"number", --3up)
//
// Config:
//   variant:   string | undefined  — appended as an extra class on <section> root
//              (REM: "mw-why--rem"). Inert when absent.
//   statCycle: boolean (default false) — when true, renders the mw-why__intro row
//              (mw-why__copy + mw-why__highlight containing <WhyChooseStatCycle>).
//              REM uses true; IC/PM use false.
//   columns:   number | undefined — drives content only; CSS handles column layout.
//              Provided for documentation; no structural effect beyond rendering items.
//   marker:    "number" | "none" (default "none") — when "number", renders
//              mw-why__num on each card (IC/PM). REM is "none".
//
// Content keys consumed:
//   titleId    — id attribute placed on the <h2>; used by aria-labelledby on <section>
//   eyebrow    — string rendered in mw-section-tag-label
//   title      — string rendered via <StopText> in mw-section-title
//   lead       — string rendered in mw-why__lead
//   highlights — array fed to <WhyChooseStatCycle stats={...}> (shape: { label, value, unit?, text })
//   items[]    — array of { title, body } rendered as mw-why__card list items
//              (when marker:"number" also expects item.mark for mw-why__num)
//
// Server component — no "use client".

export function WhyBand01({ content, config = {} }) {
  const { variant, statCycle = false, marker = "none" } = config;
  const sectionClass = variant ? `mw-why ${variant}` : "mw-why";

  return (
    <section className={sectionClass} aria-labelledby={content.titleId} {...sectionProps(config)}>
      <div className="mw-why__inner mw-inner">

        {statCycle && (
          <div className="mw-why__intro" data-reveal-stagger>
            <div className="mw-why__copy">
              <p className="mw-section-tag" data-reveal aria-hidden="true">
                <span className="mw-section-tag-mark" />
                <span className="mw-section-tag-label">{content.eyebrow}</span>
              </p>
              <h2 id={content.titleId} className="mw-section-title mw-why__title" data-reveal>
                <StopText>{content.title}</StopText>
              </h2>
              <p className="mw-why__lead" data-reveal>{content.lead}</p>
            </div>
            <div className="mw-why__highlight" data-reveal>
              <WhyChooseStatCycle stats={content.highlights} />
            </div>
          </div>
        )}

        <ul className="mw-why__grid" data-reveal-stagger>
          {content.items.map((it) => (
            <li key={it.title} className="mw-why__card">
              {marker === "number" && <span className="mw-why__num">{it.mark}</span>}
              <h3 className="mw-why__name">{it.title}</h3>
              <p className="mw-why__body">{it.body}</p>
            </li>
          ))}
        </ul>

      </div>
    </section>
  );
}
