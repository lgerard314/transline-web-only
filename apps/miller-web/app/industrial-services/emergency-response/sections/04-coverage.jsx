import { CoverageGallery } from "@/components/CoverageGallery";
import { emergencyResponse as c } from "@/lib/content/service-emergency-response";

// §4 — Coverage & capabilities (hover-swap gallery).
export function CoverageSection() {
  const cov = c.coverage;
  return (
    <section className="mw-svc-cov" aria-labelledby="er-cov-title">
      <div className="mw-inner">
        <CoverageGallery
          eyebrow={cov.eyebrow}
          title={cov.title}
          lead={cov.lead}
          items={cov.provides}
          cta={cov.cta}
          titleId="er-cov-title"
        />
      </div>
    </section>
  );
}
