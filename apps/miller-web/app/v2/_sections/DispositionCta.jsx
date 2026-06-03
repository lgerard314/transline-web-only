import { TruckLine } from "../_components/TruckLine";
import { CustodyRule } from "../_components/CustodyThread";
import { MxArrow } from "../_components/marks";

// · DISPOSITION — the close, signature beat #3. The blueprint truck self-draws
// (arrives) and the DELIVERED stamp lands as it completes; then the final call:
// title, body, contact + 24/7 actions, and the social countersignatures. Dark
// surface with a faint blueprint-grid atmosphere (this section only). The truck
// arrival + stamp rest fully shown under reduced-motion (verbs in v2.css).
export function DispositionCta({ content }) {
  const c = content;
  return (
    <section className="mx-disp mx-section mx-dark" aria-labelledby={c.headingId}>
      <CustodyRule />
      <span className="mx-disp__blueprint" aria-hidden="true" />
      <div className="mx-inner mx-disp__inner">
        <div className="mx-disp__truckwrap">
          <TruckLine className="mx-disp__truck" />
          <span className="mx-disp__stamp" data-mx-reveal="stamp" aria-hidden="true">{c.stamp}</span>
        </div>

        <div className="mx-disp__cta">
          <p className="mx-field mx-field--on-dark">
            <span>{c.stage}</span>
            <span className="mx-field__rule" />
            <span>{c.eyebrow}</span>
          </p>
          <h2 id={c.headingId} className="mx-h2">{c.title}</h2>
          <p className="mx-lead">{c.body}</p>
          <div className="mx-disp__actions">
            <a className="mx-btn mx-btn--primary" href={c.primaryCta.href}>{c.primaryCta.label} <MxArrow /></a>
            <a className="mx-btn mx-btn--ghost" href={c.ghostPhone.href}>
              <span className="mx-btn__sup">{c.ghostPhone.sup}</span>
              <span className="mx-btn__num">{c.ghostPhone.num}</span>
            </a>
          </div>
          <ul className="mx-disp__socials" aria-label={c.socialsAriaLabel}>
            {c.socials.map((s) => (
              <li key={s.label}>
                <a className="mx-disp__social" href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  <svg viewBox="0 0 16 16" width="18" height="18" aria-hidden="true"><path d={s.path} fill="currentColor" /></svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
