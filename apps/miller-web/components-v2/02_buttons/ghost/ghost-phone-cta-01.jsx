// L0 · ghost-phone-cta-01 — stacked 24/7 emergency phone (ghost CTA).
export function GhostPhoneCta01({ sup, num, href, ariaLabel }) {
  return (
    <a href={href} className="mw-cta mw-cta--ghost" aria-label={ariaLabel}>
      <span className="mw-cta__sup">{sup}</span>
      <span className="mw-cta__num">{num}</span>
    </a>
  );
}
