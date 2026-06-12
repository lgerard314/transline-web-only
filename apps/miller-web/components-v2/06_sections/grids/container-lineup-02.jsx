"use client";

import { useEffect, useRef } from "react";
import { StopText } from "@/components/StopText";
import { sectionProps } from "@/components-v2/section-config";

// L3 · container-lineup-02 — the "any volume" story as a freight spec sheet
// (CWC v2 §2). Four generated container photos stand on a shared baseline rule
// at proportional heights (pail → drum → tote → van load), each with a
// drafting-legend meta block below the line. Replaces capacity-ladder-01 on
// this page only (the v1 template still serves nothing else, but is left
// untouched per the template-change protocol).
//
// Motion contract (playbook §3, M1 — re-anchored 2026-06-12, owner edit):
//   progress source — the SECTION's rect vs the viewport;
//   p = clamp01((viewportBottom − secTop) / secHeight). The containers rise
//   from BEHIND the baseline rule (media zone clips), so a rise is only
//   perceptible once the baseline itself is above the fold — the original
//   fixed slices (completions from p=0.40) played the entire pail rise below
//   the fold ("perceptible or it doesn't exist"). Thresholds are therefore
//   DERIVED FROM GEOMETRY each frame: thr0 = (baselineY − secTop)/secHeight
//   (slice 0 begins the instant the baseline crosses the viewport bottom).
//   COMPLETION ANCHOR (owner 2026-06-12): the LAST slice (the van load) must
//   finish EXACTLY when the bottom of tier 4's META wrapper (name+note block)
//   crosses the viewport bottom — NOT when the whole section bottom does.
//   pEnd = (tier4MetaBottom − secTop)/secHeight (a scroll-invariant fraction,
//   measured like the baseline), and step = (pEnd − thr0 − LEN)/(N−1) spreads
//   the earlier completions between thr0 and pEnd so the LAST lands at
//   exactly p = pEnd. Every pixel of every rise happens on-screen, and
//   assembly is visibly in progress from baseline-crossing to the anchor
//   frame. Writer: rAF-coalesced passive scroll listener (recipe §4.2) +
//   IO-requeue (§4.3). Reduced motion / no-JS: var fallbacks rest everything
//   settled, and the CSS transform is additionally gated to
//   (prefers-reduced-motion: no-preference).
//
// content: { titleId, eyebrow, title, lead, tiers[{ num, name, spec, image, note }] }
// config:  standard sectionProps passthrough.
const SLICE_LEN = 0.1;

export function ContainerLineup02({ content, config = {} }) {
  const secRef = useRef(null);
  const bandRef = useRef(null);

  useEffect(() => {
    const sec = secRef.current;
    const band = bandRef.current;
    if (!sec || !band) return undefined;
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mql.matches) return undefined; // CSS default rests settled

    const tierCount = band.querySelectorAll(".mw-cwc-line__tier").length || 4;
    let raf = 0;
    const write = () => {
      raf = 0;
      const vh = window.innerHeight;
      const r = sec.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (vh - r.top) / r.height));
      sec.style.setProperty("--cwcl-p", p.toFixed(4));
      // Geometry-derived slice plan (see the contract above). The baseline
      // is the bottom of any media box; the completion anchor is the bottom
      // of tier 4's meta wrapper. Both section-relative fractions are
      // scroll-invariant, so this is cheap to recompute per write (and
      // self-heals across resizes/font swaps).
      const media = band.querySelector(".mw-cwc-line__media");
      const lastMeta = band.querySelector(".mw-cwc-line__tier:last-child .mw-cwc-line__meta");
      if (media && lastMeta) {
        const pEnd = Math.min(1, Math.max(SLICE_LEN, (lastMeta.getBoundingClientRect().bottom - r.top) / r.height));
        const thr0 = Math.max(0, Math.min(pEnd - SLICE_LEN, (media.getBoundingClientRect().bottom - r.top) / r.height));
        const step = Math.max(0, (pEnd - thr0 - SLICE_LEN) / (tierCount - 1));
        sec.style.setProperty("--cwcl-thr0", thr0.toFixed(4));
        sec.style.setProperty("--cwcl-step", step.toFixed(4));
        sec.style.setProperty("--cwcl-len", SLICE_LEN.toFixed(2));
      }
    };
    const queue = () => {
      if (!raf) raf = requestAnimationFrame(write);
    };

    queue();
    window.addEventListener("scroll", queue, { passive: true });
    window.addEventListener("resize", queue);

    // IO-requeue: survive programmatic jumps / var clears (recipe §4.3).
    const io = new IntersectionObserver(queue, { rootMargin: "300px 0px" });
    io.observe(band);

    return () => {
      window.removeEventListener("scroll", queue);
      window.removeEventListener("resize", queue);
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={secRef}
      className="mw-cwc-line"
      aria-labelledby={content.titleId}
      {...sectionProps(config)}
    >
      <div className="mw-cwc-line__inner mw-inner">
        {/* Centered stack (owner 2026-06-12): eyebrow → title → lead, all
            center-aligned — same intro grammar as the home sectors head. */}
        <header className="mw-cwc-line__head">
          <p className="mw-section-tag" data-reveal aria-hidden="true">
            <span className="mw-section-tag-mark" />
            <span className="mw-section-tag-label">{content.eyebrow}</span>
          </p>
          <h2 id={content.titleId} className="mw-section-title mw-cwc-line__title" data-reveal>
            <StopText>{content.title}</StopText>
          </h2>
          <p className="mw-cwc-line__lead" data-reveal>{content.lead}</p>
        </header>

        <div className="mw-cwc-line__band" ref={bandRef}>
          <ol className="mw-cwc-line__row">
            {content.tiers.map((t, i) => (
              <li
                key={t.num}
                className="mw-cwc-line__tier"
                style={{ "--i": i }}
              >
                <div className="mw-cwc-line__media" data-size={t.num} aria-hidden="true">
                  <img src={t.image} alt="" loading="lazy" />
                  {t.height && (
                    <span className="mw-cwc-line__dim">
                      <span className="mw-cwc-line__dim-rule" />
                      {t.height}
                    </span>
                  )}
                </div>
                {/* Meta block reveals as it enters (most text gets scroll
                    motion — logan 2026-06-12); the id row's drafting leader
                    draws into the spec with the tier's own scrub slice,
                    filling the old marker slot with purpose. */}
                <div className="mw-cwc-line__meta" data-reveal>
                  <p className="mw-cwc-line__id">
                    <span className="mw-cwc-line__id-leader" aria-hidden="true" />
                    <span className="mw-cwc-line__spec">{t.spec}</span>
                  </p>
                  <h3 className="mw-cwc-line__name">{t.name}</h3>
                  <p className="mw-cwc-line__note">{t.note}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
