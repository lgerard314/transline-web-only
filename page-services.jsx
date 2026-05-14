// page-services.jsx
const ServicesPage = ({ onNav, tweaks }) => {
  return (
    <div className="tl-pagewrap">
      <PageHero
        eyebrow="SERVICES · ENVIRONMENTAL"
        title={<>Environmental services for <span style={{ color: "var(--c-accent)" }}>cross-border</span> disposal, recycling &amp; logistics.</>}
        lead="TransLine49° supports companies that need to move hazardous or non-hazardous waste from the United States into Canada for treatment, disposal, recycling, or repurposing."
        photo={TL_PHOTOS.heroDrums}
        variant={tweaks.heroVariant || "photo"}
        ctas={<>
          <button className="tl-btn tl-btn--primary" onClick={() => onNav("contact")}>
            Start a Project <span className="tl-btn-arr">→</span>
          </button>
          <button className="tl-btn tl-btn--ghost-light" onClick={() => onNav("process")}>
            See the process <span className="tl-btn-arr">→</span>
          </button>
        </>}
        meta={[
          { k: "SCOPE", v: "U.S. → CANADA" },
          { k: "MATERIAL", v: "HAZARDOUS · NON-HAZ" },
          { k: "PATHS", v: "DISPOSAL · RECYCLE · REUSE" },
        ]}
      />

      {/* Detailed service blocks */}
      <section className="tl-section">
        <div className="tl-container">
          <SectionHead
            eyebrow="OUR SERVICES · S/01 — S/04"
            title="What we do, in detail."
            lead="Four interlocking capabilities. Most projects use more than one."
          />

          <div style={{ display: "flex", flexDirection: "column", borderTop: "1px solid var(--c-line)" }}>
            {[
              {
                num: "S/01",
                title: "Cross-Border Waste Movement",
                lede: "Use this when you have material in the U.S. and need to understand whether and how it can move into Canada.",
                bullets: [
                  "U.S.→Canada waste movement support",
                  "Coordination across involved parties",
                  "Project-specific guidance",
                  "Material movement planning",
                ],
                photo: TL_PHOTOS.tanker,
                icon: "border",
              },
              {
                num: "S/02",
                title: "Hazardous Waste Permitting Assistance",
                lede: "Cross-border hazardous waste requires permit-related steps before shipping. We assist with the workflow.",
                bullets: [
                  "Cross-border hazardous waste permit support",
                  "Permit process coordination",
                  "Documentation guidance",
                  "Regulatory workflow assistance",
                ],
                photo: TL_PHOTOS.warehouse,
                icon: "permit",
              },
              {
                num: "S/03",
                title: "Disposal & Recycling Access",
                lede: "We connect U.S. customers with Canadian outlets — with a preference for recycling and repurposing where the material allows.",
                bullets: [
                  "Access to Canadian disposal options",
                  "Access to recycling and repurposing pathways",
                  "Hazardous and non-hazardous waste options",
                  "Sustainability-focused alternatives where available",
                ],
                photo: TL_PHOTOS.recycling,
                icon: "recycle",
              },
              {
                num: "S/04",
                title: "Logistics Scheduling & Coordination",
                lede: "Once the path is clear, we schedule the actual movement of material across the border.",
                bullets: [
                  "Shipment scheduling",
                  "Carrier / movement coordination",
                  "Cross-border logistics planning",
                  "Communication between customer, carrier, and receiving facility",
                ],
                photo: TL_PHOTOS.highway,
                icon: "truck",
              },
            ].map((s, i) => (
              <div key={i} data-tlgrid-collapse className="tl-svcdetail__row" style={{
                display: "grid",
                gridTemplateColumns: i % 2 === 0 ? "1fr 1.1fr" : "1.1fr 1fr",
                borderBottom: "1px solid var(--c-line)",
                minHeight: 420,
              }}>
                {/* Photo column */}
                <div className="tl-svcdetail__photo" style={{
                  order: i % 2 === 0 ? 0 : 1,
                  background: `linear-gradient(180deg, rgba(11,31,42,0.15) 0%, rgba(11,31,42,0.45) 100%), url(${s.photo})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundColor: "#0E2733",
                  position: "relative",
                  minHeight: 360,
                }}>
                  <div style={{ position: "absolute", top: 24, left: 24, color: "rgba(255,255,255,0.85)" }}>
                    <span className="tl-mono" style={{ fontSize: 11, letterSpacing: "0.12em" }}>{s.num}</span>
                  </div>
                  <div style={{ position: "absolute", bottom: 24, left: 24, right: 24,
                                color: "rgba(255,255,255,0.95)",
                                fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.1em",
                                display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span>49°N · {s.title.split(" ")[0].toUpperCase()}</span>
                    <span style={{ color: "var(--c-accent)" }}>● ACTIVE CAPABILITY</span>
                  </div>
                </div>
                {/* Content column */}
                <div className="tl-svcdetail__text" style={{ padding: "56px 48px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                    <span style={{ width: 36, height: 36, borderRadius: 999, border: "1px solid var(--c-line)",
                                   display: "flex", alignItems: "center", justifyContent: "center", color: "var(--c-blue)" }}>
                      <Icon name={s.icon} />
                    </span>
                    <span className="tl-mono" style={{ color: "var(--c-blue)", fontSize: 11, letterSpacing: "0.1em" }}>
                      SERVICE {s.num}
                    </span>
                  </div>
                  <h3 className="tl-display tl-display--m" style={{ marginBottom: 16 }}>{s.title}</h3>
                  <p className="tl-lead" style={{ marginBottom: 24 }}>{s.lede}</p>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, borderTop: "1px solid var(--c-line)" }}>
                    {s.bullets.map((b, j) => (
                      <li key={j} style={{ padding: "12px 0", borderBottom: "1px solid var(--c-line)",
                                            display: "flex", alignItems: "center", gap: 12,
                                            color: "var(--c-ink)", fontSize: 14.5 }}>
                        <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--c-accent)", flexShrink: 0 }} />
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries we may support */}
      <section className="tl-section" style={{ background: "var(--c-surface)", borderBlock: "1px solid var(--c-line)" }}>
        <div className="tl-container">
          <SectionHead
            eyebrow="POTENTIAL CUSTOMERS"
            title="Built for companies with regulated or complex waste streams."
            lead="If your waste is hard to place, time-sensitive, or has crossed your domestic options — there's a good chance we can help."
          />

          <div data-tlgrid-collapse className="tl-industries-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0,
                        borderTop: "1px solid var(--c-line)", borderLeft: "1px solid var(--c-line)" }}>
            {[
              "Industrial facilities",
              "Manufacturers",
              "Environmental service providers",
              "Waste brokers",
              "Remediation contractors",
              "Generators with difficult-to-place waste",
            ].map((it, i) => (
              <div key={i} style={{
                padding: "32px 28px",
                borderRight: "1px solid var(--c-line)",
                borderBottom: "1px solid var(--c-line)",
                background: "var(--c-surface)",
                minHeight: 140,
                display: "flex", flexDirection: "column", justifyContent: "space-between",
              }}>
                <span className="tl-mono" style={{ color: "var(--c-ink-3)", fontSize: 11, letterSpacing: "0.1em" }}>
                  {String(i + 1).padStart(2, "0")} / 06
                </span>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 500,
                              letterSpacing: "-0.01em", color: "var(--c-navy)", lineHeight: 1.15 }}>
                  {it}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What we need to evaluate a project */}
      <section className="tl-section">
        <div className="tl-container" data-tlgrid-collapse style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 64, alignItems: "start" }}>
          <div data-tlsticky style={{ position: "sticky", top: 96 }}>
            <ParallelRule label="INTAKE CHECKLIST" />
            <h2 className="tl-display tl-display--l" style={{ marginTop: 24 }}>
              What we need to evaluate a project.
            </h2>
            <p className="tl-lead" style={{ marginTop: 16 }}>
              The more you can share up front, the faster we can determine whether a Canadian
              path exists for your material.
            </p>
            <div style={{ marginTop: 32 }}>
              <button className="tl-btn tl-btn--dark" onClick={() => onNav("contact")}>
                Begin intake form <span className="tl-btn-arr">→</span>
              </button>
            </div>
          </div>

          <div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0,
                          borderTop: "1px solid var(--c-line)" }}>
              {[
                { k: "01", t: "Waste description", b: "What the material is, in plain language." },
                { k: "02", t: "Hazardous classification (if known)", b: "Hazardous, non-hazardous, or unknown." },
                { k: "03", t: "Volume / quantity", b: "Tons, drums, totes, gallons — whatever you have." },
                { k: "04", t: "Current location", b: "Where the material sits today." },
                { k: "05", t: "Desired timeline", b: "When the material needs to be moved." },
                { k: "06", t: "Existing analytical data", b: "Waste profile or SDS if available." },
                { k: "07", t: "Current disposal challenge", b: "What's not working with existing options." },
                { k: "08", t: "Prior permits or shipping docs", b: "If this material has shipped before, what did it use." },
              ].map((it, i) => (
                <li key={i} style={{ padding: "20px 0", borderBottom: "1px solid var(--c-line)",
                                      display: "grid", gridTemplateColumns: "60px 1fr", gap: 16, alignItems: "baseline" }}>
                  <span className="tl-mono" style={{ color: "var(--c-blue)", fontSize: 12, letterSpacing: "0.08em" }}>
                    {it.k}
                  </span>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 19, fontWeight: 500,
                                  letterSpacing: "-0.01em", color: "var(--c-navy)", marginBottom: 4 }}>
                      {it.t}
                    </div>
                    <div className="tl-body" style={{ fontSize: 14.5 }}>{it.b}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--c-navy)" }}>
        <div className="tl-container" data-tlgrid-collapse style={{ paddingBlock: "96px", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 64, alignItems: "center" }}>
          <div>
            <ParallelRule light label="GET A PATH" />
            <h2 className="tl-display tl-display--l" style={{ color: "#fff", marginTop: 24, maxWidth: "20ch" }}>
              Need to know whether your material has a viable Canadian path?
            </h2>
            <p className="tl-lead" style={{ color: "rgba(230,238,242,0.78)", marginTop: 20, maxWidth: "50ch" }}>
              Submit the basics and we'll review options. No commitment.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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

window.ServicesPage = ServicesPage;
