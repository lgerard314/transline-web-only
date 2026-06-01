import { REMEDIATION as c } from "@/lib/content/service-environmental-remediation";
import { StopText } from "@/components/StopText";
import { WhyChooseStatCycle } from "@/components/WhyChooseStatCycle";

// §7 — Why choose Miller. Intro row (copy + cycling highlight) above the
// certifications-style 4-up tile band.
export function WhyChooseSection() {
  const w = c.whyChoose;
  return (
    <section className="mw-why mw-why--rem" aria-labelledby="rem-why-title">
      <div className="mw-why__inner mw-inner">
        <div className="mw-why__intro" data-reveal-stagger>
          <div className="mw-why__copy">
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{w.eyebrow}</span>
            </p>
            <h2 id="rem-why-title" className="mw-section-title mw-why__title" data-reveal>
              <StopText>{w.title}</StopText>
            </h2>
            <p className="mw-why__lead" data-reveal>{w.lead}</p>
          </div>
          <div className="mw-why__highlight" data-reveal>
            <WhyChooseStatCycle stats={w.highlights} />
          </div>
        </div>

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
