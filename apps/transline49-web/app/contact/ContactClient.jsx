"use client";
// Project intake wizard + supporting page chrome. The whole page is client
// because the submitted-state swap replaces the hero, and the wizard owns
// step + form state. On submit we don't hit a server yet — we just flip
// `submitted` and show a confirmation block. Real submission is a future
// task (Resend / Postmark / your CRM).
import Link from "next/link";
import { useState, Fragment } from "react";
import { TL_PHOTOS } from "@/lib/photos";
import {
  PageHero,
  SectionHead,
  ParallelRule,
  FAQ,
  Icon,
  FormField,
} from "@white-owl/brand/components";

const WIZARD_STEPS = [
  { id: 0, key: "you",       num: "01", label: "About you" },
  { id: 1, key: "material",  num: "02", label: "Material" },
  { id: 2, key: "logistics", num: "03", label: "Logistics" },
  { id: 3, key: "scope",     num: "04", label: "What you need" },
  { id: 4, key: "review",    num: "05", label: "Review & send" },
];

const INITIAL_FORM = {
  name: "", company: "", email: "", phone: "", companyLocation: "",
  description: "", classification: "", volume: "", volumeUnit: "tons",
  materialLocation: "", timeline: "", hasData: false,
  scopeNeeded: [], message: "",
};

export function ContactClient() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  // submission holds { ref, receivedAt } once submitted; null while editing.
  // Captured at submit time so render stays pure (no Date.now() in render).
  const [submission, setSubmission] = useState(null);
  const submitted = submission !== null;

  const update = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) {
      setErrors((e) => {
        const n = { ...e };
        delete n[k];
        return n;
      });
    }
  };

  const toggleScope = (s) => {
    setForm((f) => ({
      ...f,
      scopeNeeded: f.scopeNeeded.includes(s)
        ? f.scopeNeeded.filter((x) => x !== s)
        : [...f.scopeNeeded, s],
    }));
  };

  const validateStep = (s) => {
    const e = {};
    if (s === 0) {
      if (!form.name.trim()) e.name = "Required";
      if (!form.email.trim()) e.email = "Required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Looks invalid";
      if (!form.company.trim()) e.company = "Required";
    }
    if (s === 1) {
      if (!form.description.trim()) e.description = "Required";
      if (!form.classification) e.classification = "Pick one";
    }
    if (s === 2) {
      if (!form.materialLocation.trim()) e.materialLocation = "Required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => {
    if (validateStep(step)) {
      setStep((s) => Math.min(WIZARD_STEPS.length - 1, s + 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const goBack = () => {
    setStep((s) => Math.max(0, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const submit = () => {
    const now = new Date();
    setSubmission({
      ref: `TL49-${now.getTime().toString(36).toUpperCase().slice(-6)}`,
      receivedAt: now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }).toUpperCase(),
    });
  };

  if (submitted) {
    return (
      <div className="tl-pagewrap">
        <PageHero
          eyebrow="PROJECT INTAKE · RECEIVED"
          title={
            <>
              Thanks. We&apos;ve got your project<span style={{ color: "var(--c-accent)" }}>.</span>
            </>
          }
          lead="A team member will review the inquiry and follow up. For urgent matters call (314) 934-2133."
          photo={TL_PHOTOS.highway}
          variant="photo"
          ctas={
            <>
              <Link href="/" className="tl-btn tl-btn--primary">
                Back to home <span className="tl-btn-arr">→</span>
              </Link>
              <button
                className="tl-btn tl-btn--ghost-light"
                onClick={() => {
                  setSubmission(null);
                  setStep(0);
                  setForm(INITIAL_FORM);
                }}
              >
                Submit another <span className="tl-btn-arr">↺</span>
              </button>
            </>
          }
          meta={[
            { k: "REF", v: submission.ref },
            { k: "RECEIVED", v: submission.receivedAt },
            { k: "NEXT STEP", v: "A TEAM MEMBER WILL REVIEW" },
          ]}
        />

        <section className="tl-section">
          <div className="tl-container" style={{ maxWidth: 880 }}>
            <SectionHead eyebrow="WHAT HAPPENS NEXT" title="Here's the flow from here." />
            <div className="tl-steps" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
              {[
                { n: "STEP 01", t: "We review your project details", b: "Material, classification, location, timeline." },
                { n: "STEP 02", t: "We determine what else we need", b: "Analytical data, permits, prior shipping docs." },
                { n: "STEP 03", t: "We discuss potential pathways", b: "Permitting, logistics, disposal, or recycling — whatever fits." },
              ].map((s, i) => (
                <div className="tl-step" key={i}>
                  <div className="tl-step__num">{s.n}</div>
                  <h3 className="tl-step__title">{s.t}</h3>
                  <p className="tl-step__body">{s.b}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="tl-pagewrap">
      <PageHero
        eyebrow="CONTACT · PROJECT INTAKE"
        title={
          <>
            Start a cross-border waste <span style={{ color: "var(--c-accent)" }}>project.</span>
          </>
        }
        lead="Have an inquiry or need help with a project? Send the details below or call TransLine49° at (314) 934-2133."
        photo={TL_PHOTOS.tanker}
        variant="photo"
        meta={[
          { k: "PHONE", v: "(314) 934-2133" },
          { k: "OFFICE", v: "CLAYTON, MO" },
          { k: "RESPONSE", v: "A TEAM MEMBER WILL REVIEW" },
        ]}
      />

      {/* Contact cards */}
      <section className="tl-section">
        <div className="tl-container">
          <div data-tlgrid-collapse="" data-reveal-stagger="" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 0, border: "1px solid var(--c-line)", borderRadius: 14, overflow: "hidden", background: "var(--c-surface)" }}>
            {[
              { tag: "PHONE", t: "(314) 934-2133", b: "Reach the office direct.", cta: "Call now", href: "tel:+13149342133", icon: "phone" },
              { tag: "OFFICE", t: "231 S. Bemiston Ave, Suite 800", b: "Clayton, Missouri 63105", cta: "Open map", href: "https://www.google.com/maps/search/?api=1&query=231+S+Bemiston+Ave+Suite+800+Clayton+MO+63105", icon: "north", external: true },
              { tag: "PROJECT INTAKE", t: "Submit material details", b: "A team member will review the inquiry.", cta: "Begin form ↓", href: "#tl-intake", icon: "doc" },
            ].map((c, i) => (
              <div key={i} style={{ padding: "32px 28px", borderLeft: i === 0 ? 0 : "1px solid var(--c-line)", display: "flex", flexDirection: "column", gap: 20, minHeight: 260, background: i === 2 ? "var(--c-navy)" : "var(--c-surface)", color: i === 2 ? "var(--c-on-navy)" : "var(--c-ink)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ width: 36, height: 36, borderRadius: 999, border: `1px solid ${i === 2 ? "rgba(255,255,255,0.16)" : "var(--c-line)"}`, display: "flex", alignItems: "center", justifyContent: "center", color: i === 2 ? "#fff" : "var(--c-blue)" }}>
                    <Icon name={c.icon} />
                  </span>
                  <span className="tl-mono" style={{ fontSize: 11, letterSpacing: "0.12em", color: i === 2 ? "var(--c-accent)" : "var(--c-blue)" }}>{c.tag}</span>
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 26, fontWeight: 500, letterSpacing: "-0.015em", margin: 0, lineHeight: 1.15, color: i === 2 ? "#fff" : "var(--c-navy)" }}>{c.t}</h3>
                <p style={{ flex: 1, color: i === 2 ? "rgba(230,238,242,0.78)" : "var(--c-ink-2)", fontSize: 15, lineHeight: 1.55, margin: 0 }}>{c.b}</p>
                <a
                  href={c.href}
                  className="tl-mono"
                  target={c.external ? "_blank" : undefined}
                  rel={c.external ? "noreferrer noopener" : undefined}
                  style={{ fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", color: i === 2 ? "var(--c-accent)" : "var(--c-blue)", display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}
                >
                  {c.cta} <span style={{ fontFamily: "var(--font-mono)" }} aria-hidden="true">→</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Intake wizard */}
      <section className="tl-section" id="tl-intake" style={{ paddingTop: 0, scrollMarginTop: 96 }}>
        <div className="tl-container" data-tlgrid-collapse="" style={{ display: "grid", gridTemplateColumns: "0.7fr 1.3fr", gap: 56, alignItems: "start" }}>
          <div data-tlsticky="" style={{ position: "sticky", top: 96 }}>
            <ParallelRule label="INTAKE · 5 STEPS" />
            <h2 className="tl-display tl-display--l" style={{ marginTop: 24 }}>Project intake form.</h2>
            <p className="tl-lead" style={{ marginTop: 16, fontSize: 16 }}>
              Five short steps. The more you can share up front, the faster we can determine
              whether a Canadian pathway exists for your material.
            </p>

            <div style={{ marginTop: 32, padding: 20, background: "var(--c-surface)", border: "1px solid var(--c-line)", borderRadius: 10 }}>
              <div className="tl-mono" style={{ fontSize: 11, color: "var(--c-ink-3)", letterSpacing: "0.1em", marginBottom: 12 }}>PREFER TO TALK?</div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--c-navy)", marginBottom: 4, fontWeight: 500 }}>(314) 934-2133</div>
              <div className="tl-small">Mon–Fri · Office hours</div>
            </div>
          </div>

          <div className="tl-form-shell">
            <div className="tl-form-progress">
              {WIZARD_STEPS.map((s, i) => (
                <div
                  key={s.key}
                  className="tl-form-progress__step"
                  data-active={i === step ? "1" : "0"}
                  data-done={i < step ? "1" : "0"}
                  onClick={() => { if (i < step) setStep(i); }}
                >
                  <div className="num">{s.num}</div>
                  <div className="lbl">{s.label}</div>
                </div>
              ))}
            </div>

            <div className="tl-form-body">
              {step === 0 && (
                <div>
                  <h3 className="tl-display tl-display--s" style={{ marginBottom: 24 }}>Who are we talking to?</h3>
                  <div className="tl-field-row">
                    <FormField label="Name" required value={form.name} err={errors.name} onChange={(v) => update("name", v)} placeholder="Jane Operator" />
                    <FormField label="Company" required value={form.company} err={errors.company} onChange={(v) => update("company", v)} placeholder="Acme Materials" />
                  </div>
                  <div className="tl-field-row">
                    <FormField label="Email" required type="email" value={form.email} err={errors.email} onChange={(v) => update("email", v)} placeholder="jane@acme.com" />
                    <FormField label="Phone" value={form.phone} type="tel" onChange={(v) => update("phone", v)} placeholder="(555) 123-4567" />
                  </div>
                  <FormField label="Company location" value={form.companyLocation} onChange={(v) => update("companyLocation", v)} placeholder="City, State" />
                </div>
              )}

              {step === 1 && (
                <div>
                  <h3 className="tl-display tl-display--s" style={{ marginBottom: 24 }}>What&apos;s the material?</h3>
                  <FormField label="Waste description" required textarea value={form.description} err={errors.description} onChange={(v) => update("description", v)} placeholder="Describe the material in plain language — what it is, what process it came from, anything notable about it." />

                  <div className="tl-field">
                    <label>Classification <span className="req">*</span></label>
                    <div className="tl-pillset">
                      {["Hazardous", "Non-hazardous", "Unknown / TBD"].map((c) => (
                        <button type="button" key={c} className="tl-pill" data-on={form.classification === c ? "1" : "0"} onClick={() => update("classification", c)}>
                          {c}
                        </button>
                      ))}
                    </div>
                    {errors.classification && <div className="err">{errors.classification}</div>}
                  </div>

                  <div className="tl-field-row" style={{ gridTemplateColumns: "2fr 1fr" }}>
                    <FormField label="Estimated volume" value={form.volume} onChange={(v) => update("volume", v)} placeholder="e.g. 150" />
                    <div className="tl-field">
                      <label>Unit</label>
                      <select value={form.volumeUnit} onChange={(e) => update("volumeUnit", e.target.value)}>
                        <option value="tons">tons</option>
                        <option value="drums">drums (55-gal)</option>
                        <option value="totes">totes (275-gal)</option>
                        <option value="gallons">gallons</option>
                        <option value="cubic-yards">cubic yards</option>
                        <option value="other">other / unsure</option>
                      </select>
                    </div>
                  </div>

                  <div className="tl-field">
                    <label>Have analytical data or a waste profile?</label>
                    <div className="tl-pillset">
                      <button type="button" className="tl-pill" data-on={form.hasData ? "1" : "0"} onClick={() => update("hasData", true)}>Yes — I can share</button>
                      <button type="button" className="tl-pill" data-on={!form.hasData ? "1" : "0"} onClick={() => update("hasData", false)}>Not yet</button>
                    </div>
                  </div>

                  {form.hasData && (
                    <div className="tl-field">
                      <label>Upload waste profile / analytical data</label>
                      <div className="tl-upload" onClick={(e) => e.preventDefault()}>
                        <strong>Drop files here or click to browse</strong>
                        PDF, XLSX, CSV, images — up to 25 MB
                      </div>
                    </div>
                  )}
                </div>
              )}

              {step === 2 && (
                <div>
                  <h3 className="tl-display tl-display--s" style={{ marginBottom: 24 }}>Where is it and when does it need to move?</h3>
                  <FormField label="Material location" required value={form.materialLocation} err={errors.materialLocation} onChange={(v) => update("materialLocation", v)} placeholder="Address or facility, City, State" />

                  <div className="tl-field">
                    <label>Desired timeline</label>
                    <div className="tl-pillset">
                      {["ASAP / Urgent", "Within 30 days", "30 – 90 days", "90+ days", "Planning / Exploratory"].map((t) => (
                        <button type="button" key={t} className="tl-pill" data-on={form.timeline === t ? "1" : "0"} onClick={() => update("timeline", t)}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div>
                  <h3 className="tl-display tl-display--s" style={{ marginBottom: 24 }}>What are you looking for help with?</h3>
                  <div className="tl-field">
                    <label>Select all that apply</label>
                    <div className="tl-pillset">
                      {["Disposal pathway", "Recycling pathway", "Treatment options", "Hazardous waste permitting", "Logistics coordination", "Project assessment / scoping"].map((s) => (
                        <button type="button" key={s} className="tl-pill" data-on={form.scopeNeeded.includes(s) ? "1" : "0"} onClick={() => toggleScope(s)}>
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                  <FormField label="Anything else we should know?" textarea value={form.message} onChange={(v) => update("message", v)} placeholder="Current disposal challenge, prior shipping history, special handling, deadlines, etc." />
                </div>
              )}

              {step === 4 && (
                <div>
                  <h3 className="tl-display tl-display--s" style={{ marginBottom: 8 }}>Review &amp; send.</h3>
                  <p className="tl-body" style={{ marginBottom: 24 }}>
                    Confirm the details below. You can step back to edit anything.
                  </p>
                  <ReviewBlock label="01 · About you" items={[
                    ["Name", form.name],
                    ["Company", form.company],
                    ["Email", form.email],
                    ["Phone", form.phone || "—"],
                    ["Company location", form.companyLocation || "—"],
                  ]} onEdit={() => setStep(0)} />
                  <ReviewBlock label="02 · Material" items={[
                    ["Description", form.description || "—"],
                    ["Classification", form.classification || "—"],
                    ["Volume", form.volume ? `${form.volume} ${form.volumeUnit}` : "—"],
                    ["Analytical data", form.hasData ? "Will share" : "Not yet"],
                  ]} onEdit={() => setStep(1)} />
                  <ReviewBlock label="03 · Logistics" items={[
                    ["Material location", form.materialLocation || "—"],
                    ["Timeline", form.timeline || "—"],
                  ]} onEdit={() => setStep(2)} />
                  <ReviewBlock label="04 · What you need" items={[
                    ["Scope", form.scopeNeeded.length ? form.scopeNeeded.join(", ") : "—"],
                    ["Notes", form.message || "—"],
                  ]} onEdit={() => setStep(3)} />
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--c-line)" }}>
                <div className="tl-mono" style={{ color: "var(--c-ink-3)", fontSize: 11, letterSpacing: "0.08em" }}>
                  STEP {step + 1} OF {WIZARD_STEPS.length}
                </div>
                <div style={{ display: "flex", gap: 12 }}>
                  {step > 0 && (
                    <button className="tl-btn tl-btn--ghost" onClick={goBack}>← Back</button>
                  )}
                  {step < WIZARD_STEPS.length - 1 ? (
                    <button className="tl-btn tl-btn--dark" onClick={goNext}>
                      Continue <span className="tl-btn-arr">→</span>
                    </button>
                  ) : (
                    <button className="tl-btn tl-btn--primary" onClick={submit}>
                      Send project intake <span className="tl-btn-arr">→</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="tl-section" style={{ background: "var(--c-surface)", borderTop: "1px solid var(--c-line)" }}>
        <div className="tl-container" data-tlgrid-collapse="" style={{ display: "grid", gridTemplateColumns: "0.7fr 1fr", gap: 64, alignItems: "start" }}>
          <div>
            <ParallelRule label="MINI FAQ" />
            <h2 className="tl-display tl-display--l" style={{ marginTop: 24 }}>Quick answers.</h2>
          </div>
          <div>
            <FAQ
              items={[
                { q: "Do you help with hazardous waste permitting?", a: "Yes. TransLine49° assists with cross-border hazardous waste permitting." },
                { q: "Do you coordinate logistics?", a: "Yes. TransLine49° assists with scheduling the logistical movement of material." },
                { q: "Do you handle non-hazardous waste too?", a: "Public company language references both hazardous and non-hazardous waste disposal needs." },
              ]}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function ReviewBlock({ label, items, onEdit }) {
  return (
    <div style={{ border: "1px solid var(--c-line)", borderRadius: 10, padding: "20px 22px", marginBottom: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <span className="tl-mono" style={{ fontSize: 11, letterSpacing: "0.1em", color: "var(--c-blue)" }}>{label}</span>
        <button onClick={onEdit} style={{ background: "transparent", border: 0, cursor: "pointer", fontFamily: "var(--font-mono)", fontSize: 11, letterSpacing: "0.08em", color: "var(--c-ink-3)", textTransform: "uppercase" }}>
          EDIT
        </button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "160px 1fr", gap: "8px 16px" }}>
        {items.map(([k, v], i) => (
          <Fragment key={i}>
            <span className="tl-mono" style={{ fontSize: 12, color: "var(--c-ink-3)", letterSpacing: "0.04em" }}>{k}</span>
            <span style={{ fontSize: 14.5, color: "var(--c-ink)" }}>{v}</span>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
