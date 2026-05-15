// Compact location card. Used on the homepage Locations cross-link
// section + the Locations dropdown's index page. Plain server
// component — wraps a next/link so the whole card is interactive.

import Link from "next/link";

export function LocationCard({
  href,
  title,
  addressLines = [],
  capabilities = [],
  cta = "Visit location →",
}) {
  return (
    <Link href={href} className="mw-loc-card" style={{ textDecoration: "none", color: "inherit" }}>
      <h3 className="mw-loc-card__title">{title}</h3>
      {addressLines.length > 0 && (
        <address className="mw-loc-card__addr">
          {addressLines.map((l, i) => <span key={i}>{l}<br /></span>)}
        </address>
      )}
      {capabilities.length > 0 && (
        <ul style={{ paddingLeft: 16, margin: 0 }}>
          {capabilities.slice(0, 4).map((c, i) => <li key={i}>{c}</li>)}
        </ul>
      )}
      <span style={{ marginTop: "auto", color: "var(--c-blue)", textDecoration: "underline" }}>
        {cta}
      </span>
    </Link>
  );
}
