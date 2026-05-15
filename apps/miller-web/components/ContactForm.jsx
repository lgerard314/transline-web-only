"use client";
// Miller contact form — single-step, client-side validated, swaps to a
// confirmation block on success. Mirrors the TL49 pattern (see ContactClient
// in the sibling app) and uses the shared <FormField> primitive from
// @white-owl/brand/components for label/required/error/aria wiring.
//
// On submit with errors, focuses the first invalid input. On successful
// submit, replaces the form with a confirmation block — no network call yet
// (phase 05 wires the real endpoint). The fields exactly match scrape
// file 25: First Name *, Last Name *, Email *, Phone *, Company, Title,
// Comment/Question *.

import { useRef, useState } from "react";
import { FormField } from "@white-owl/brand/components";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ContactForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef(null);

  function validate() {
    const e = {};
    if (!firstName.trim()) e.firstName = "First name is required.";
    if (!lastName.trim()) e.lastName = "Last name is required.";
    if (!email.trim()) e.email = "Email is required.";
    else if (!EMAIL_RE.test(email.trim())) e.email = "Enter a valid email address.";
    if (!phone.trim()) e.phone = "Phone is required.";
    if (!comment.trim()) e.comment = "Please include a comment or question.";
    return e;
  }

  function onSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) {
      // Focus the first invalid input.
      const order = ["firstName", "lastName", "email", "phone", "comment"];
      const firstBad = order.find((k) => e[k]);
      if (firstBad && formRef.current) {
        const el = formRef.current.querySelector(`[data-fld="${firstBad}"] input, [data-fld="${firstBad}"] textarea`);
        if (el) el.focus();
      }
      return;
    }
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="mw-loc-card" role="status" aria-live="polite">
        <h2 className="mw-loc-card__title">Thank you</h2>
        <p style={{ marginTop: 8 }}>
          Your message has been received. A Miller team member will be in touch
          shortly. For urgent spill response, call{" "}
          <a className="tl-mono" href="tel:+12049576327">
            (204) 957-6327
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      ref={formRef}
      className="mw-contact-form"
      onSubmit={onSubmit}
      noValidate
      aria-label="Contact Miller Environmental"
      style={{ display: "grid", gap: 16, maxWidth: 720 }}
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div data-fld="firstName">
          <FormField
            label="First name"
            required
            value={firstName}
            onChange={setFirstName}
            err={errors.firstName}
          />
        </div>
        <div data-fld="lastName">
          <FormField
            label="Last name"
            required
            value={lastName}
            onChange={setLastName}
            err={errors.lastName}
          />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div data-fld="email">
          <FormField
            label="Email"
            required
            type="email"
            value={email}
            onChange={setEmail}
            err={errors.email}
          />
        </div>
        <div data-fld="phone">
          <FormField
            label="Phone"
            required
            type="tel"
            value={phone}
            onChange={setPhone}
            err={errors.phone}
          />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div data-fld="company">
          <FormField label="Company" value={company} onChange={setCompany} />
        </div>
        <div data-fld="title">
          <FormField label="Title" value={title} onChange={setTitle} />
        </div>
      </div>
      <div data-fld="comment">
        <FormField
          label="Comment / question"
          required
          textarea
          value={comment}
          onChange={setComment}
          err={errors.comment}
        />
      </div>
      <div>
        <button type="submit" className="tl-btn tl-btn--primary">
          Send message <span className="tl-btn-arr">→</span>
        </button>
      </div>
    </form>
  );
}
