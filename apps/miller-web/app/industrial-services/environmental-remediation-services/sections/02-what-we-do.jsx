import { REMEDIATION as c } from "@/lib/content/service-environmental-remediation";

export function WhatWeDoSection() {
  return (
    <section className="tl-container mw-section">
      <p className="mw-section__eyebrow">What We Do</p>
      <h2 className="tl-display tl-display--m mw-section__title">
        Six specialised remediation capabilities
      </h2>
      <p className="mw-section__lead">{c.whatWeDoIntro}</p>
      <div className="mw-rem-grid" style={{ marginTop: 24 }}>
        {c.whatWeDo.map((card, i) => (
          <article key={i} className="mw-rem-card">
            <h3 className="mw-rem-card__title">{card.title}</h3>
            <p className="mw-rem-card__body">{card.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
