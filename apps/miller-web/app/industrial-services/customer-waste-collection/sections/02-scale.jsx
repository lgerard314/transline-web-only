import { customerWasteCollection as c } from "@/lib/content/service-customer-waste-collection";
import { StopText } from "@/components/StopText";

// Monoline container glyphs — uniform 1.7 stroke, clay currentColor. One per
// capacity tier so the ladder reads as a freight spec sheet, not a bar chart.
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
export function ScaleSection() {
  const s = c.scale;
  return (
    <section className="mw-vol" aria-labelledby="cwc-scale-title">
      <div className="mw-vol__inner mw-inner">
        <div className="mw-vol__grid">
          <header className="mw-vol__head" data-reveal>
            <p className="mw-section-tag" aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{s.eyebrow}</span>
            </p>
            <h2 id="cwc-scale-title" className="mw-section-title mw-vol__title">
              <StopText>{s.title}</StopText>
            </h2>
            <p className="mw-vol__lead">{s.lead}</p>
            <p className="mw-vol__kicker">
              <span className="mw-vol__kicker-mark" aria-hidden="true" />
              {s.kicker}
            </p>
          </header>

          <ol className="mw-vol__ladder" data-reveal-stagger>
            {s.tiers.map((t) => (
              <li key={t.num} className="mw-vol__tier">
                <span className="mw-vol__glyph" aria-hidden="true">{GLYPHS[t.glyph]}</span>
                <div className="mw-vol__body">
                  <div className="mw-vol__line">
                    <span className="mw-vol__num">{t.num}</span>
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
