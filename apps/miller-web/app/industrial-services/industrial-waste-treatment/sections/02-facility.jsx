import { IWT as c } from "@/lib/content/service-industrial-waste-treatment";
import { StopText } from "@/components/StopText";

// §2 — The VBEC facility (unique section). A dark walnut band: a captioned
// aerial of the site, a four-up stat block, and the treatment-process chips.
export function FacilitySection() {
  const f = c.facility;
  return (
    <section className="mw-vbec" aria-labelledby="iwt-fac-title">
      <div className="mw-vbec__inner mw-inner">
        <div className="mw-vbec__top">
          <div className="mw-vbec__text">
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label mw-section-tag-label--invert">{f.eyebrow}</span>
            </p>
            <h2 id="iwt-fac-title" className="mw-section-title mw-vbec__title" data-reveal>
              <StopText>{f.title}</StopText>
            </h2>
            <p className="mw-vbec__lead" data-reveal>{f.lead}</p>
          </div>
          <figure className="mw-vbec__media" data-reveal>
            <img src={f.photo} alt="" loading="lazy" />
            <figcaption className="mw-vbec__cap">
              <span className="mw-vbec__cap-mark" aria-hidden="true" />
              Vaughn Bullough Environmental Centre
            </figcaption>
          </figure>
        </div>

        <ul className="mw-vbec__stats" data-reveal-stagger>
          {f.stats.map((s) => (
            <li key={s.label} className="mw-vbec__stat">
              <span className="mw-vbec__stat-val">
                {s.value}<span className="mw-vbec__stat-unit">{s.unit}</span>
              </span>
              <span className="mw-vbec__stat-label">{s.label}</span>
            </li>
          ))}
        </ul>

        <div className="mw-vbec__proc" data-reveal>
          <span className="mw-vbec__proc-eyebrow">{f.processEyebrow}</span>
          <ul className="mw-vbec__proc-list">
            {f.processes.map((p) => (
              <li key={p} className="mw-vbec__proc-chip">
                <span className="mw-vbec__proc-mark" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
