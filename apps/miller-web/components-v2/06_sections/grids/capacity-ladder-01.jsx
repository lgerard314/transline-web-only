import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";

// Monoline container glyphs — uniform 1.7 stroke, clay currentColor. One per
// capacity tier so the ladder reads as a freight spec sheet, not a bar chart.
// Reproduced verbatim from apps/miller-web/app/industrial-services/customer-waste-collection/sections/02-scale.jsx.
const GLYPHS = {
  pail: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="24" cy="16" rx="9" ry="2.6" />
      <path d="M15 17 L17.6 37.2 a1.6 1.6 0 0 0 1.6 1.4 h9.6 a1.6 1.6 0 0 0 1.6 -1.4 L33 17" />
      <path d="M16.6 15.4 Q24 8.8 31.4 15.4" />
    </svg>
  ),
  drum: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="24" cy="13" rx="9" ry="2.6" />
      <path d="M15 13 V35" />
      <path d="M33 13 V35" />
      <path d="M15 35 a9 2.6 0 0 0 18 0" />
      <path d="M15 22 H33" />
      <path d="M15 28 H33" />
    </svg>
  ),
  tote: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="13" y="12" width="22" height="21" rx="1.2" />
      <path d="M24 12 V33" />
      <path d="M13 22.5 H35" />
      <path d="M15.5 37 H32.5" />
      <path d="M17 33 V37" />
      <path d="M31 33 V37" />
    </svg>
  ),
  van: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 H27 V31 H7 Z" />
      <path d="M27 21 H33 L37 26 V31 H27 Z" />
      <path d="M5 31 H39" />
      <circle cx="15" cy="32" r="2.4" />
      <circle cx="32" cy="32" r="2.4" />
    </svg>
  ),
};

// §2 — "Any volume" container capacity ladder. Each tier shows a container
// glyph, its name + spec, and a proportional clay fill bar so the jump from a
// single pail to a full van load is legible at a glance.
//
// content: { eyebrow, title, lead, headPhoto, titleId, tiers[] }
// tiers[]: { glyph, name, spec, fill, note }
//   fill — numeric 0–100; rendered as `${fill}%` on mw-vol__fill width.
//   glyph — string key into the GLYPHS map above ("pail"|"drum"|"tote"|"van").
// titleId — aria-labelledby id (adapter supplies "cwc-scale-title" for CWC).
// headPhoto — decorative photo src (adapter supplies "/miller/dumptruck-2.png").
export function CapacityLadder01({ content, config = {} }) {
  return (
    <section className="mw-vol" aria-labelledby={content.titleId} {...sectionProps(config)}>
      <div className="mw-vol__inner mw-inner">
        <div className="mw-vol__grid">
          <header className="mw-vol__head">
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{content.eyebrow}</span>
            </p>
            <h2 id={content.titleId} className="mw-section-title mw-vol__title" data-reveal>
              <StopText>{content.title}</StopText>
            </h2>
            <p className="mw-vol__lead" data-reveal>{content.lead}</p>
            <div className="mw-vol__head-photo" data-reveal aria-hidden="true">
              <img src={content.headPhoto} alt="" loading="lazy" />
            </div>
          </header>

          <ol className="mw-vol__ladder" data-reveal-stagger>
            {content.tiers.map((t) => (
              <li key={t.name} className="mw-vol__tier">
                <span className="mw-vol__glyph" aria-hidden="true">{GLYPHS[t.glyph]}</span>
                <div className="mw-vol__body">
                  <div className="mw-vol__line">
                    <h3 className="mw-vol__name">{t.name}</h3>
                    <span className="mw-vol__spec">{t.spec}</span>
                  </div>
                  <div className="mw-vol__gauge" aria-hidden="true">
                    <span className="mw-vol__fill" style={{ width: `${t.fill}%` }} />
                  </div>
                  <p className="mw-vol__note">{t.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
