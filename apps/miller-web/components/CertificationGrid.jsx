// 4-card certification grid sourced from lib/certs.js. Each card shows
// the mark image (or a labelled placeholder for the MHCA COR card which
// has no mark yet), the cert name + year, and a download link styled per
// spec: `"<name> · PDF, <sizeKB> KB"`. ESLint rule `no-restricted-syntax`
// blocks `href="#"` so phase 2 cannot silently regress on this.

/* eslint-disable @next/next/no-img-element -- 64px mark thumbnails; the
   next/image runtime cost would dominate the rendering time for a node
   this small, and the WebPs are pre-sized at build. */
import { CERTS } from "../lib/certs";

export function CertificationGrid({ certs = CERTS }) {
  return (
    <div className="mw-cert-grid">
      {certs.map((c) => (
        <div key={c.slug} className="mw-cert-card">
          {c.mark ? (
            <img
              className="mw-cert-card__mark"
              src={c.mark}
              alt={`${c.name} certification mark`}
              width={64}
              height={64}
              style={{ background: "transparent" }}
            />
          ) : (
            <span className="mw-cert-card__mark" aria-hidden="true">
              {c.name}
            </span>
          )}
          <h3 className="mw-cert-card__name">{c.name}</h3>
          {c.long && <span className="mw-cert-card__year">{c.long}</span>}
          <a className="mw-cert-card__link" href={c.href} download>
            {c.name} certificate · PDF, {c.sizeKB} KB
          </a>
        </div>
      ))}
    </div>
  );
}
