import { winnipegServiceCentre as c } from "@/lib/content/winnipeg-service-centre";

export function AddressMapSection() {
  const { address, hero } = c;
  return (
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
            title={`Map of ${hero.title}`}
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
  );
}
