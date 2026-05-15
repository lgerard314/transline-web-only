// Generic content template used by `/about-us/*` plus a couple of
// `/careers/*` siblings (Benefits & Rewards, Working at Miller). Renders
// a PageHero followed by an arbitrary sequence of prose `sections` and
// optional bullet `lists`. No client JS.

import { PageHero } from "@white-owl/brand/components";

export function AboutTemplate({
  eyebrow = "About",
  title,
  lead,
  photo,
  sections = [],   // [{ heading?, body? }]
  lists = [],      // [{ heading?, items: string[] }]
  children,        // bespoke trailing slot (rarely used — keep templates dumb)
}) {
  return (
    <>
      <PageHero eyebrow={eyebrow} title={title} lead={lead} photo={photo} />
      <section className="tl-container" style={{ padding: "var(--space-8) 0" }}>
        <div className="tl-prose" style={{ maxWidth: 720 }}>
          {sections.map((s, i) => (
            <section key={i} style={{ marginBottom: "var(--space-6)" }}>
              {s.heading && <h2 className="tl-display tl-display--s">{s.heading}</h2>}
              {s.body && <p>{s.body}</p>}
            </section>
          ))}
          {lists.map((l, i) => (
            <section key={i} style={{ marginBottom: "var(--space-6)" }}>
              {l.heading && <h3 className="tl-display tl-display--xs">{l.heading}</h3>}
              <ul>
                {l.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            </section>
          ))}
          {children}
        </div>
      </section>
    </>
  );
}
