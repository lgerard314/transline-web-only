import { customerWasteCollection as c } from "@/lib/content/service-customer-waste-collection";
import { StopText } from "@/components/StopText";

// §4 — Industries we collect from, as a grid of photo cards (16:9 image +
// industry name). Decorative imagery: the name in the heading carries meaning,
// so the photos use empty alt text.
export function IndustriesSection() {
  const ind = c.industries;
  return (
    <section className="mw-svc-inds mw-svc-inds--gallery" aria-labelledby="cwc-inds-title">
      <div className="mw-svc-inds__inner mw-inner">
        <header className="mw-svc-inds__head" data-reveal>
          <div className="mw-svc-inds__head-left">
            <p className="mw-section-tag" aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{ind.eyebrow}</span>
            </p>
            <h2 id="cwc-inds-title" className="mw-section-title">
              <StopText>{ind.title}</StopText>
            </h2>
          </div>
          <p className="mw-svc-inds__lead">{ind.lead}</p>
        </header>

        <ul className="mw-svc-inds__grid" data-reveal-stagger>
          {ind.items.map((it) => (
            <li key={it.name} className="mw-ind-card">
              <div className="mw-ind-card__media">
                <img src={it.photo} alt="" loading="lazy" />
              </div>
              <h3 className="mw-ind-card__name">
                <span className="mw-ind-card__mark" aria-hidden="true" />
                {it.name}
              </h3>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
