import Link from "next/link";
import { CAREERS as c } from "@/lib/content/careers";

export function OpenPositionsSection() {
  return (
    <section className="mw-section mw-section--tinted">
      <div className="tl-container">
        <p className="mw-section__eyebrow">Open Positions</p>
        <h2 className="tl-display tl-display--m mw-section__title">{c.positionsTitle}</h2>
        <p className="mw-section__lead">{c.positionsLead}</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 20,
            marginTop: 24,
          }}
        >
          {c.positions.map((p) => (
            <Link key={p.href} href={p.href} className="mw-cs-card">
              <h3 className="mw-cs-card__title">{p.title}</h3>
              <p style={{ color: "var(--c-ink-2)", fontSize: 14 }}>{p.summary}</p>
              <span className="mw-cs-card__more">Apply now →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
