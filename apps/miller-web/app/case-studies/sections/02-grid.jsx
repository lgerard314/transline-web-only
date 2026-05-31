import Link from "next/link";
import { caseStudiesIndex as c } from "@/lib/content/case-studies";

export function GridSection() {
  return (
    <section className="tl-container" style={{ padding: "var(--space-8) 0" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 20,
        }}
      >
        {c.cards.map((card, i) => (
          <Link key={i} href={card.href} className="mw-cs-card">
            {card.meta && <span className="mw-cs-card__loc">{card.meta}</span>}
            <h3 className="mw-cs-card__title">{card.title}</h3>
            {card.summary && <p>{card.summary}</p>}
            <span className="mw-cs-card__more">Read case study →</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
