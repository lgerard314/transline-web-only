import { winnipegServiceCentre as c } from "@/lib/content/winnipeg-service-centre";

export function ContactSection() {
  const { contact } = c;
  if (!contact) return null;

  return (
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
  );
}
