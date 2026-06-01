import { REMEDIATION as c } from "@/lib/content/service-environmental-remediation";
import { StopText } from "@/components/StopText";

// §2 — What we do. Six remediation capabilities as 16:9 photo cards
// (photo, name, diamond-tick, one-line blurb) on the light surface.
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
            <li key={it.name} className="mw-ind-card">
              <div className="mw-ind-card__media">
                <img src={it.photo} alt="" loading="lazy" />
              </div>
              <div className="mw-ind-card__body">
                <h3 className="mw-ind-card__name">{it.name}</h3>
                <span className="mw-ind-card__tick" aria-hidden="true">
                  <span className="mw-ind-card__tick-dot" />
                  <span className="mw-ind-card__tick-line" />
                </span>
                <p className="mw-ind-card__blurb">{it.blurb}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
