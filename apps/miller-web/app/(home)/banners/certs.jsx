import { CERTS } from "@/lib/certs";

// TRUST — Certifications banner. Full-width 4-card row under the hero.
export function CertsBanner() {
  return (
    <section className="mw-trust" aria-label="Certifications">
      <div className="mw-certs" role="list" aria-label="Certifications" data-reveal-stagger>
        {CERTS.map((cert) => {
          const isISO = cert.name.startsWith("ISO");
          const display = isISO
            ? cert.name.replace(/^ISO\s+/, "").split(":")[0]
            : "COR";
          const prefix = isISO ? "ISO" : "MHCA";
          return (
            <a
              key={cert.slug}
              href={cert.href}
              download
              className="mw-cert"
              role="listitem"
              aria-label={`Download ${cert.name} certificate, ${cert.sizeKB} KB PDF`}
            >
              <img
                className="mw-cert__mark"
                src={cert.mark}
                alt=""
                aria-hidden="true"
                loading="lazy"
              />
              <span className="mw-cert__body">
                <span className="mw-cert__prefix">{prefix}&nbsp;·&nbsp;{cert.year}</span>
                <span className="mw-cert__num">{display}</span>
                <span className="mw-cert__desc">{cert.long}</span>
                <span className="mw-cert__pdf">
                  <span>PDF · {cert.sizeKB}KB</span>
                  <span className="mw-cert__arr" aria-hidden="true">↓</span>
                </span>
              </span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
