// page-about.jsx
const AboutPage = ({ onNav, tweaks }) => {
  return (
    <div className="tl-pagewrap">
      <PageHero
        eyebrow="ABOUT · COMPANY & NETWORK"
        title={<>A U.S.–Canada environmental services <span style={{ color: "var(--c-accent)" }}>connection.</span></>}
        lead="TransLine49° Environmental Services is a U.S.-based company headquartered in St. Louis, Missouri and affiliated with Miller Environmental Corporation. We help customers with the transboundary movement of waste into Canada."
        photo={TL_PHOTOS.heroIndustrial}
        variant={tweaks.heroVariant || "photo"}
        ctas={<>
          <button className="tl-btn tl-btn--primary" onClick={() => onNav("contact")}>
            Talk to TransLine49° <span className="tl-btn-arr">→</span>
          </button>
        </>}
        meta={[
          { k: "FOUNDED", v: "U.S. ENVIRONMENTAL SERVICES" },
          { k: "HQ", v: "ST. LOUIS · MO" },
          { k: "AFFILIATION", v: "MILLER ENVIRONMENTAL CORP." },
        ]}
      />

      {/* Who we are */}
      <section className="tl-section">
        <div className="tl-container" data-tlgrid-collapse style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 64 }}>
          <div>
            <ParallelRule label="01 · WHO WE ARE" />
            <h2 className="tl-display tl-display--l" style={{ marginTop: 24 }}>Who we are.</h2>
          </div>
          <div>
            <p className="tl-lead">
              TransLine49° helps customers with transboundary waste movement from the United
              States into Canada — including access to disposal and recycling options,
              permitting assistance, and logistics coordination.
            </p>
            <p className="tl-body" style={{ marginTop: 24, fontSize: 17, lineHeight: 1.55 }}>
              The 49th parallel is the line on the map. We're the people who help your material
              cross it cleanly — with the right permits, the right paperwork, and a recycling-first
              preference where the material allows.
            </p>
          </div>
        </div>
      </section>

      {/* Our role */}
      <section className="tl-section" style={{ background: "var(--c-surface)", borderBlock: "1px solid var(--c-line)" }}>
        <div className="tl-container">
          <SectionHead
            eyebrow="02 · OUR ROLE"
            title="Three things we do, in plainer English."
          />

          <div data-tlgrid-collapse data-reveal-stagger style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0,
                        borderTop: "1px solid var(--c-line)", borderBottom: "1px solid var(--c-line)" }}>
            {[
              { tag: "GUIDE",
                t: "Cross-border path",
                b: "We help customers understand whether their material can move into Canada — and what it takes.",
                icon: "north" },
              { tag: "COORDINATOR",
                t: "Permits & movement",
                b: "We support permitting and movement logistics, working between you, regulators, carriers, and receiving facilities.",
                icon: "doc" },
              { tag: "CONNECTOR",
                t: "Canadian outlets",
                b: "We provide access to Canadian disposal, treatment, recycling, and repurposing options for hazardous and non-hazardous waste.",
                icon: "recycle" },
            ].map((c, i) => (
              <div key={i} style={{
                padding: "40px 32px",
                borderLeft: i === 0 ? 0 : "1px solid var(--c-line)",
                minHeight: 320,
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                gap: 20,
              }}>
                <div>
                  <span style={{
                    width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center",
                    border: "1px solid var(--c-line)", borderRadius: 999, color: "var(--c-blue)",
                    marginBottom: 24,
                  }}>
                    <Icon name={c.icon} />
                  </span>
                  <span className="tl-mono" style={{ color: "var(--c-blue)", fontSize: 11, letterSpacing: "0.12em" }}>
                    ROLE · {c.tag}
                  </span>
                  <h3 className="tl-display tl-display--s" style={{ marginTop: 12, marginBottom: 12 }}>{c.t}</h3>
                  <p className="tl-body" style={{ fontSize: 15 }}>{c.b}</p>
                </div>
                <div className="tl-mono" style={{ fontSize: 10.5, color: "var(--c-ink-3)", letterSpacing: "0.1em" }}>
                  {String(i + 1).padStart(2, "0")} / 03
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Affiliation & backing */}
      <section className="tl-section">
        <div className="tl-container">
          <SectionHead
            eyebrow="03 · AFFILIATION & BACKING"
            title="A small company with a real network behind it."
            lead="TransLine49° doesn't have to invent the relationships, the regulatory familiarity, or the operational backbone that cross-border waste needs. Those came with the company."
          />

          <div data-tlgrid-collapse data-reveal-stagger style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 24 }}>
            <div className="tl-card">
              <ParallelRule label="U.S. BASE" />
              <h3 className="tl-display tl-display--m" style={{ marginTop: 24, marginBottom: 12 }}>
                Headquartered in Clayton, Missouri.
              </h3>
              <p className="tl-body" style={{ marginBottom: 24 }}>
                A U.S.-based environmental services company at 231 S. Bemiston Ave, Suite 800,
                Clayton, MO 63105 — minutes from downtown St. Louis.
              </p>
              <div style={{ borderTop: "1px solid var(--c-line)", paddingTop: 20,
                            display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <div className="tl-mono" style={{ fontSize: 11, color: "var(--c-ink-3)", letterSpacing: "0.1em" }}>OFFICE</div>
                  <div style={{ fontWeight: 500, color: "var(--c-navy)", marginTop: 4 }}>Clayton, MO</div>
                </div>
                <div>
                  <div className="tl-mono" style={{ fontSize: 11, color: "var(--c-ink-3)", letterSpacing: "0.1em" }}>PHONE</div>
                  <div style={{ fontWeight: 500, color: "var(--c-navy)", marginTop: 4, fontFamily: "var(--font-mono)" }}>(314) 934-2133</div>
                </div>
              </div>
            </div>

            <div className="tl-card tl-card--dark" style={{ position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -40, right: -40, opacity: 0.15 }}>
                <BorderMap height={300} withFloatLabels={false} />
              </div>
              <div style={{ position: "relative" }}>
                <ParallelRule light label="NETWORK" />
                <h3 className="tl-display tl-display--m" style={{ marginTop: 24, marginBottom: 12, color: "#fff" }}>
                  Affiliated &amp; backed.
                </h3>
                <p className="tl-body" style={{ color: "rgba(230,238,242,0.78)", marginBottom: 24 }}>
                  Affiliated with Miller Environmental Corporation. Connected to White Owl
                  Family Office Group — which holds strategic investments across the U.S. and Canada.
                </p>
                <div className="tl-affil-list" style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 20 }}>
                  {[
                    { k: "OPERATIONAL PARTNER", v: "Miller Environmental Corporation" },
                    { k: "OWNERSHIP", v: "White Owl Family Office Group" },
                    { k: "FOOTPRINT", v: "United States · Canada" },
                  ].map((it, i) => (
                    <div key={i} style={{
                      padding: "12px 0", display: "grid", gridTemplateColumns: "180px 1fr",
                      gap: 12, borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.08)" : 0,
                    }}>
                      <span className="tl-mono" style={{ fontSize: 11, color: "rgba(230,238,242,0.5)", letterSpacing: "0.1em" }}>
                        {it.k}
                      </span>
                      <span style={{ color: "#fff", fontWeight: 500 }}>{it.v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Environmental focus */}
      <section className="tl-section" style={{
        background: "linear-gradient(180deg, #122C3A 0%, #0B1F2A 100%)",
        color: "var(--c-on-navy)",
      }}>
        <div className="tl-container" data-tlgrid-collapse style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <ParallelRule light label="04 · ENVIRONMENTAL FOCUS" />
            <h2 className="tl-display tl-display--l" style={{ marginTop: 24, color: "#fff" }}>
              Recycle and repurpose first. Dispose last.
            </h2>
            <p className="tl-lead" style={{ marginTop: 20, color: "rgba(230,238,242,0.85)" }}>
              TransLine49° emphasizes recycling and repurposing of waste where possible to make
              disposal options more environmentally sustainable. The cleanest waste is the waste
              that doesn't end up in a landfill.
            </p>
          </div>
          <div data-tlgrid-collapse data-reveal-stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { k: "01", t: "Recycle", b: "Where the material allows, we look for a recycling pathway first." },
              { k: "02", t: "Repurpose", b: "Material that can be put to another use is directed there." },
              { k: "03", t: "Treat", b: "Treatment options are evaluated before disposal." },
              { k: "04", t: "Dispose", b: "Disposal is the last step — and the right one, when it's the right one." },
            ].map((c, i) => (
              <div key={i} style={{
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 10,
                padding: "20px 18px",
                background: "rgba(255,255,255,0.02)",
              }}>
                <span className="tl-mono" style={{ color: "var(--c-accent)", fontSize: 11, letterSpacing: "0.1em" }}>
                  {c.k}
                </span>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 500,
                              color: "#fff", margin: "8px 0 8px", letterSpacing: "-0.01em" }}>
                  {c.t}
                </h3>
                <p style={{ fontSize: 13.5, color: "rgba(230,238,242,0.7)", lineHeight: 1.5, margin: 0 }}>
                  {c.b}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What makes this different */}
      <section className="tl-section">
        <div className="tl-container">
          <SectionHead
            eyebrow="05 · WHAT MAKES THIS DIFFERENT"
            title="Specialised — not generic."
            lead="We're not trying to be every environmental services company. We're trying to be the right one for a specific class of project."
          />

          <div data-reveal-stagger style={{ borderTop: "1px solid var(--c-line)" }}>
            {[
              { t: "Specialised focus on U.S.–Canada waste movement", b: "It's all we do." },
              { t: "Cross-border permitting knowledge", b: "We live inside the permit workflow." },
              { t: "Access to Canadian environmental services options", b: "Treatment, disposal, recycling, repurposing." },
              { t: "Coordination across all the moving pieces", b: "Disposal, recycling, permitting, logistics — one partner." },
              { t: "Sustainability-oriented where viable", b: "Recycling and repurposing get priority when the material allows." },
            ].map((it, i) => (
              <div key={i} data-tlgrid-collapse style={{
                padding: "24px 0", borderBottom: "1px solid var(--c-line)",
                display: "grid", gridTemplateColumns: "60px 1fr auto", gap: 32, alignItems: "center",
              }}>
                <span className="tl-mono" style={{ color: "var(--c-blue)", fontSize: 12, letterSpacing: "0.08em" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 500,
                                color: "var(--c-navy)", letterSpacing: "-0.01em", marginBottom: 6 }}>
                    {it.t}
                  </div>
                  <div className="tl-body" style={{ fontSize: 14.5 }}>{it.b}</div>
                </div>
                <span className="tl-mono" style={{ color: "var(--c-accent-2)", fontSize: 11, letterSpacing: "0.1em" }}>
                  ✓ CORE
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--c-navy)" }}>
        <div className="tl-container" style={{ paddingTop: "clamp(56px, 11vw, 96px)", paddingBottom: "clamp(56px, 11vw, 96px)", textAlign: "center" }}>
          <ParallelRule light label="TALK TO US" />
          <h2 className="tl-display tl-display--xl" style={{ color: "#fff", margin: "32px auto 24px", maxWidth: "22ch" }}>
            Talk to TransLine49° about your waste movement challenge.
          </h2>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 36, flexWrap: "wrap" }}>
            <button className="tl-btn tl-btn--primary tl-btn--lg" onClick={() => onNav("contact")}>
              Start a Project <span className="tl-btn-arr">→</span>
            </button>
            <a className="tl-btn tl-btn--ghost-light tl-btn--lg" href="tel:+13149342133">
              <Icon name="phone" /> Call (314) 934-2133
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

window.AboutPage = AboutPage;
