import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";

// NumberedCardGrid01 — reproduces the `mw-pm` section from
// apps/miller-web/app/industrial-services/project-management/sections/03-projects.jsx
// Light surface; 2-col header (eyebrow+h2 left, lead right); ordered list of numbered cards.
export function NumberedCardGrid01({ content, config = {} }) {
  const p = content;
  return (
    <section className="mw-pm" aria-labelledby={p.titleId} {...sectionProps(config)}>
      <div className="mw-pm__inner mw-inner">
        <header className="mw-pm__head">
          <div className="mw-pm__head-left">
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{p.eyebrow}</span>
            </p>
            <h2 id={p.titleId} className="mw-section-title" data-reveal>
              <StopText>{p.title}</StopText>
            </h2>
          </div>
          <p className="mw-pm__lead" data-reveal>{p.lead}</p>
        </header>

        <ol className="mw-pm__grid" data-reveal-stagger>
          {p.items.map((it) => (
            <li key={it.name} className="mw-pm__card">
              <span className="mw-pm__num" aria-hidden="true">{it.num}</span>
              <h3 className="mw-pm__name">{it.name}</h3>
              <p className="mw-pm__body">{it.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
