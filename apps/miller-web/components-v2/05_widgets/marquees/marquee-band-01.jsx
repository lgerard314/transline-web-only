// L2 · marquee-band-01 — home affiliate band framing (label + row) wrapping
// the shared brand Marquee track. The brand Marquee is a design-system
// primitive (out of scope to recreate), imported like a tl-* class.
import { Marquee } from "@white-owl/brand/components";
import { AFFILIATES } from "@/lib/content/template-testing-home";

export function MarqueeBand01() {
  return (
    <div className="mw-marquee__row">
      <p className="mw-marquee__label">Proud<br />affiliates<span className="mw-stop-colon" aria-hidden="true" /></p>
      <Marquee items={AFFILIATES.map((a) => (
        <img key={a.src} className="mw-marquee__logo" src={a.src} alt={a.name} loading="lazy" />
      ))} />
    </div>
  );
}
