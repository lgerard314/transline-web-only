// L3 · tall-static-banner-01 — trust band; download-card row under the hero.
import { DownloadCard01 } from "@/components-v2/03_cards/download/download-card-01";

export function TallStaticBanner01({ content, config = {} }) {
  return (
    <section className="mw-trust" aria-label={content.ariaLabel}>
      <div className="mw-certs" role="list" aria-label={content.ariaLabel} data-reveal-stagger>
        {content.certs.map((cert) => (<DownloadCard01 key={cert.slug} cert={cert} />))}
      </div>
    </section>
  );
}
