import { REMEDIATION as c } from "@/lib/content/service-environmental-remediation";
import { StopText } from "@/components/StopText";
import { LiteYouTube } from "@/components/LiteYouTube";

// §5 — Field footage (the page's unique section). A featured project film over
// two supporting brand films, each a click-to-load YouTube facade so the page
// stays fast until a viewer opts in.
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

        <div className="mw-rem-vid__featured" data-reveal>
          <LiteYouTube id={v.featured.id} title={v.featured.title} className="mw-lyt--featured" />
        </div>

        <ul className="mw-rem-vid__grid" data-reveal-stagger>
          {v.supporting.map((vid) => (
            <li key={vid.id} className="mw-rem-vid__item">
              <LiteYouTube id={vid.id} title={vid.title} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
