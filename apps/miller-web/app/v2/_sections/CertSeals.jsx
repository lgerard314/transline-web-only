import Image from "next/image";
import { CustodyRule } from "../_components/CustodyThread";

// 01 · CERTIFIED — a deliberately THIN band reading as the manifest's filed
// certifications. Each seal is a "document on file": mark + standard + scope +
// year, linking the real PDF. The ISO marks keep their blue (sanctioned). The
// row reveals as a staggered cascade; the marks clip in.
export function CertSeals({ content }) {
  const c = content;
  return (
    <section className="mx-certs mx-section mx-section--tight mx-warm" aria-label={c.ariaLabel}>
      <CustodyRule />
      <div className="mx-inner">
        <p className="mx-field">
          <span>{c.stage}</span>
          <span className="mx-field__rule" />
          <span>{c.field}</span>
        </p>
        <ul className="mx-certs__row" data-mx-reveal-stagger>
          {c.certs.map((cert) => (
            <li className="mx-certs__item" key={cert.slug}>
              <a className="mx-certs__link" href={cert.href} target="_blank" rel="noopener noreferrer">
                <span className="mx-certs__mark" data-mx-reveal="clip">
                  <Image src={cert.mark} alt="" width={72} height={72} className="mx-certs__img" />
                </span>
                <span className="mx-certs__text">
                  <span className="mx-certs__name">{cert.name}</span>
                  <span className="mx-certs__long">{cert.long}</span>
                </span>
                <span className="mx-certs__year">{cert.year}</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
