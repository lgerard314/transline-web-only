import { CAREERS as c } from "@/lib/content/careers";

export function CloseSection() {
  return (
    <section className="tl-container mw-section">
      <p className="mw-section__eyebrow">Get in touch</p>
      <h2 className="tl-display tl-display--m mw-section__title">{c.closeTitle}</h2>
      <p style={{ maxWidth: "60ch" }}>{c.closeBody}</p>
      <p style={{ marginTop: 24 }}>
        Send your resume to{" "}
        <a className="tl-mono" href={`mailto:${c.emailHr}`}>{c.emailHr}</a>.
      </p>
    </section>
  );
}
