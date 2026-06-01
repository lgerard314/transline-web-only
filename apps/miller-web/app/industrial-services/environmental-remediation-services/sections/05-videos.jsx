import { REMEDIATION as c } from "@/lib/content/service-environmental-remediation";
import { StopText } from "@/components/StopText";
import { FilmGallery } from "@/components/FilmGallery";

// §5 — On film (the page's unique section). A column of selectable film cards on
// the left drives one large click-to-load player on the right, so the page stays
// fast until a viewer opts in.
export function VideosSection() {
  const v = c.videos;
  return (
    <section className="mw-rem-vid" aria-labelledby="rem-vid-title">
      <div className="mw-rem-vid__inner mw-inner">
        <header className="mw-rem-vid__head">
          <div className="mw-rem-vid__head-left">
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{v.eyebrow}</span>
            </p>
            <h2 id="rem-vid-title" className="mw-section-title" data-reveal>
              <StopText>{v.title}</StopText>
            </h2>
          </div>
          <p className="mw-rem-vid__lead" data-reveal>{v.lead}</p>
        </header>

        <FilmGallery films={v.films} />
      </div>
    </section>
  );
}
