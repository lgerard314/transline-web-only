"use client";
// Purpose-built "schedule a pickup" form for the Customer Waste Collection
// page — distinct from the generic ContactForm. Client-side validated; on
// success it swaps to a confirmation block. No network call yet — a later
// phase wires the real endpoint.

import { useId, useRef, useState } from "react";
import { EMERGENCY_PHONE } from "@/lib/content/brand";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMERGENCY_TEL = `tel:${EMERGENCY_PHONE.replace(/[^0-9+]/g, "")}`;

function Label({ htmlFor, children, required }) {
  return (
    <label htmlFor={htmlFor}>
      {children}
      {required && <span className="req" aria-hidden="true"> *</span>}
      {required && <span className="tl-sr-only"> (required)</span>}
    </label>
  );
}

function TextField({ fld, label, required, value, onChange, error, type = "text", placeholder, autoComplete }) {
  const id = useId();
  const errId = `${id}-err`;
  return (
    <div className="tl-field" data-fld={fld}>
      <Label htmlFor={id} required={required}>{label}</Label>
      <input
        id={id}
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        data-error={error ? "1" : "0"}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={error ? errId : undefined}
        onChange={(e) => onChange(e.target.value)}
      />
      {error && <div id={errId} className="err" role="alert">{error}</div>}
    </div>
  );
}

export function ScheduleForm() {
  const [v, setV] = useState({ name: "", company: "", email: "", phone: "", site: "", notes: "" });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const formRef = useRef(null);
  const set = (k) => (val) => setV((prev) => ({ ...prev, [k]: val }));

  function validate() {
    const e = {};
    if (!v.name.trim()) e.name = "Contact name is required.";
    if (!v.company.trim()) e.company = "Company is required.";
    if (!v.email.trim()) e.email = "Email is required.";
    else if (!EMAIL_RE.test(v.email.trim())) e.email = "Enter a valid email address.";
    if (!v.phone.trim()) e.phone = "Phone is required.";
    return e;
  }

  function onSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      const order = ["name", "company", "email", "phone"];
      const firstBad = order.find((k) => e[k]);
      const el = firstBad && formRef.current?.querySelector(`[data-fld="${firstBad}"] input`);
      if (el) el.focus();
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <div className="mw-sched-done" role="status" aria-live="polite">
        <span className="mw-sched-done__mark" aria-hidden="true" />
        <h3 className="mw-sched-done__title">Request received</h3>
        <p className="mw-sched-done__text">
          Thanks — a Miller coordinator will confirm your pickup schedule within one
          business day. For an active spill or release, call the 24/7 line at{" "}
          <a className="mw-sched-done__tel" href={EMERGENCY_TEL}>{EMERGENCY_PHONE}</a>.
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      className="mw-sched-form"
      onSubmit={onSubmit}
      noValidate
      aria-label="Request a waste-collection pickup schedule"
    >
      <div className="tl-field-row">
        <TextField fld="name" label="Contact name" required value={v.name} onChange={set("name")} error={errors.name} autoComplete="name" />
        <TextField fld="company" label="Company" required value={v.company} onChange={set("company")} error={errors.company} autoComplete="organization" />
      </div>
      <div className="tl-field-row">
        <TextField fld="email" label="Email" required type="email" value={v.email} onChange={set("email")} error={errors.email} autoComplete="email" />
        <TextField fld="phone" label="Phone" required type="tel" value={v.phone} onChange={set("phone")} error={errors.phone} autoComplete="tel" />
      </div>
      <TextField fld="site" label="Site location" value={v.site} onChange={set("site")} placeholder="City or postal code" autoComplete="postal-code" />
      <div className="tl-field" data-fld="notes">
        <Label htmlFor="mw-sched-notes">Details / notes</Label>
        <textarea
          id="mw-sched-notes"
          value={v.notes}
          placeholder="Containers, waste streams, volumes, frequency, access constraints…"
          onChange={(e) => set("notes")(e.target.value)}
        />
      </div>
      <button type="submit" className="mw-cta mw-cta--solid mw-sched-form__submit">
        Request pickup schedule <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
