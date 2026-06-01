import { industrialCleaning as c } from "@/lib/content/service-industrial-cleaning";
import { StopText } from "@/components/StopText";

// §4 — The crew. Four numbered reason cards on dark walnut (shared why-Miller band).
export function WhySection() {
  const w = c.why;
  return (
    <section className="mw-why" aria-labelledby="ic-why-title">
      <div className="mw-why__inner mw-inner">
        <header className="mw-why__head">
          <p className="mw-section-tag" data-reveal aria-hidden="true">
            <span className="mw-section-tag-mark" />
            <span className="mw-section-tag-label mw-section-tag-label--invert">{w.eyebrow}</span>
          </p>
          <h2 id="ic-why-title" className="mw-section-title mw-why__title" data-reveal>
            <StopText>{w.title}</StopText>
          </h2>
        </header>

        <ul className="mw-why__grid" data-reveal-stagger>
          {w.items.map((it) => (
            <li key={it.title} className="mw-why__card">
              <span className="mw-why__num" aria-hidden="true">{it.mark}</span>
              <h3 className="mw-why__name">{it.title}</h3>
              <p className="mw-why__body">{it.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
