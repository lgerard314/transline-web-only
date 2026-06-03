import Image from "next/image";
import { CustodyRule } from "../_components/CustodyThread";

// · COUNTERSIGNED — the affiliate marks reframed as countersignatures on the
// manifest. A quiet buffer band before the close: a continuous marquee of the
// affiliation logos (duplicated for a seamless loop). Reduced-motion: a static,
// wrapped row (the animation is disabled in v2.css).
export function AffiliatesMarquee({ content }) {
  const c = content;
  const track = [...c.items, ...c.items];
  return (
    <section className="mx-aff mx-section mx-section--tight mx-cream" aria-label={c.ariaLabel}>
      <CustodyRule />
      <div className="mx-inner">
        <p className="mx-field">
          <span>{c.field}</span>
          <span className="mx-field__rule" />
        </p>
      </div>
      <div className="mx-aff__viewport" aria-hidden="true">
        <ul className="mx-aff__track">
          {track.map((a, i) => (
            <li className="mx-aff__item" key={i}>
              <Image src={a.src} alt="" width={150} height={64} className="mx-aff__logo" />
            </li>
          ))}
        </ul>
      </div>
      {/* accessible, non-duplicated list for assistive tech */}
      <ul className="tl-sr-only">
        {c.items.map((a) => <li key={a.name}>{a.name}</li>)}
      </ul>
    </section>
  );
}
