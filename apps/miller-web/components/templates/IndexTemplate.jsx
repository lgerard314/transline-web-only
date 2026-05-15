// Generic "index" template — PageHero + 4-card grid. Used only by
// `/case-studies/`. The Careers index uses CareersTemplate instead (per
// design spec §3.7); the Services index has its own one-off grid since
// it shows 10 cards, not 4.

import Link from "next/link";
import { PageHero } from "@white-owl/brand/components";

export function IndexTemplate({
  eyebrow,
  title,
  lead,
  photo,
  cards = [], // [{ title, summary, href, meta? }]
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} lead={lead} photo={photo} />
      <section className="tl-container" style={{ padding: "var(--space-8) 0" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {cards.map((c, i) => (
            <Link key={i} href={c.href} className="mw-cs-card">
              {c.meta && <span className="mw-cs-card__loc">{c.meta}</span>}
              <h3 className="mw-cs-card__title">{c.title}</h3>
              {c.summary && <p>{c.summary}</p>}
              <span className="mw-cs-card__more">Read case study →</span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
