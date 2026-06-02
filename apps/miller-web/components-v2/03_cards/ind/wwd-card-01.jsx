// WwdCard01 — reproduces the <li class="mw-wwd-card"> markup from
// apps/miller-web/app/industrial-services/environmental-remediation-services/sections/02-what-we-do.jsx
// verbatim. CSS hover-swap; no JS. Server component; no "use client".
//
// Props:
//   item: { name: string, blurb: string, detail: string, photo: string }
//     - name is a single-line string (the capability heading)
//     - blurb is the short rest-state description
//     - detail is the full capability paragraph shown on hover
//     - photo is an absolute-path src string

export function WwdCard01({ item }) {
  return (
    <li className="mw-wwd-card" tabIndex={0}>
      <img className="mw-wwd-card__photo" src={item.photo} alt="" loading="lazy" />
      <div className="mw-wwd-card__overlay">
        <h3 className="mw-wwd-card__name">{item.name}</h3>
        <p className="mw-wwd-card__blurb">{item.blurb}</p>
        <p className="mw-wwd-card__detail">{item.detail}</p>
      </div>
    </li>
  );
}
