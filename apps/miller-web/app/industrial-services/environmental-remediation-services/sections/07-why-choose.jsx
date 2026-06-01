import { REMEDIATION as c } from "@/lib/content/service-environmental-remediation";
import { StopText } from "@/components/StopText";

// §7 — Why choose Miller. Reason tiles styled like the home certifications band
// (light surface, bordered 4-up tiles, accent bar on hover).
export function WhyChooseSection() {
  const w = c.whyChoose;
  return (
    <section className="mw-why" aria-labelledby="rem-why-title">
      <div className="mw-why__inner mw-inner">
        <header className="mw-why__head">
          <p className="mw-section-tag" data-reveal aria-hidden="true">
            <span className="mw-section-tag-mark" />
            <span className="mw-section-tag-label">{w.eyebrow}</span>
          </p>
          <h2 id="rem-why-title" className="mw-section-title mw-why__title" data-reveal>
            <StopText>{w.title}</StopText>
          </h2>
        </header>

        <ul className="mw-why__grid" data-reveal-stagger>
          {w.items.map((it) => (
            <li key={it.title} className="mw-why__card">
              <h3 className="mw-why__name">{it.title}</h3>
              <p className="mw-why__body">{it.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
