// L3 · tall-static-banner-01 — trust band; download-card row under the hero.
"use client";

import { useCallback, useLayoutEffect, useRef } from "react";
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

  return (
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
        data-reveal-stagger
      >
        {content.certs.map((cert) => (
          <CertDownloadLink key={cert.slug} cert={cert} />
        ))}
      </div>
    </section>
  );
}
