import { projectManagement as c } from "@/lib/content/service-project-management";
import { StopText } from "@/components/StopText";

// §3 — Projects we've delivered (unique section). A numbered grid of the six
// project types the Projects Group has managed, on the light surface.
export function ProjectsSection() {
  const p = c.projects;
  return (
    <section className="mw-pm" aria-labelledby="pm-projects-title">
      <div className="mw-pm__inner mw-inner">
        <header className="mw-pm__head">
          <div className="mw-pm__head-left">
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{p.eyebrow}</span>
            </p>
            <h2 id="pm-projects-title" className="mw-section-title" data-reveal>
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
