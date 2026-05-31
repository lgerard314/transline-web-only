import { customerWasteCollection as c } from "@/lib/content/service-customer-waste-collection";

// §2 — Any-volume scale ribbon (signature layout for this page).
export function ScaleSection() {
  const s = c.scale;
  return (
    <section className="mw-svc-scale" aria-labelledby="cwc-scale-title">
      <div className="mw-svc-scale__inner mw-inner">
        <header className="mw-svc-scale__head" data-reveal>
          <div className="mw-svc-scale__head-left">
            <p className="mw-section-tag" aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{s.eyebrow}</span>
            </p>
            <h2 id="cwc-scale-title" className="mw-section-title">
              {s.title}<span className="mw-stop" aria-hidden="true" />
            </h2>
          </div>
          <p className="mw-svc-scale__lead">{s.lead}</p>
        </header>

        <ol className="mw-svc-scale__ribbon" data-reveal-stagger>
          {s.steps.map((st) => (
            <li key={st.num} className="mw-svc-scale__step">
              <div className="mw-svc-scale__bar-wrap">
                <span className="mw-svc-scale__spec">{st.spec}</span>
                <span className="mw-svc-scale__bar" aria-hidden="true" />
              </div>
              <div className="mw-svc-scale__meta">
                <span className="mw-svc-scale__num">{st.num}</span>
                <h3 className="mw-svc-scale__name">{st.name}</h3>
                <p className="mw-svc-scale__note">{st.note}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
