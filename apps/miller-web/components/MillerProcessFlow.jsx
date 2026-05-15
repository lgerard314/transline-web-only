"use client";
// 5-step process timeline for the Remediation page. Rendered as <ol> per
// the a11y rule in design spec §6: process is an ordered list,
// non-negotiable.
//
// Client component (minimal state) so a future scroll-driven highlight
// can be lifted from TL49's ProcessFlowAdvanced. Phase 02 ships the
// static-render baseline only.

export function MillerProcessFlow({ steps = [] }) {
  return (
    <ol className="mw-process">
      {steps.map((s, i) => (
        <li key={i}>
          <span aria-hidden="true" /> {/* counter slot from CSS */}
          <div>
            <h3 className="mw-process__step-title">{s.title}</h3>
            <p className="mw-process__step-body">{s.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
