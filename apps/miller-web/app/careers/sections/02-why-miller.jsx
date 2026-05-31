import { CAREERS as c } from "@/lib/content/careers";

export function WhyMillerSection() {
  return (
    <section className="tl-container mw-section">
      <p className="mw-section__eyebrow">Why Miller</p>
      <h2 className="tl-display tl-display--m mw-section__title">{c.whyTitle}</h2>
      <p className="mw-section__lead">{c.whyLead}</p>
      <div className="mw-why-grid" style={{ marginTop: 24 }}>
        {c.whyCards.map((card, i) => (
          <article key={i} className="mw-why-card">
            <h3>{card.title}</h3>
            <p>{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
