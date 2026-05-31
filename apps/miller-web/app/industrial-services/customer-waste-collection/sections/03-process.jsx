import { customerWasteCollection as c } from "@/lib/content/service-customer-waste-collection";

// §3 — How it works (numbered process, dark band).
export function ProcessSection() {
  const p = c.process;
  return (
    <section className="mw-svc-steps" aria-labelledby="cwc-steps-title">
      <div className="mw-svc-steps__inner mw-inner">
        <header className="mw-svc-steps__head" data-reveal>
          <p className="mw-section-tag" aria-hidden="true">
            <span className="mw-section-tag-mark" />
            <span className="mw-section-tag-label mw-section-tag-label--invert">{p.eyebrow}</span>
          </p>
          <h2 id="cwc-steps-title" className="mw-section-title mw-svc-steps__title">
            {p.title}<span className="mw-stop" aria-hidden="true" />
          </h2>
        </header>

        <ol className="mw-svc-steps__grid" data-reveal-stagger>
          {p.steps.map((st) => (
            <li key={st.num} className="mw-svc-step">
              <span className="mw-svc-step__num" aria-hidden="true">{st.num}</span>
              <h3 className="mw-svc-step__name">{st.name}</h3>
              <p className="mw-svc-step__text">{st.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
