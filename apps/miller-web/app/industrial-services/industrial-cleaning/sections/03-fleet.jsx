import { industrialCleaning as c } from "@/lib/content/service-industrial-cleaning";
import { StopText } from "@/components/StopText";

// §3 — The fleet (unique section). A dark split feature: the two equipment
// classes on the left, the vacuum-truck silhouette bleeding off the right.
export function FleetSection() {
  const f = c.fleet;
  return (
    <section className="mw-fleet" aria-labelledby="ic-fleet-title">
      <div className="mw-fleet__inner mw-inner">
        <div className="mw-fleet__text">
          <p className="mw-section-tag" data-reveal aria-hidden="true">
            <span className="mw-section-tag-mark" />
            <span className="mw-section-tag-label mw-section-tag-label--invert">{f.eyebrow}</span>
          </p>
          <h2 id="ic-fleet-title" className="mw-section-title mw-fleet__title" data-reveal>
            <StopText>{f.title}</StopText>
          </h2>
          <p className="mw-fleet__lead" data-reveal>{f.lead}</p>
          <ul className="mw-fleet__list" data-reveal-stagger>
            {f.items.map((it) => (
              <li key={it.name} className="mw-fleet__item">
                <span className="mw-fleet__num" aria-hidden="true">{it.mark}</span>
                <div className="mw-fleet__item-body">
                  <h3 className="mw-fleet__item-name">{it.name}</h3>
                  <p className="mw-fleet__item-text">{it.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mw-fleet__media" data-reveal aria-hidden="true">
          <img src={f.image} alt="" loading="lazy" />
        </div>
      </div>
    </section>
  );
}
