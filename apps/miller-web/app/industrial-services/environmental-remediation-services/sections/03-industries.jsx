import { REMEDIATION as c } from "@/lib/content/service-environmental-remediation";

export function IndustriesSection() {
  return (
    <section className="mw-section mw-section--tinted">
      <div className="tl-container">
        <p className="mw-section__eyebrow">Industries & Situations</p>
        <h2 className="tl-display tl-display--m mw-section__title">
          Industries & situations we serve
        </h2>
        <ul style={{ columns: 2, columnGap: 40, maxWidth: 720, marginTop: 16 }}>
          {c.industries.map((it, i) => (
            <li key={i} style={{ breakInside: "avoid" }}>{it}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
