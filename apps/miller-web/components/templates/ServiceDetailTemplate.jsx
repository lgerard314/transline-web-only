// Service detail page template. Two variants — `compact` and
// `capabilities` — share a hero + lead + related-services rail; the
// middle slot differs. The flagship `industrial-waste-treatment` page
// uses the capabilities variant; remediation uses its own bespoke
// template (RemediationTemplate, phase 04).
//
// Content is passed in via props as plain strings + arrays per the
// content-layer rule (design spec §5.1). The template owns layout
// markup only.
//
// The "only in Canada" trust badge sources from `lib/content/brand.js`
// (single source — copy edits flow). Callers may override with an
// explicit `trustBadge` prop.

import Link from "next/link";
import { PageHero, ServiceCard } from "@white-owl/brand/components";
import { relatedServices } from "../../lib/services";
import { ONLY_IN_CANADA_CLAIM } from "../../lib/content/brand";

export function ServiceDetailTemplate({
  variant = "compact",
  slug,
  eyebrow,
  title,
  lead,
  photo,
  bullets,           // optional string[] used by compact variant
  sections,          // optional [{ heading, body }] for compact prose
  groups,            // optional [{ heading, items: string[] }] for capabilities
  ctas,              // optional JSX cluster for the hero CTA row
  trustBadge,        // optional string; falls back to ONLY_IN_CANADA_TRUST on capabilities variant
}) {
  const related = relatedServices(slug, 3);

  return (
    <>
      <PageHero
        eyebrow={eyebrow ?? "Service"}
        title={title}
        lead={lead}
        photo={photo}
        ctas={ctas}
      />

      <section className="tl-container" style={{ padding: "var(--space-8) 0" }}>
        {variant === "capabilities" ? (
          <CapabilitiesBody
            groups={groups}
            trustBadge={trustBadge ?? ONLY_IN_CANADA_CLAIM}
          />
        ) : (
          <CompactBody sections={sections} bullets={bullets} />
        )}
      </section>

      {related.length > 0 && (
        <section className="tl-container" style={{ padding: "var(--space-8) 0" }}>
          <h2 className="tl-display tl-display--m">Related services</h2>
          <div
            className="tl-svc-grid"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 16,
              marginTop: 24,
            }}
          >
            {related.map((s, i) => (
              <ServiceCard
                key={s.id}
                num={String(i + 1).padStart(2, "0")}
                title={s.title}
                body={s.summary}
                icon={s.icon}
                href={`/industrial-services/${s.slug}`}
              />
            ))}
          </div>
          <p style={{ marginTop: 24 }}>
            <Link href="/industrial-services">All services →</Link>
          </p>
        </section>
      )}
    </>
  );
}

function CompactBody({ sections = [], bullets }) {
  return (
    <div className="tl-prose" style={{ maxWidth: 720 }}>
      {sections.map((s, i) => (
        <section key={i} style={{ marginBottom: "var(--space-6)" }}>
          {s.heading && <h2 className="tl-display tl-display--s">{s.heading}</h2>}
          {s.body && <p>{s.body}</p>}
        </section>
      ))}
      {Array.isArray(bullets) && bullets.length > 0 && (
        <ul>
          {bullets.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function CapabilitiesBody({ groups = [], trustBadge }) {
  return (
    <div style={{ maxWidth: 920 }}>
      {trustBadge && <p className="mw-trust-badge">{trustBadge}</p>}
      <div style={{ display: "grid", gap: "var(--space-7)", marginTop: "var(--space-5)" }}>
        {groups.map((g, i) => (
          <section key={i}>
            {g.heading && <h2 className="tl-display tl-display--s">{g.heading}</h2>}
            {g.body && <p style={{ marginBottom: 12 }}>{g.body}</p>}
            {Array.isArray(g.items) && g.items.length > 0 && (
              <ul>
                {g.items.map((it, j) => (
                  <li key={j}>{it}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
