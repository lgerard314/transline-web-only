"use client";

import Link from "next/link";
import { useCallback } from "react";
import { HOME_LAB_SECTIONS } from "./registry";

export function LabShell({ slug, label, templatePath, pin, children }) {
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const scrollToPin = useCallback(() => {
    const section = document.querySelector("[data-hl-section]");
    if (!section) return;
    const top = section.getBoundingClientRect().top + window.scrollY;
    window.scrollTo({ top: Math.max(0, top - 8), behavior: "smooth" });
  }, []);

  return (
    <>
      <nav className="hl-bar" aria-label="Home lab">
        <span className="hl-bar__title">Home lab</span>
        <Link href="/home-lab">Index</Link>
        <span className="hl-bar__sep" aria-hidden="true">·</span>
        <Link href="/">Live /</Link>
        <span className="hl-bar__sep" aria-hidden="true">·</span>
        <span>{label}</span>
        <span className="hl-bar__actions">
          <button type="button" className="hl-btn" onClick={scrollToTop}>
            Section top
          </button>
          {pin ? (
            <button type="button" className="hl-btn" onClick={scrollToPin}>
              Pin start
            </button>
          ) : null}
        </span>
      </nav>
      <div className="hl-picker">
        {HOME_LAB_SECTIONS.map((s) => (
          <Link key={s.slug} href={`/home-lab/${s.slug}`} aria-current={s.slug === slug ? "page" : undefined}>
            {s.label}
          </Link>
        ))}
      </div>
      <div data-hl-section data-hl-template={templatePath}>
        {children}
      </div>
      {pin ? <div className="hl-spacer" aria-hidden="true" /> : null}
    </>
  );
}
