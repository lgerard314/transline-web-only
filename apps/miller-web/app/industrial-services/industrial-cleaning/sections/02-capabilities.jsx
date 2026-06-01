import { industrialCleaning as c } from "@/lib/content/service-industrial-cleaning";
import { StopText } from "@/components/StopText";

// §2 — What we clean. Horizontal photo cards (thumb left, one-line blurb right)
// on the light surface — the four core cleaning methods.
export function CapabilitiesSection() {
  const cap = c.capabilities;
  return (
    <section className="mw-svc-inds mw-svc-inds--photo" aria-labelledby="ic-cap-title">
      <div className="mw-svc-inds__inner mw-inner">
        <header className="mw-svc-inds__head">
          <div className="mw-svc-inds__head-left">
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{cap.eyebrow}</span>
            </p>
            <h2 id="ic-cap-title" className="mw-section-title" data-reveal>
              <StopText>{cap.title}</StopText>
            </h2>
          </div>
          <p className="mw-svc-inds__lead" data-reveal>{cap.lead}</p>
        </header>

        <ul className="mw-svc-inds__grid" data-reveal-stagger>
          {cap.items.map((it) => (
            <li key={it.name} className="mw-svc-ind">
              <span className="mw-svc-ind__thumb" aria-hidden="true">
                <img src={it.photo} alt="" loading="lazy" />
                <span className="mw-svc-ind__name">{it.name}</span>
              </span>
              <span className="mw-svc-ind__text">
                <span className="mw-svc-ind__tick" aria-hidden="true">
                  <span className="mw-svc-ind__tick-dot" />
                  <span className="mw-svc-ind__tick-line" />
                </span>
                <span className="mw-svc-ind__desc">{it.blurb}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
