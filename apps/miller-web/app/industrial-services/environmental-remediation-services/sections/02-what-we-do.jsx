import { REMEDIATION as c } from "@/lib/content/service-environmental-remediation";
import { StopText } from "@/components/StopText";

// §2 — What we do. Six remediation capabilities as full-bleed photo cards: the
// overlay shows the title + one-line blurb at rest, and on hover the title
// shrinks and the body swaps to the full capability paragraph.
export function WhatWeDoSection() {
  const w = c.whatWeDo;
  return (
    <section className="mw-svc-inds mw-svc-inds--gallery mw-rem-wwd" aria-labelledby="rem-wwd-title">
      <div className="mw-svc-inds__inner mw-inner">
        <header className="mw-svc-inds__head">
          <div className="mw-svc-inds__head-left">
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{w.eyebrow}</span>
            </p>
            <h2 id="rem-wwd-title" className="mw-section-title" data-reveal>
              <StopText>{w.title}</StopText>
            </h2>
          </div>
          <p className="mw-svc-inds__lead" data-reveal>{w.lead}</p>
        </header>

        <ul className="mw-svc-inds__grid" data-reveal-stagger>
          {w.items.map((it) => (
            <li key={it.name} className="mw-wwd-card" tabIndex={0}>
              <img className="mw-wwd-card__photo" src={it.photo} alt="" loading="lazy" />
              <div className="mw-wwd-card__overlay">
                <h3 className="mw-wwd-card__name">{it.name}</h3>
                <p className="mw-wwd-card__blurb">{it.blurb}</p>
                <p className="mw-wwd-card__detail">{it.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
