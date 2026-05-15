"use client";
// Remediation callback form — 5 required fields per scrape file 04.
// On submit-with-errors, programmatically focus the first invalid input
// (design spec §6 a11y rule). Behaviour matches TL49's ContactClient:
// client-side validation, no backend submit, confirmation message on
// success.

import { useRef, useState } from "react";
import { FormField } from "@white-owl/brand/components";

export function RemediationCallback() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [comments, setComments] = useState("");
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Field DOM refs so we can focus the first invalid input on submit.
  const formRef = useRef(null);

  function validate() {
    const e = {};
    if (!firstName.trim()) e.firstName = "First name is required.";
    if (!lastName.trim()) e.lastName = "Last name is required.";
    if (!email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Please enter a valid email address.";
    if (!phone.trim()) e.phone = "Phone is required.";
    if (!comments.trim()) e.comments = "Please tell us a bit about your project.";
    return e;
  }

  function onSubmit(ev) {
    ev.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) {
      setSubmitted(true);
      return;
    }
    // Focus the first input that failed validation.
    const order = ["firstName", "lastName", "email", "phone", "comments"];
    const firstBad = order.find((k) => e[k]);
    if (firstBad && formRef.current) {
      const node = formRef.current.querySelector(
        `[data-field="${firstBad}"] input, [data-field="${firstBad}"] textarea`
      );
      if (node) node.focus();
    }
  }

  if (submitted) {
    return (
      <div className="mw-callback" role="status" aria-live="polite">
        <h3 className="tl-display tl-display--s" style={{ marginTop: 0 }}>
          Thanks — we&rsquo;ll be in touch.
        </h3>
        <p>
          A member of the Miller remediation team will reach out shortly. For
          immediate assistance, call (204) 925-9600.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} className="mw-callback" onSubmit={onSubmit} noValidate>
      <div className="mw-callback__row">
        <div data-field="firstName">
          <FormField
            label="First name"
            required
            value={firstName}
            onChange={setFirstName}
            err={errors.firstName}
          />
        </div>
        <div data-field="lastName">
          <FormField
            label="Last name"
            required
            value={lastName}
            onChange={setLastName}
            err={errors.lastName}
          />
        </div>
      </div>
      <div className="mw-callback__row">
        <div data-field="email">
          <FormField
            label="Email"
            type="email"
            required
            value={email}
            onChange={setEmail}
            err={errors.email}
          />
        </div>
        <div data-field="phone">
          <FormField
            label="Phone"
            type="tel"
            required
            value={phone}
            onChange={setPhone}
            err={errors.phone}
          />
        </div>
      </div>
      <div data-field="comments">
        <FormField
          label="Comments"
          required
          textarea
          value={comments}
          onChange={setComments}
          err={errors.comments}
        />
      </div>
      <p style={{ marginTop: 16 }}>
        <button type="submit" className="tl-btn tl-btn--primary tl-btn--lg">
          Request a Callback <span className="tl-btn-arr">→</span>
        </button>
      </p>
    </form>
  );
}
