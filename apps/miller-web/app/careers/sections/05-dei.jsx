import { CAREERS as c } from "@/lib/content/careers";

export function DeiSection() {
  return (
    <section className="mw-section mw-section--tinted">
      <div className="tl-container">
        <p className="mw-section__eyebrow">Inclusion</p>
        <h2 className="tl-display tl-display--m mw-section__title">{c.deiTitle}</h2>
        <p className="mw-section__lead">{c.deiBody}</p>
        <ul style={{ marginTop: 16 }}>
          {c.deiInitiatives.map((it, i) => (
            <li key={i}>{it}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
