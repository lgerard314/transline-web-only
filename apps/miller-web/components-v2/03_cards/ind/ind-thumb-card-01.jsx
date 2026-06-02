import { Fragment } from "react";

// IndThumbCard01 — reproduces the <li class="mw-svc-ind"> markup from
// apps/miller-web/app/industrial-services/emergency-response/sections/03-incidents.jsx
// verbatim. Server component; no "use client".
//
// Props:
//   item: { name: string, blurb: string, photo: string }
//     - name may contain "\n" line breaks (rendered as <br />)
//     - blurb is a single-line string
//     - photo is an absolute-path src string

export function IndThumbCard01({ item }) {
  return (
    <li className="mw-svc-ind">
      <span className="mw-svc-ind__thumb" aria-hidden="true">
        <img src={item.photo} alt="" loading="lazy" />
        <span className="mw-svc-ind__name">
          {item.name.split("\n").map((line, i, arr) => (
            <Fragment key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </Fragment>
          ))}
        </span>
      </span>
      <span className="mw-svc-ind__text">
        <span className="mw-svc-ind__tick" aria-hidden="true">
          <span className="mw-svc-ind__tick-dot" />
          <span className="mw-svc-ind__tick-line" />
        </span>
        <span className="mw-svc-ind__desc">{item.blurb}</span>
      </span>
    </li>
  );
}
