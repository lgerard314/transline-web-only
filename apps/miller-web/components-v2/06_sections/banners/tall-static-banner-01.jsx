// L3 · tall-static-banner-01 — trust band; download-card row under the hero.
"use client";

import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { sectionProps } from "@/components-v2/section-config";

function CertDownloadLink({ cert }) {
  const isISO = cert.name.startsWith("ISO");
  const display = isISO ? cert.name.replace(/^ISO\s+/, "").split(":")[0] : "COR";
  const prefix = isISO ? "ISO" : "MHCA";

  return (
    <a
      href={cert.href}
      download
      className="mw-cert"
      role="listitem"
      aria-label={`Download ${cert.name} certificate, ${cert.sizeKB} KB PDF`}
    >
      <span className="mw-certs__inner">
        <img className="mw-cert__mark" src={cert.mark} alt="" aria-hidden="true" loading="lazy" />
        <span className="mw-cert__body">
          <span className="mw-cert__prefix">
            {prefix}&nbsp;·&nbsp;{cert.year}
          </span>
          <span className="mw-cert__num">{display}</span>
          <span className="mw-cert__desc">{cert.long}</span>
          <span className="mw-cert__pdf">
            <span>
              PDF · {cert.sizeKB}KB
            </span>
            <span className="mw-cert__arr" aria-hidden="true">
              ↓
            </span>
          </span>
        </span>
      </span>
    </a>
  );
}

export function TallStaticBanner01({ content, config = {} }) {
  const gridRef = useRef(null);

  const syncInnerWidths = useCallback(() => {
    const root = gridRef.current;
    if (!root) return;
    const inners = root.querySelectorAll(".mw-certs__inner");
    inners.forEach((el) => {
      el.style.width = "";
    });
    let max = 0;
    inners.forEach((el) => {
      max = Math.max(max, el.getBoundingClientRect().width);
    });
    if (max > 0) {
      const w = `${Math.ceil(max)}px`;
      inners.forEach((el) => {
        el.style.width = w;
      });
    }
  }, []);

  useLayoutEffect(() => {
    syncInnerWidths();
    const root = gridRef.current;
    if (!root) return undefined;
    const ro = new ResizeObserver(syncInnerWidths);
    ro.observe(root);
    window.addEventListener("resize", syncInnerWidths);
    if (document.fonts?.ready) document.fonts.ready.then(syncInnerWidths);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", syncInnerWidths);
    };
  }, [syncInnerWidths, content.certs]);

  // Reveal: each card slides down out of the header + fades in once it is at
  // least HALF past the bottom of the viewport (50% of the card visible). No
  // stagger — the cards
  // share a row, so they cross the 50% line together and fire as one. This
  // banner drives its OWN reveal: the grid is deliberately NOT a
  // data-reveal-stagger container, so the house MillerScrollReveal (which fires
  // at first-pixel and would cascade them) never touches these cards. We clear
  // the revealed state when scrollY returns to the top (the banner sits below
  // the hero fold) so the motion plays fresh on the next scroll-in.
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;
    const root = gridRef.current;
    if (!root) return undefined;
    const items = () => Array.from(root.children);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.intersectionRatio >= 0.5) {
            // ONE band, ONE entrance: the first card to cross the line fires ALL of
            // them. On desktop they share a row and crossed together anyway; on the
            // ≤1100 horizontal strip the off-screen cards would otherwise sit at
            // opacity 0 and play their entrance MID-SWIPE (logan: no render motion
            // on horizontal scroll — they all render at the same time).
            items().forEach((el) => el.setAttribute("data-in", "1"));
            break;
          }
        }
      },
      { threshold: [0, 0.5, 1], rootMargin: "0px" },
    );
    items().forEach((el) => io.observe(el));

    const onScroll = () => {
      if (window.scrollY <= 1) {
        items().forEach((el) => el.removeAttribute("data-in"));
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [content.certs]);

  return (
    <>
      {/* Reveal motion owned here (not home/certs.css) so cert cards slide DOWN out
          of the hero/header fold instead of up from below. */}
      <style>{`
        @keyframes mw-cert-rv-tsb01 {
          0%   { opacity: 0; transform: translateY(-34px); }
          100% { opacity: 1; transform: none; }
        }
        .mw-trust--tsb01 .mw-cert[data-in="1"] {
          animation: mw-cert-rv-tsb01 0.8s cubic-bezier(.16, .84, .3, 1) both;
        }
      `}</style>
      <section
        className="mw-trust mw-trust--tsb01"
        aria-label={content.ariaLabel}
        {...sectionProps(config)}
      >
        <div
          ref={gridRef}
          className="mw-certs"
          role="list"
          aria-label={content.ariaLabel}
        >
          {content.certs.map((cert) => (
            <CertDownloadLink key={cert.slug} cert={cert} />
          ))}
        </div>
      </section>
    </>
  );
}
