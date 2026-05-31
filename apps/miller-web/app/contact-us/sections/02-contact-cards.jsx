import { contactContent as c } from "@/lib/content/contact";

export function ContactCardsSection() {
  const { phone, office, intake } = c;
  return (
    <section className="tl-container" style={{ padding: "var(--space-8) 0" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 20,
        }}
      >
        {phone && (
          <div className="mw-loc-card">
            <h2 className="mw-loc-card__title">Phone</h2>
            <a className="tl-mono" href={phone.href}>{phone.display}</a>
          </div>
        )}
        {office && (
          <div className="mw-loc-card">
            <h2 className="mw-loc-card__title">Office</h2>
            <address className="mw-loc-card__addr">
              {office.lines?.map((l, i) => <span key={i}>{l}<br /></span>)}
            </address>
            {office.mapsHref && (
              <a href={office.mapsHref} target="_blank" rel="noreferrer noopener">
                Open in Google Maps →
              </a>
            )}
          </div>
        )}
        {intake && (
          <div className="mw-loc-card">
            <h2 className="mw-loc-card__title">Project Intake / 24/7</h2>
            <a className="tl-mono" href={intake.href}>{intake.display}</a>
            {intake.note && <p style={{ marginTop: 8 }}>{intake.note}</p>}
          </div>
        )}
      </div>
    </section>
  );
}
