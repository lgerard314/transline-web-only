"use client";

import { useState } from "react";
import { LiteYouTube } from "@/components/LiteYouTube";
import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";

// L3 · screening-room-01 — the page's dark walnut anchor (REM v2 §6):
// real Miller films in a screening room. One large privacy-light facade
// player (LiteYouTube composed; keyed by film so switching resets the
// facade) beside a reel list of real <button> rows (accent mono · title ·
// desc). Unlike the stream-index grammar, rows commit on CLICK/Enter only
// — hover-swapping would tear down an active player mid-watch.
//
// content: { titleId, eyebrow, title, lead,
//            items[{ id, accent, title, desc }] }
// config:  standard sectionProps passthrough.
export function ScreeningRoom01({ content, config = {} }) {
  const [active, setActive] = useState(0);
  const films = content.items;
  const current = films[active];

  return (
    <section className="mw-rem2-film" aria-labelledby={content.titleId} {...sectionProps(config)}>
      <div className="mw-rem2-film__inner mw-inner">
        <header className="mw-rem2-film__head">
          <div>
            <p className="mw-section-tag" data-reveal aria-hidden="true">
              <span className="mw-section-tag-mark" />
              <span className="mw-section-tag-label">{content.eyebrow}</span>
            </p>
            <h2 id={content.titleId} className="mw-section-title mw-rem2-film__title" data-reveal>
              <StopText>{content.title}</StopText>
            </h2>
          </div>
          <p className="mw-rem2-film__lead" data-reveal>{content.lead}</p>
        </header>

        <div className="mw-rem2-film__grid">
          <div className="mw-rem2-film__screen" data-reveal>
            <LiteYouTube key={current.id} id={current.id} title={current.title} />
          </div>

          <ol className="mw-rem2-film__reel" data-reveal>
            {films.map((f, i) => (
              <li key={f.id} className="mw-rem2-film__row" data-active={i === active ? "1" : undefined}>
                <button
                  type="button"
                  className="mw-rem2-film__row-btn"
                  aria-pressed={i === active}
                  onClick={() => setActive(i)}
                >
                  <span className="mw-rem2-film__mark" aria-hidden="true" />
                  <span className="mw-rem2-film__row-body">
                    <span className="mw-rem2-film__accent">{f.accent}</span>
                    <span className="mw-rem2-film__name">{f.title}</span>
                    <span className="mw-rem2-film__desc">{f.desc}</span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
