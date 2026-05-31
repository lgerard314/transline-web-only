import { Fragment } from "react";
import { emergencyResponse as c } from "@/lib/content/service-emergency-response";

// §3 — What we respond to (photo incident grid on the light --c-bg surface).
export function IncidentsSection() {
  const inc = c.incidents;
  return (
    <section className="mw-svc-inds mw-svc-inds--photo" aria-labelledby="er-inc-title">
      <div className="mw-svc-inds__inner mw-inner">
        <header className="mw-svc-inds__head" data-reveal>
          <div className="mw-svc-inds__head-left">
            <p className="mw-section-tag" aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{inc.eyebrow}</span>
            </p>
            <h2 id="er-inc-title" className="mw-section-title">
              {inc.title.split("\n").map((line, i, arr) => (
                <Fragment key={i}>
                  {i === 0 ? line : <em className="mw-svc-inds__title-em">{line}</em>}
                  {i < arr.length - 1 && <br />}
                </Fragment>
              ))}
              <span className="mw-stop" aria-hidden="true" />
            </h2>
            <p className="mw-svc-inds__lead">{inc.lead}</p>
          </div>
          <div className="mw-svc-inds__head-media" aria-hidden="true">
            <img src="/miller/pickup-truck-transparent-removebg.png" alt="" loading="lazy" />
          </div>
        </header>

        <ul className="mw-svc-inds__grid" data-reveal-stagger>
          {inc.items.map((item) => (
            <li key={item.name} className="mw-svc-ind">
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
          ))}
        </ul>
      </div>
    </section>
  );
}
