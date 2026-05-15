// Shared hero block for secondary pages. Variant decides what fills the
// background: a photo (CSS background-image), the BorderMap SVG, or an
// abstract gradient defined in globals.css.
import { HeroPhoto } from "./HeroPhoto";
import { BorderMap } from "./BorderMap";

export function PageHero({ eyebrow, title, lead, photo, variant = "photo", ctas = null, meta = null }) {
  return (
    <section className="tl-hero" data-variant={variant}>
      <HeroPhoto src={photo} variant={variant} />
      {variant === "map" && (
        <div style={{ position: "absolute", inset: 0, zIndex: 1, opacity: 0.55 }}>
          <BorderMap height="100%" />
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
