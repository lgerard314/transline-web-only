import { CoverageGallery } from "@/components/CoverageGallery";
import { sectionProps } from "@/components-v2/section-config";

// PickerGallery01 — wraps CoverageGallery in the mw-svc-cov shell.
// Source of truth: app/industrial-services/emergency-response/sections/04-coverage.jsx
//
// config:
//   serve {boolean} — toggles mw-svc-cov--serve (wider-photo ratio for REM).
//
// content:
//   eyebrow, title, lead, items, cta, titleId, phoneHref, phoneDisplay
//   items[] carry { text, photo, caption, bigAnchor, thumbAnchor, default } — passed through untouched.
//   phoneHref / phoneDisplay come from the hero object in the real page (not from coverage);
//   the sandbox adapter must supply them alongside titleId.

export function PickerGallery01({ content, config = {} }) {
  const { serve = false } = config;
  const cls = "mw-svc-cov" + (serve ? " mw-svc-cov--serve" : "");
  return (
    <section className={cls} aria-labelledby={content.titleId} {...sectionProps(config)}>
      <div className="mw-inner">
        <CoverageGallery
          eyebrow={content.eyebrow}
          title={content.title}
          lead={content.lead}
          items={content.items}
          cta={content.cta}
          titleId={content.titleId}
          phoneHref={content.phoneHref}
          phoneDisplay={content.phoneDisplay}
        />
      </div>
    </section>
  );
}
