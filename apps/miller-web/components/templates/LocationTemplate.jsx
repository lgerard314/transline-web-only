// Location page template — facility hero, address card, lazy-loaded
// Google Maps iframe, capabilities list, contact card. Used by
// `/treatment-facility/` and `/winnipeg-service-centre/`.
//
// The iframe pulls from Google Maps' embed URL — no JS map library — and
// uses `loading="lazy"` + `referrerPolicy="no-referrer-when-downgrade"`
// to keep the bundle untouched and analytics referrers clean.

import { PageHero } from "@white-owl/brand/components";

export function LocationTemplate({
  eyebrow = "Location",
  title,
  lead,
  photo,
  address,       // { lines: string[], mapsHref, embedSrc }
  capabilities,  // string[]
  contact,       // { phone: { display, href }, email?, hours? }
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} lead={lead} photo={photo} />

      <section className="tl-container" style={{ padding: "var(--space-8) 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
        <div className="mw-loc-card">
          <h2 className="mw-loc-card__title">Address</h2>
          {address?.lines && (
            <address className="mw-loc-card__addr">
              {address.lines.map((l, i) => (
                <span key={i}>{l}<br /></span>
              ))}
            </address>
          )}
          {address?.mapsHref && (
            <a href={address.mapsHref} target="_blank" rel="noreferrer noopener">
              Open in Google Maps →
            </a>
          )}
        </div>
        {address?.embedSrc && (
          <div style={{ minHeight: 280, borderRadius: 12, overflow: "hidden", border: "1px solid var(--c-line)" }}>
            <iframe
              src={address.embedSrc}
              title={`Map of ${title}`}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 280 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        )}
      </section>

      {Array.isArray(capabilities) && capabilities.length > 0 && (
        <section className="tl-container" style={{ padding: "var(--space-7) 0" }}>
          <h2 className="tl-display tl-display--m">Capabilities</h2>
          <ul style={{ marginTop: 16 }}>
            {capabilities.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </section>
      )}

      {contact && (
        <section className="tl-container" style={{ padding: "var(--space-7) 0" }}>
          <div className="mw-loc-card">
            <h2 className="mw-loc-card__title">Contact</h2>
            {contact.phone && (
              <p>
                Phone: <a className="tl-mono" href={contact.phone.href}>{contact.phone.display}</a>
              </p>
            )}
            {contact.email && (
              <p>Email: <a href={`mailto:${contact.email}`}>{contact.email}</a></p>
            )}
            {contact.hours && <p>Hours: {contact.hours}</p>}
          </div>
        </section>
      )}
    </>
  );
}
