"use client";

import { LiteYouTube } from "./LiteYouTube";
import { useState } from "react";

// On-film picker. A column of horizontal cards (photo, accent, title, one-line
// description) on the left selects which film loads in the large player on the
// right. The player is keyed by id so it remounts to the chosen poster on each
// pick; the privacy-light facade means the YouTube iframe still only mounts when
// the viewer hits play.
export function FilmGallery({ films }) {
  const [active, setActive] = useState(0);
  const current = films[active];

  return (
    <div className="mw-film">
      <ul className="mw-film__list" data-reveal-stagger>
        {films.map((f, i) => (
          <li key={f.id}>
            <button
              type="button"
              className="mw-film__card"
              data-active={i === active ? "1" : undefined}
              aria-pressed={i === active}
              onClick={() => setActive(i)}
            >
              <span className="mw-film__thumb" aria-hidden="true">
                <img
                  src={`https://i.ytimg.com/vi/${f.id}/maxresdefault.jpg`}
                  alt=""
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://i.ytimg.com/vi/${f.id}/mqdefault.jpg`;
                  }}
                />
                <span className="mw-film__play">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M8 5.5 18 12 8 18.5 Z" fill="currentColor" />
                  </svg>
                </span>
              </span>
              <span className="mw-film__text">
                <span className="mw-film__accent">
                  <span className="mw-film__accent-mark" />
                  {f.accent}
                </span>
                <span className="mw-film__name">{f.title}</span>
                <span className="mw-film__desc">{f.desc}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>

      <div className="mw-film__player" data-reveal>
        <LiteYouTube key={current.id} id={current.id} title={current.title} className="mw-lyt--featured" />
      </div>
    </div>
  );
}
