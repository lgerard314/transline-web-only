import { REMEDIATION as c } from "@/lib/content/service-environmental-remediation";
import { StopText } from "@/components/StopText";

// §3 — Industries & situations we serve. Plain diamond-chip grid on the warm
// surface, with a fleet image filling the header's right column.
export function IndustriesSection() {
  const ind = c.industries;
  return (
    <section className="mw-svc-inds" aria-labelledby="rem-inds-title">
      <div className="mw-svc-inds__inner mw-inner">
        <header className="mw-svc-inds__head">
          <div className="mw-svc-inds__head-left">
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{ind.eyebrow}</span>
            </p>
            <h2 id="rem-inds-title" className="mw-section-title" data-reveal>
              <StopText>{ind.title}</StopText>
            </h2>
            <p className="mw-svc-inds__lead" data-reveal>{ind.lead}</p>
          </div>
          <div className="mw-svc-inds__head-media" data-reveal aria-hidden="true">
            <img src="/miller/fleet-trucks-gravel-transparent.png" alt="" loading="lazy" />
          </div>
        </header>

        <ul className="mw-svc-inds__grid" data-reveal-stagger>
          {ind.items.map((name) => (
            <li key={name} className="mw-svc-ind">
              <span className="mw-svc-ind__mark" aria-hidden="true" />
              <span className="mw-svc-ind__name">{name}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
