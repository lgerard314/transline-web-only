// L3 · certs-banner-01 — trust band; 4-card cert row under the hero.
import { CERTS } from "@/lib/certs";
import { CertCard01 } from "@/components-v2/blocks/cert-card-01";

export function CertsBanner01() {
  return (
    <section className="mw-trust" aria-label="Certifications">
      <div className="mw-certs" role="list" aria-label="Certifications" data-reveal-stagger>
        {CERTS.map((cert) => (
          <CertCard01 key={cert.slug} cert={cert} />
        ))}
      </div>
    </section>
  );
}
