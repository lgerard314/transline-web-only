// page-process.jsx
const ProcessPage = ({ onNav, tweaks }) => {
  return (
    <div className="tl-pagewrap">
      <PageHero
        eyebrow="CROSS-BORDER PROCESS"
        title={<>A clearer path through cross-border <span style={{ color: "var(--c-accent)" }}>requirements.</span></>}
        lead="TransLine49° helps customers understand the steps involved in moving waste from the United States into Canada — and coordinates the permitting and logistics process so the project lands on the right side of the border."
        photo={TL_PHOTOS.containers}
        variant={tweaks.heroVariant || "photo"}
        ctas={<>
          <button className="tl-btn tl-btn--primary" onClick={() => onNav("contact")}>
            Start a Project <span className="tl-btn-arr">→</span>
          </button>
          <button className="tl-btn tl-btn--ghost-light" onClick={() => {
            document.getElementById("tl-process-faq")?.scrollIntoView({ behavior: "smooth", block: "start" });
          }}>
            Jump to FAQ <span className="tl-btn-arr">↓</span>
          </button>
        </>}
        meta={[
          { k: "STEPS", v: "6" },
          { k: "TYPICAL TIMELINE", v: "PROJECT-DEPENDENT" },
          { k: "DELIVERABLE", v: "MATERIAL PLACED" },
        ]}
      />

      {/* Process timeline — advanced flow */}
      <section className="tl-section">
        <div className="tl-container">
          <ProcessFlowAdvanced />
        </div>
      </section>

      {/* Why complicated */}
      <section className="tl-section" style={{ background: "var(--c-surface)", borderBlock: "1px solid var(--c-line)" }}>
        <div className="tl-container">
          <SectionHead
            eyebrow="WHY IT'S COMPLICATED"
            title="Cross-border waste isn't a single rule. It's four overlapping ones."
            lead="None of these are deal-breakers. They're the reason a partner who lives in this work is useful."
          />

          <div data-tlgrid-collapse style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0,
                        borderTop: "1px solid var(--c-line)", borderBottom: "1px solid var(--c-line)" }}>
            {[
              { k: "01", t: "Permit requirements", b: "Applicable hazardous waste or recyclable material may require permit-related steps before any movement." },
              { k: "02", t: "Movement documentation", b: "Shipments carry specific documents identifying the material, parties, route, and destination." },
              { k: "03", t: "Authorized carriers / facilities", b: "Cross-border waste moves on approved carriers to authorized receiving facilities." },
              { k: "04", t: "Confirmation & retention", b: "Records of disposal or recycling completion may need to be retained for a period of time." },
            ].map((c, i) => (
              <div key={i} style={{
                padding: "36px 28px 32px",
                borderLeft: i === 0 ? 0 : "1px solid var(--c-line)",
                minHeight: 240,
              }}>
                <div className="tl-mono" style={{ color: "var(--c-blue)", fontSize: 12, letterSpacing: "0.08em" }}>
                  {c.k} / 04
                </div>
                <h3 className="tl-display tl-display--s" style={{ marginTop: 16, marginBottom: 12 }}>{c.t}</h3>
                <p className="tl-body" style={{ fontSize: 14, lineHeight: 1.55 }}>{c.b}</p>
              </div>
            ))}
          </div>

          <p className="tl-small" style={{ marginTop: 16, fontStyle: "italic" }}>
            Educational overview only. Not legal advice.
          </p>
        </div>
      </section>

      {/* Where we help */}
      <section className="tl-section">
        <div className="tl-container">
          <SectionHead
            eyebrow="WHERE TRANSLINE49° HELPS"
            title="What you bring vs. what we coordinate."
          />

          <div data-tlgrid-collapse className="tl-process-help-row" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0,
                        borderTop: "1px solid var(--c-line)", borderBottom: "1px solid var(--c-line)" }}>
            <div style={{ padding: "40px 0 40px", paddingRight: 32, borderRight: "1px solid var(--c-line)" }}>
              <div className="tl-tag" style={{ marginBottom: 24 }}>YOUR CHALLENGE</div>
              <h3 className="tl-display tl-display--m" style={{ marginBottom: 24 }}>You bring the project.</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {[
                  "You need a disposal or recycling option for the material",
                  "You're not sure if Canada is viable",
                  "Permitting is confusing",
                  "Logistics need to be coordinated",
                  "Timeline matters",
                ].map((it, i) => (
                  <li key={i} style={{ padding: "14px 0", borderTop: "1px solid var(--c-line-2)",
                                        display: "flex", gap: 16, alignItems: "baseline" }}>
                    <span className="tl-mono" style={{ color: "var(--c-ink-3)", fontSize: 11, width: 28 }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span style={{ color: "var(--c-ink)", fontSize: 15.5 }}>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div style={{ padding: "40px 0 40px", paddingLeft: 32 }}>
              <div className="tl-tag tl-tag--amber" style={{ marginBottom: 24 }}>HOW WE HELP</div>
              <h3 className="tl-display tl-display--m" style={{ marginBottom: 24 }}>We move it across.</h3>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {[
                  "Reviews project details and constraints",
                  "Identifies potential Canadian options",
                  "Assists with the permitting workflow",
                  "Coordinates movement logistics end-to-end",
                  "Guides the project through completion",
                ].map((it, i) => (
                  <li key={i} style={{ padding: "14px 0", borderTop: "1px solid var(--c-line-2)",
                                        display: "flex", gap: 16, alignItems: "baseline" }}>
                    <span className="tl-mono" style={{ color: "var(--c-accent-2)", fontSize: 11, width: 28 }}>
                      ✓
                    </span>
                    <span style={{ color: "var(--c-ink)", fontSize: 15.5 }}>{it}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="tl-section" id="tl-process-faq" style={{ background: "var(--c-surface)", borderTop: "1px solid var(--c-line)" }}>
        <div className="tl-container" data-tlgrid-collapse style={{ display: "grid", gridTemplateColumns: "0.7fr 1fr", gap: 64, alignItems: "start" }}>
          <div data-tlsticky style={{ position: "sticky", top: 96 }}>
            <ParallelRule label="FAQ" />
            <h2 className="tl-display tl-display--l" style={{ marginTop: 24 }}>
              Frequently asked.
            </h2>
            <p className="tl-lead" style={{ marginTop: 16, fontSize: 16 }}>
              The questions customers usually ask before getting started.
            </p>
          </div>
          <div>
            <FAQ items={[
              { q: "Who is TransLine49° Environmental Services?",
                a: "TransLine49° is a U.S.-based environmental services company headquartered in St. Louis, Missouri and affiliated with Miller Environmental Corporation. We focus on helping customers move waste from the United States into Canada." },
              { q: "What does TransLine49° help with?",
                a: "Cross-border waste movement, hazardous waste permitting, logistics coordination, and access to Canadian disposal, treatment, recycling, and repurposing options." },
              { q: "How do I start a project?",
                a: "Use the Start a Project form on the contact page, or call (314) 934-2133. Most reviews begin with a brief call to understand the material and the constraints." },
              { q: "What information do you need?",
                a: "At minimum: a description of the material, its location, an estimate of volume, and your timeline. Existing analytical data or waste profile, if you have it, helps us evaluate options faster." },
              { q: "Do you handle hazardous waste permitting?",
                a: "Yes. TransLine49° assists with cross-border hazardous waste permitting — including coordinating the workflow and helping with documentation." },
              { q: "Do you coordinate logistics?",
                a: "Yes. We schedule and coordinate the logistical movement of material, working with the customer, carriers, and receiving facility." },
            ]} />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--c-navy)" }}>
        <div className="tl-container" data-tlgrid-collapse style={{ paddingTop: "96px", paddingBottom: "96px", display: "grid",
                                                gridTemplateColumns: "1fr auto", gap: 48, alignItems: "center" }}>
          <div>
            <ParallelRule light label="READY?" />
            <h2 className="tl-display tl-display--l" style={{ color: "#fff", marginTop: 24, maxWidth: "22ch" }}>
              Have a project that may require cross-border permitting?
            </h2>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <button className="tl-btn tl-btn--primary tl-btn--lg" onClick={() => onNav("contact")}>
              Contact TransLine49° <span className="tl-btn-arr">→</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

window.ProcessPage = ProcessPage;
