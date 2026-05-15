// Horizontal strip of label/value pairs. data-reveal-stagger triggers the
// ScrollReveal observer in the root layout to fade items in on scroll.
export function TrustBar({ items }) {
  return (
    <div className="tl-trustbar" data-reveal-stagger="">
      {items.map((it, i) => (
        <div className="tl-trustbar__item" key={i}>
          <div className="tl-trustbar__label">{it.k}</div>
          <div className="tl-trustbar__value">{it.v}</div>
        </div>
      ))}
    </div>
  );
}
