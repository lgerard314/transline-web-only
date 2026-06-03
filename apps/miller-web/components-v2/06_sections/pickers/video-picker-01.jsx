import { StopText } from "@/components/StopText";
import { FilmGallery } from "@/components/FilmGallery";
import { sectionProps } from "@/components-v2/section-config";

// VideoPicker01 — mw-rem-vid shell: stacked head (eyebrow + h2 left, lead right)
// above FilmGallery. Reproduces 05-videos.jsx verbatim.
//
// Source of truth: app/industrial-services/environmental-remediation-services/sections/05-videos.jsx
//
// content:
//   eyebrow  {string}
//   title    {string}
//   lead     {string}
//   films    {Array<{ id, accent, title, desc }>}
//
// config: passed through sectionProps (emits nothing by default).
//
export function VideoPicker01({ content, config = {} }) {
  return (
    <section className="mw-rem-vid" aria-labelledby={content.titleId} {...sectionProps(config)}>
      <div className="mw-rem-vid__inner mw-inner">
        <header className="mw-rem-vid__head">
          <div className="mw-rem-vid__head-left">
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{content.eyebrow}</span>
            </p>
            <h2 id={content.titleId} className="mw-section-title" data-reveal>
              <StopText>{content.title}</StopText>
            </h2>
          </div>
          <p className="mw-rem-vid__lead" data-reveal>{content.lead}</p>
        </header>

        <FilmGallery films={content.films} />
      </div>
    </section>
  );
}
