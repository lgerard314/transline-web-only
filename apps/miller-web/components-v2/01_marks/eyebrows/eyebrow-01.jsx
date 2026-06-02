// L0 · eyebrow-01 — section eyebrow (diamond mark + mono label).
// Content: label. Config: invert (dark-surface label), reveal (adds data-reveal).
export function Eyebrow01({ label, invert = false, reveal = false }) {
  const revealAttr = reveal ? { "data-reveal": "" } : {};
  return (
    <p className="mw-section-tag" aria-hidden="true" {...revealAttr}>
      <span className="mw-section-tag-mark" />
      <span className={"mw-section-tag-label" + (invert ? " mw-section-tag-label--invert" : "")}>
        {label}
      </span>
    </p>
  );
}
