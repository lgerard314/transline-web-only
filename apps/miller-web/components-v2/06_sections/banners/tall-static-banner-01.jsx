// L3 · tall-static-banner-01 — trust band; 4-card cert row under the hero.
import { CERTS } from "@/lib/certs";
import { DownloadCard01 } from "@/components-v2/03_cards/download/download-card-01";

export function TallStaticBanner01() {
  return (
    <section className="mw-trust" aria-label="Certifications">
      <div className="mw-certs" role="list" aria-label="Certifications" data-reveal-stagger>
        {CERTS.map((cert) => (
          <DownloadCard01 key={cert.slug} cert={cert} />
        ))}
      </div>
    </section>
  );
}
