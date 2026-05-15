"use client";
// Accessible form input/textarea pair with label, required marker, error
// message, and matching aria attributes. Extracted from TL49's ContactClient
// so both brands can reuse the same primitive without copy-pasting.
import { useId } from "react";

export function FormField({ label, required, value, onChange, placeholder, type = "text", textarea = false, err }) {
  const id = useId();
  const errId = `${id}-err`;
  return (
    <div className="tl-field">
      <label htmlFor={id}>
        {label}
        {required && <span className="req" aria-hidden="true"> *</span>}
        {required && <span className="tl-sr-only"> (required)</span>}
      </label>
      {textarea ? (
        <textarea
          id={id}
          data-error={err ? "1" : "0"}
          value={value}
          placeholder={placeholder}
          aria-invalid={err ? "true" : "false"}
          aria-describedby={err ? errId : undefined}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <input
          id={id}
          data-error={err ? "1" : "0"}
          type={type}
          value={value}
          placeholder={placeholder}
          aria-invalid={err ? "true" : "false"}
          aria-describedby={err ? errId : undefined}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {err && <div id={errId} className="err" role="alert">{err}</div>}
    </div>
  );
}
