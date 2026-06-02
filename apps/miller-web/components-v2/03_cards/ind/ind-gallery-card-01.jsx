// IndGalleryCard01 — reproduces the <li class="mw-ind-card"> markup from
// apps/miller-web/app/industrial-services/customer-waste-collection/sections/04-industries.jsx
// verbatim. Server component; no "use client".
//
// Props:
//   item: { name: string, blurb: string, photo: string }
//     - name is a single-line string
//     - blurb is a single-line string
//     - photo is an absolute-path src string

export function IndGalleryCard01({ item }) {
  return (
    <li className="mw-ind-card">
      <div className="mw-ind-card__media">
        <img src={item.photo} alt="" loading="lazy" />
      </div>
      <div className="mw-ind-card__body">
        <h3 className="mw-ind-card__name">{item.name}</h3>
        <span className="mw-ind-card__tick" aria-hidden="true">
          <span className="mw-ind-card__tick-dot" />
          <span className="mw-ind-card__tick-line" />
        </span>
        <p className="mw-ind-card__blurb">{item.blurb}</p>
      </div>
    </li>
  );
}
