// page-home.jsx
const HomePage = ({ onNav, tweaks }) => {
  const heroVariant = tweaks.heroVariant || "photo";
  const heroPhoto = TL_PHOTOS[tweaks.heroPhoto || "heroTruck"];

  return (
    <div className="tl-pagewrap">
      {/* ── Hero ───────────────────────────────────────────────── */}
      <section className="tl-hero" data-variant={heroVariant}>
        <HeroPhoto src={heroPhoto} variant={heroVariant} />
        {heroVariant === "map" && (
          <div style={{ position: "absolute", inset: 0, zIndex: 1, opacity: 0.6, pointerEvents: "none" }}>
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: "100%", maxWidth: 1100, padding: "0 24px" }}>
                <BorderMap height={400} />
              </div>
            </div>
          </div>
        )}

        <div className="tl-container tl-hero__inner">
          <div className="tl-hero__rule">
            <span className="tl-parallel__tick" style={{ borderColor: "rgba(101,183,65,0.8)" }} />
            <span className="tl-mono">U.S. → CANADA · TRANSBOUNDARY WASTE SERVICES</span>
            <span style={{ flex: 1, height: 1, background: "linear-gradient(to right, rgba(101,183,65,0.4), transparent)" }} />
          </div>

          <h1 className="tl-display tl-display--xl tl-hero__title">
            Cross-border waste, <span style={{ color: "var(--c-accent)" }}>handled.</span>
          </h1>

          <p className="tl-lead tl-hero__lead">
            TransLine49° Environmental Services helps companies navigate transboundary waste
            movement from the United States into Canada — including hazardous waste permitting,
            logistics coordination, and access to Canadian disposal and recycling pathways.
          </p>

          <div className="tl-hero__ctas">
            <button className="tl-btn tl-btn--primary tl-btn--lg" onClick={() => onNav("contact")}>
              Start a Project <span className="tl-btn-arr">→</span>
            </button>
            <a className="tl-btn tl-btn--ghost-light tl-btn--lg" href="tel:+13149342133">
              <Icon name="phone" /> (314) 934-2133
            </a>
          </div>
        </div>

        <div className="tl-container tl-hero__meta">
          <span><strong>49°N</strong> THE U.S.–CANADA PARALLEL</span>
          <span><strong>HQ</strong> ST. LOUIS, MISSOURI</span>
          <span><strong>AFFILIATED</strong> MILLER ENVIRONMENTAL CORPORATION</span>
          <span><strong>FOCUS</strong> HAZARDOUS &amp; NON-HAZARDOUS</span>
        </div>
      </section>

      {/* ── Trust bar ─────────────────────────────────────────── */}
      <TrustBar items={[
        { k: "INCORPORATED", v: "U.S.-based company" },
        { k: "HEADQUARTERS", v: "St. Louis, Missouri" },
        { k: "AFFILIATION", v: "Miller Environmental Corp." },
        { k: "FOCUS", v: "U.S. → Canada transboundary waste" },
      ]} />

      {/* ── What we help with ─────────────────────────────────── */}
      <section className="tl-section">
        <div className="tl-container">
          <SectionHead
            eyebrow="01 · WHAT WE HELP WITH"
            title="A practical bridge across the 49th parallel."
            lead="Four core capabilities. We handle the messy parts of moving waste from a U.S. generator to a Canadian receiving facility — from paper to wheels-up."
            right={
              <button className="tl-btn tl-btn--ghost" onClick={() => onNav("services")}>
                See all services <span className="tl-btn-arr">→</span>
              </button>
            }
          />
        </div>

        <div className="tl-services-grid" data-reveal-stagger>
          <ServiceCard
            num="S/01"
            title="Cross-Border Waste Movement"
            body="Support for moving hazardous and non-hazardous waste from the United States into Canada, from project scoping through completion."
            icon={<Icon name="border" />}
            onClick={() => onNav("services")}
          />
          <ServiceCard
            num="S/02"
            title="Hazardous Waste Permitting"
            body="Assistance with cross-border hazardous waste permitting requirements, documentation, and the workflow between regulators."
            icon={<Icon name="permit" />}
            onClick={() => onNav("services")}
          />
          <ServiceCard
            num="S/03"
            title="Logistics Coordination"
            body="Scheduling and coordination of material movement between generators, carriers, and receiving facilities — without the back-and-forth."
            icon={<Icon name="truck" />}
            onClick={() => onNav("services")}
          />
          <ServiceCard
            num="S/04"
            title="Disposal & Recycling Access"
            body="Access to Canadian treatment, disposal, recycling, and repurposing options — with a recycling-first preference where viable."
            icon={<Icon name="recycle" />}
            onClick={() => onNav("services")}
          />
        </div>
      </section>

      {/* ── Why companies use us ──────────────────────────────── */}
      <section className="tl-section" style={{ background: "var(--c-surface)", borderBlock: "1px solid var(--c-line)" }}>
        <div className="tl-container">
          <SectionHead
            eyebrow="02 · WHY COMPANIES USE TRANSLINE49°"
            title="Cross-border isn't generic environmental services."
            lead="When a U.S. generator needs a Canadian outcome, three things have to land together. Companies use us to make that happen."
          />

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 32 }} data-tlgrid-collapse data-reveal-stagger>
            {[
              {
                kn: "01",
                t: "Navigate complexity",
                b: "Cross-border hazardous waste movement involves regulatory steps, paperwork, and coordination that don't map cleanly to a domestic disposal job.",
              },
              {
                kn: "02",
                t: "Access Canadian options",
                b: "We connect U.S. customers with Canadian treatment, disposal, recycling, and repurposing pathways that may not be visible from south of the border.",
              },
              {
                kn: "03",
                t: "Improve environmental outcomes",
                b: "Emphasis on recycling and repurposing where viable, with a preference for the most sustainable disposal option available for the material.",
              },
            ].map((c, i) => (
              <div key={i} style={{ borderTop: "2px solid var(--c-navy)", paddingTop: 20 }}>
                <div className="tl-keynum">{c.kn}</div>
                <h3 className="tl-display tl-display--s" style={{ marginTop: 20 }}>{c.t}</h3>
                <p className="tl-body" style={{ marginTop: 12 }}>{c.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How we do it (simplified) ─────────────────────────── */}
      <section className="tl-section">
        <div className="tl-container">
          <ProcessFlowSimple onNav={onNav} />
        </div>
      </section>

      <Marquee items={[
        "U.S. → CANADA WASTE MOVEMENT",
        "HAZARDOUS & NON-HAZARDOUS",
        "PERMITTING SUPPORT",
        "LOGISTICS COORDINATION",
        "DISPOSAL · RECYCLING · REPURPOSING",
        "ST. LOUIS · MO · 49°N",
      ]} />

      {/* ── Partner / affiliation ─────────────────────────────── */}
      <section className="tl-section" style={{ background: "var(--c-surface)", borderBottom: "1px solid var(--c-line)" }}>
        <div className="tl-container" data-tlgrid-collapse style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <ParallelRule label="04 · NETWORK" />
            <h2 className="tl-display tl-display--l" style={{ marginTop: 24 }}>
              Connected across the U.S.–Canada environmental services market.
            </h2>
            <p className="tl-lead" style={{ marginTop: 20 }}>
              TransLine49° is a U.S.-based environmental services company affiliated with
              Miller Environmental Corporation, supporting customers with cross-border
              shipments and permitting guidance.
            </p>

            <div data-tlgrid-collapse data-reveal-stagger className="tl-meta-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, marginTop: 36, borderTop: "1px solid var(--c-line)" }}>
              {[
                { k: "U.S. BASE", v: "St. Louis, Missouri" },
                { k: "OPERATIONAL PARTNER", v: "Miller Environmental Corp." },
                { k: "OWNERSHIP", v: "White Owl Family Office Group" },
                { k: "FOCUS REGION", v: "United States → Canada" },
              ].map((it, i) => (
                <div key={i} style={{ padding: "16px 0", borderBottom: "1px solid var(--c-line)", paddingRight: 24 }}>
                  <div className="tl-mono" style={{ color: "var(--c-ink-3)", fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{it.k}</div>
                  <div style={{ fontWeight: 500, color: "var(--c-navy)" }}>{it.v}</div>
                </div>
              ))}
            </div>

            <div style={{ marginTop: 32 }}>
              <button className="tl-btn tl-btn--dark" onClick={() => onNav("about")}>
                About TransLine49° <span className="tl-btn-arr">→</span>
              </button>
            </div>
          </div>

          {/* Map card */}
          <div className="tl-map-wrap">
            <div className="tl-map-wrap__inner">
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24, alignItems: "baseline" }}>
                <span className="tl-mono" style={{ color: "rgba(230,238,242,0.5)", fontSize: 11, letterSpacing: "0.12em" }}>
                  CROSS-BORDER NETWORK · 49°N
                </span>
                <span className="tl-mono" style={{ color: "var(--c-accent)", fontSize: 11 }}>LIVE PATHWAYS</span>
              </div>
              <BorderMap height={280} />
              <div data-tlgrid-collapse style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginTop: 24, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                {[
                  { k: "ORIGIN", v: "St. Louis, MO" },
                  { k: "PRIMARY", v: "ON · AB · QC" },
                  { k: "TYPE", v: "Haz / Non-haz" },
                ].map((it, i) => (
                  <div key={i}>
                    <div className="tl-mono" style={{ fontSize: 10, color: "rgba(230,238,242,0.45)", letterSpacing: "0.1em", marginBottom: 4 }}>{it.k}</div>
                    <div style={{ color: "#fff", fontSize: 14, fontWeight: 500 }}>{it.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <section style={{ background: "var(--c-navy)", color: "var(--c-on-navy)" }}>
        <div className="tl-container" style={{ paddingTop: "clamp(64px, 13vw, 128px)", paddingBottom: "clamp(64px, 13vw, 128px)", textAlign: "center" }}>
          <ParallelRule light label="START A PROJECT" />
          <h2 className="tl-display tl-display--xl" style={{ color: "#fff", margin: "32px auto 24px", maxWidth: "20ch" }}>
            Need help with a cross-border waste project?
          </h2>
          <p className="tl-lead" style={{ color: "rgba(230,238,242,0.78)", margin: "0 auto", maxWidth: "55ch" }}>
            Share material details and a team member will review your inquiry. Most reviews
            start with a quick call.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 40, flexWrap: "wrap" }}>
            <button className="tl-btn tl-btn--primary tl-btn--lg" onClick={() => onNav("contact")}>
              Start a Project <span className="tl-btn-arr">→</span>
            </button>
            <a className="tl-btn tl-btn--ghost-light tl-btn--lg" href="tel:+13149342133">
              <Icon name="phone" /> (314) 934-2133
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

window.HomePage = HomePage;
