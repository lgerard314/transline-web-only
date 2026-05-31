import { REMEDIATION as c } from "@/lib/content/service-environmental-remediation";

export function WhyChooseSection() {
  return (
    <section className="tl-container mw-section">
      <p className="mw-section__eyebrow">Why Miller</p>
      <h2 className="tl-display tl-display--m mw-section__title">
        Why choose Miller Environmental
      </h2>
      <div className="mw-why-grid" style={{ marginTop: 24 }}>
        {c.whyChoose.map((card, i) => (
          <article key={i} className="mw-why-card">
            <h3>{card.title}</h3>
            <p>{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
