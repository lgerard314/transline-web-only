import Link from "next/link";

// CaseCard01 — reproduces the linked <li class="mw-ind-card mw-case-card"> markup from
// apps/miller-web/app/industrial-services/environmental-remediation-services/sections/06-case-studies.jsx
// verbatim. Server component; no "use client".
//
// Props:
//   item: { href: string, title: string, location: string, photo: string, desc: string }
//     - href   is the case-study detail route (e.g. "/case-studies/…/")
//     - title  is the card heading
//     - location is the short location label shown above the heading
//     - photo  is an absolute-path src string
//     - desc   is the one-sentence summary blurb

export function CaseCard01({ item }) {
  return (
    <li className="mw-ind-card mw-case-card">
      <Link href={item.href} className="mw-case-card__link">
        <div className="mw-ind-card__media">
          <img src={item.photo} alt="" loading="lazy" />
        </div>
        <div className="mw-ind-card__body">
          <p className="mw-case-card__loc">{item.location}</p>
          <h3 className="mw-ind-card__name">{item.title}</h3>
          <p className="mw-case-card__desc">{item.desc}</p>
          <span className="mw-case-card__cta">
            Read case study <span className="mw-case-card__arrow" aria-hidden="true">→</span>
          </span>
        </div>
      </Link>
    </li>
  );
}
