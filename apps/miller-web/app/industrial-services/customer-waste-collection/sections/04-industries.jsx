import Link from "next/link";
import { customerWasteCollection as c } from "@/lib/content/service-customer-waste-collection";
import { StopText } from "@/components/StopText";

// §4 — Industries we collect from, as a 5-up grid of photo cards (16:9 image,
// name, diamond-tick, one-line blurb) plus a closing "Talk to Miller" button
// that occupies the tenth cell. Decorative imagery → empty alt text.
export function IndustriesSection() {
  const ind = c.industries;
  return (
    <section className="mw-svc-inds mw-svc-inds--gallery" aria-labelledby="cwc-inds-title">
      <div className="mw-svc-inds__inner mw-inner">
        <header className="mw-svc-inds__head">
          <div className="mw-svc-inds__head-left">
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{ind.eyebrow}</span>
            </p>
            <h2 id="cwc-inds-title" className="mw-section-title" data-reveal>
              <StopText>{ind.title}</StopText>
            </h2>
          </div>
          <p className="mw-svc-inds__lead" data-reveal>{ind.lead}</p>
        </header>

        <ul className="mw-svc-inds__grid" data-reveal-stagger>
          {ind.items.map((it) => (
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

          <li className="mw-ind-cta-cell">
            <Link href={ind.cta.href} className="mw-ind-cta">
              {ind.cta.label} <span className="mw-ind-cta__arrow" aria-hidden="true">→</span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
