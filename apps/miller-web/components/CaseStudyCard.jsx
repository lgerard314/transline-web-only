// Case-study teaser card. Used on the Remediation page (4-card rail) and
// the `/case-studies/` index. Title + location + read-more link.

import Link from "next/link";

export function CaseStudyCard({ href, title, location, summary }) {
  return (
    <Link href={href} className="mw-cs-card" style={{ textDecoration: "none", color: "inherit" }}>
      {location && <span className="mw-cs-card__loc">{location}</span>}
      <h3 className="mw-cs-card__title">{title}</h3>
      {summary && <p style={{ color: "var(--c-ink-2)", fontSize: 14 }}>{summary}</p>}
      <span className="mw-cs-card__more">Read case study →</span>
    </Link>
  );
}
