"use client";
// Privacy-light YouTube facade: shows the poster + a clay play button and only
// mounts the real iframe on click, so the page stays fast and no third-party
// script loads until a viewer opts in.

import { useState } from "react";

export function LiteYouTube({ id, title, className = "" }) {
  const [active, setActive] = useState(false);
  const src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;

  return (
    <div className={`mw-lyt ${className}`.trim()} data-active={active ? "1" : "0"}>
      {active ? (
        <iframe
          className="mw-lyt__frame"
          src={src}
          title={title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="mw-lyt__poster"
          onClick={() => setActive(true)}
          aria-label={`Play video: ${title}`}
        >
          <img
            className="mw-lyt__thumb"
            src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`}
            alt=""
            loading="lazy"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;
            }}
          />
          <span className="mw-lyt__play" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M8 5.5 18 12 8 18.5 Z" fill="currentColor" />
            </svg>
          </span>
          <span className="mw-lyt__label">{title}</span>
        </button>
      )}
    </div>
  );
}
