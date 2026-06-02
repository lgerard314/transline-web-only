// L2 · marquee-band-01 — label + moving brand Marquee track.
import { Marquee } from "@white-owl/brand/components";

export function MarqueeBand01({ label, items }) {
  const lines = Array.isArray(label) ? label : [label];
  return (
    <div className="mw-marquee__row">
      <p className="mw-marquee__label">{lines.flatMap((ln, i) => (i === 0 ? [ln] : [<br key={i} />, ln]))}<span className="mw-stop-colon" aria-hidden="true" /></p>
      <Marquee items={items.map((a) => (
        <img key={a.src} className="mw-marquee__logo" src={a.src} alt={a.name} loading="lazy" />
      ))} />
    </div>
  );
}
