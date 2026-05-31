import { customerWasteCollection as c } from "@/lib/content/service-customer-waste-collection";

// §4 — Industries we collect from.
export function IndustriesSection() {
  const ind = c.industries;
  return (
    <section className="mw-svc-inds" aria-labelledby="cwc-inds-title">
      <div className="mw-svc-inds__inner mw-inner">
        <header className="mw-svc-inds__head" data-reveal>
          <div className="mw-svc-inds__head-left">
            <p className="mw-section-tag" aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{ind.eyebrow}</span>
            </p>
            <h2 id="cwc-inds-title" className="mw-section-title">
              {ind.title}<span className="mw-stop" aria-hidden="true" />
            </h2>
          </div>
          <p className="mw-svc-inds__lead">{ind.lead}</p>
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
