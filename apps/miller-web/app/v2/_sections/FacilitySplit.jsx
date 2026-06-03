import Image from "next/image";
import { CustodyRule } from "../_components/CustodyThread";
import { MxArrow } from "../_components/marks";

// 04 · TREATMENT — VBEC, the dark mid-anchor that breaks the light run. A media
// split: the facility aerial clips in on the left; the right carries the ledger
// grammar — field-head, the VBEC label + headline, lead, three oversized spec
// figures (the document's measured facts), the capability list, and the visit
// actions. Dark walnut with a raking-light atmosphere + edge registration marks.
export function FacilitySplit({ content }) {
  const c = content;
  return (
    <section className="mx-fac mx-section mx-dark" aria-labelledby={c.headingId}>
      <CustodyRule />
      <span className="mx-fac__atmos" aria-hidden="true" />
      <span className="mx-fac__regmark mx-fac__regmark--tr" aria-hidden="true" />
      <div className="mx-inner mx-fac__grid">
        <div className="mx-fac__media" data-mx-reveal="clip">
          <Image src={c.photo.src} alt={c.photo.alt} fill sizes="(max-width: 980px) 100vw, 48vw" className="mx-fac__img" />
          <span className="mx-fac__plate">{c.title.top}</span>
        </div>

        <div className="mx-fac__body">
          <p className="mx-field mx-field--on-dark">
            <span>{c.stage}</span>
            <span className="mx-field__rule" />
            <span>{c.eyebrow}</span>
          </p>
          <h2 id={c.headingId} className="mx-h2">{c.title.em}</h2>
          <p className="mx-lead">{c.lead}</p>

          <ul className="mx-fac__figs">
            {c.figures.map((f) => (
              <li className="mx-fac__fig" key={f.label}>
                <span className="mx-fac__figlabel">{f.label}</span>
                <span className="mx-fac__fignum">{f.num}</span>
                <span className="mx-fac__figunit">{f.unit}</span>
              </li>
            ))}
          </ul>

          <div className="mx-fac__caps">
            <p className="mx-fac__capstitle">{c.capsTitle}</p>
            <ul className="mx-fac__caplist">
              {c.capabilities.map((cap) => (
                <li className="mx-fac__cap" key={cap}>{cap}</li>
              ))}
            </ul>
          </div>

          <div className="mx-fac__actions">
            <a className="mx-btn mx-btn--primary" href={c.primaryCta.href}>{c.primaryCta.longLabel} <MxArrow /></a>
            <a className="mx-btn mx-btn--text" href={c.aboutLink.href}>{c.aboutLink.longLabel} <MxArrow /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
