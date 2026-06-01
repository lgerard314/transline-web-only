import { CoverageGallery } from "@/components/CoverageGallery";
import { REMEDIATION as c } from "@/lib/content/service-environmental-remediation";

// §3 — Who we serve. Coverage-gallery layout (mirrors the emergency-response
// "coverage & readiness" section): the industry list on the left doubles as a
// picker that swaps the large photo on the right.
export function IndustriesSection() {
  const s = c.whoWeServe;
  return (
    <section className="mw-svc-cov mw-svc-cov--serve" aria-labelledby="rem-serve-title">
      <div className="mw-inner">
        <CoverageGallery
          eyebrow={s.eyebrow}
          title={s.title}
          lead={s.lead}
          items={s.provides}
          cta={s.cta}
          titleId="rem-serve-title"
        />
      </div>
    </section>
  );
}
