// Shared hero block for secondary pages. Variant decides what fills the
// background: a photo (CSS background-image), an app-supplied map slot
// (e.g., TL49's BorderMap), or an abstract gradient defined in globals.css.
//
// The map is passed as a render-prop (`mapSlot`) rather than imported here,
// because the map artwork is brand-specific (TL49: 49°N parallel; Miller
// would supply its own or none at all). Keeping the slot generic lets this
// component stay in the shared package.
import { HeroPhoto } from "./HeroPhoto";

export function PageHero({ eyebrow, title, lead, photo, variant = "photo", ctas = null, meta = null, mapSlot = null }) {
  return (
    <section className="tl-hero" data-variant={variant}>
      <HeroPhoto src={photo} variant={variant} />
      {variant === "map" && mapSlot && (
        <div style={{ position: "absolute", inset: 0, zIndex: 1, opacity: 0.55 }}>
          {mapSlot}
        </div>
      )}
      <div className="tl-container tl-hero__inner">
        <div className="tl-hero__rule">
          <span className="tl-parallel__tick" style={{ borderColor: "rgba(101,183,65,0.8)" }} />
          <span className="tl-mono">{eyebrow}</span>
          <span
            className="tl-parallel__line"
            style={{ background: "linear-gradient(to right, rgba(101,183,65,0.4), transparent)" }}
          />
        </div>
        <h1 className="tl-display tl-display--xl tl-hero__title">{title}</h1>
        {lead && <p className="tl-lead tl-hero__lead">{lead}</p>}
        {ctas && <div className="tl-hero__ctas">{ctas}</div>}
      </div>
      {meta && (
        <div className="tl-container tl-hero__meta">
          {meta.map((m, i) => (
            <span key={i}>
              <strong>{m.k}</strong>
              {m.v}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
