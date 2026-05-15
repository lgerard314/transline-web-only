"use client";
// "How we do it" custom flow. Two exports:
//   <ProcessFlowSimple>   – home page, horizontal 6-node rail
//   <ProcessFlowAdvanced> – cross-border-process page, zigzag column with
//                           scroll-driven truck that advances through steps
//
// Both share the same step definitions + icon set below.
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ParallelRule } from "@white-owl/brand/components";

export const PROC_STEPS = [
  {
    key: "inquiry",
    num: "01",
    title: "Customer Inquiry",
    shortBlurb: "Tell us about the material and the constraints.",
    longBlurb:
      "Project intake. The customer reaches out with material details, volume, location, and timeline — by phone, the intake form, or referral. We confirm scope and timing.",
    deliverable: "PROJECT BRIEF",
    typicalTime: "DAY 0 – 1",
    icon: "inquiry",
  },
  {
    key: "profile",
    num: "02",
    title: "Profiling & Acceptance",
    shortBlurb: "Review the waste profile and lab data.",
    longBlurb:
      "We review the waste profile, analytical data, and SDS — and confirm a Canadian receiving facility will accept it. If data is missing, we coordinate sampling.",
    deliverable: "ACCEPTANCE LETTER",
    typicalTime: "WEEK 1 – 2",
    icon: "profile",
  },
  {
    key: "permit",
    num: "03",
    title: "Cross-Border Permit",
    shortBlurb: "Permit workflow with U.S. EPA & ECCC.",
    longBlurb:
      "For hazardous material, we coordinate the cross-border permit workflow with U.S. EPA and Environment & Climate Change Canada — including notices, contracts, insurance, and movement documents.",
    deliverable: "MOVEMENT DOCUMENT",
    typicalTime: "WEEK 2 – N",
    icon: "permit",
  },
  {
    key: "logistics",
    num: "04",
    title: "Logistical Planning",
    shortBlurb: "Scheduling, carriers, routing.",
    longBlurb:
      "We schedule the movement: authorized carrier, route, pickup and border crossing windows, documentation packets, and on-the-ground contacts at both ends.",
    deliverable: "PICKUP SCHEDULE",
    typicalTime: "DAYS BEFORE PICKUP",
    icon: "truck",
  },
  {
    key: "shipment",
    num: "05",
    title: "Shipment to Miller Environmental",
    shortBlurb: "Material crosses 49°N to Canada.",
    longBlurb:
      "Material is picked up, accompanied by the movement document, crosses the border at the authorized port of entry, and is delivered to Miller Environmental Corporation in Canada.",
    deliverable: "CHAIN OF CUSTODY",
    typicalTime: "ON THE ROAD",
    icon: "canada",
  },
  {
    key: "recycle",
    num: "06",
    title: "Disposal / Recycling",
    shortBlurb: "Treatment, recycling, or final disposal.",
    longBlurb:
      "Material is processed: recycled or repurposed where viable, otherwise treated and disposed at the authorized facility. We return confirmation documentation for your records.",
    deliverable: "CERTIFICATE OF DESTRUCTION",
    typicalTime: "POST-ARRIVAL",
    icon: "recycle",
  },
];

export function StepIcon({ name, size = 44 }) {
  const c = "currentColor";
  const base = { width: size, height: size, viewBox: "0 0 48 48", fill: "none" };
  switch (name) {
    case "inquiry":
      return (
        <svg {...base}>
          <path
            d="M8 12 a3 3 0 0 1 3 -3 h26 a3 3 0 0 1 3 3 v16 a3 3 0 0 1 -3 3 h-18 l-6 6 v-6 h-2 a3 3 0 0 1 -3 -3 z"
            fill={c}
          />
          <text x="24" y="26" textAnchor="middle" fontSize="18" fontWeight="700" fill="#fff" fontFamily="var(--font-display)">
            ?
          </text>
        </svg>
      );
    case "profile":
      return (
        <svg {...base}>
          <g transform="translate(10 7)">
            {[0, 9, 18].map((x, i) => (
              <g key={i}>
                <path d={`M${x} 2 v22 a4 4 0 0 0 8 0 v-22 z`} stroke={c} strokeWidth="2" fill="none" />
                <path
                  d={`M${x + 0.6} ${10 + i * 2} v${14 - i * 2} a3.4 3.4 0 0 0 6.8 0 v-${12 - i * 2} z`}
                  fill={c}
                />
                <circle cx={x + 2.5} cy={12 + i * 3} r="0.9" fill="#fff" />
                <circle cx={x + 5} cy={16 + i * 2} r="0.7" fill="#fff" />
              </g>
            ))}
          </g>
        </svg>
      );
    case "permit":
      return (
        <svg {...base}>
          <path d="M10 6 h16 l4 4 v26 a2 2 0 0 1 -2 2 h-18 a2 2 0 0 1 -2 -2 z" fill={c} />
          <path d="M26 6 v4 h4" stroke="#fff" strokeWidth="1.5" opacity="0.4" fill="none" />
          {[14, 18, 22, 26].map((y, i) => (
            <line key={i} x1="14" y1={y} x2={i === 3 ? 23 : 26} y2={y} stroke="#fff" strokeWidth="1.6" opacity="0.85" />
          ))}
          <circle cx="33" cy="34" r="7" fill={c} stroke="#fff" strokeWidth="1.5" />
          <path
            d="M29.5 34 l 2.5 2.5 l 4.5 -5"
            stroke="#fff"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "truck":
      return (
        <svg {...base}>
          <g>
            <path d="M10 8 c0 -3 6 -3 6 0 c0 3 -3 6 -3 6 c0 0 -3 -3 -3 -6 z" fill={c} />
            <circle cx="13" cy="8" r="1.2" fill="#fff" />
            <path d="M32 8 c0 -3 6 -3 6 0 c0 3 -3 6 -3 6 c0 0 -3 -3 -3 -6 z" fill={c} />
            <circle cx="35" cy="8" r="1.2" fill="#fff" />
            <path d="M16 12 q 8 6 16 0" stroke={c} strokeWidth="1.5" strokeDasharray="1.5 2" fill="none" />
          </g>
          <g transform="translate(6 22)">
            <rect x="0" y="4" width="20" height="13" rx="1" fill={c} />
            <path d="M20 8 h6 l5 5 v4 h-11 z" fill={c} />
            <circle cx="6" cy="18" r="3" fill="#1a1a1a" />
            <circle cx="6" cy="18" r="1.2" fill="#fff" />
            <circle cx="25" cy="18" r="3" fill="#1a1a1a" />
            <circle cx="25" cy="18" r="1.2" fill="#fff" />
            <line x1="-5" y1="6" x2="-1" y2="6" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
            <line x1="-6" y1="10" x2="-1" y2="10" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
            <line x1="-4" y1="14" x2="-1" y2="14" stroke={c} strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          </g>
        </svg>
      );
    case "canada":
      return (
        <svg {...base}>
          <rect x="4" y="10" width="11" height="28" fill={c} />
          <rect x="33" y="10" width="11" height="28" fill={c} />
          <rect x="15" y="10" width="18" height="28" fill={c} opacity="0.15" />
          <path
            d="M24 14
               l1.4 3.2
               l3.4 -0.6
               l-1.5 3
               l3.2 1.5
               l-3 1.2
               l0.8 3.2
               l-3.4 -1
               l0.2 4
               l-1.1 -1
               l-1.1 1
               l0.2 -4
               l-3.4 1
               l0.8 -3.2
               l-3 -1.2
               l3.2 -1.5
               l-1.5 -3
               l3.4 0.6
               z"
            fill={c}
            stroke="#fff"
            strokeWidth="0.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "recycle":
      return (
        <svg {...base}>
          <g fill={c}>
            <path d="M24 6 l8 13 l-4 0 l0 4 l-8 0 l0 -4 l-4 0 z" />
            <g transform="rotate(120 24 26)">
              <path d="M24 6 l8 13 l-4 0 l0 4 l-8 0 l0 -4 l-4 0 z" />
            </g>
            <g transform="rotate(240 24 26)">
              <path d="M24 6 l8 13 l-4 0 l0 4 l-8 0 l0 -4 l-4 0 z" />
            </g>
            <circle cx="24" cy="26" r="6" fill="var(--c-surface)" />
          </g>
        </svg>
      );
    default:
      return <svg {...base}><rect x="8" y="8" width="32" height="32" fill={c} /></svg>;
  }
}

// Horizontal 6-node rail rendered on the Home page.
export function ProcessFlowSimple() {
  return (
    <div className="tlpf">
      <div className="tlpf__head" data-reveal="">
        <ParallelRule label="HOW WE DO IT · 6 STEPS" />
        <h2 className="tl-display tl-display--l" style={{ marginTop: 24, maxWidth: "20ch" }}>
          From inquiry to recycling — in six steps.
        </h2>
        <p className="tl-lead" style={{ marginTop: 16 }}>
          Every project moves through the same backbone. Some steps overlap. None get skipped.
        </p>
      </div>

      <div className="tlpf__rail" data-reveal-stagger="">
        {PROC_STEPS.map((s, i) => (
          <div className="tlpf__step" key={s.key}>
            <div className="tlpf__node">
              <span className="tlpf__node-icon"><StepIcon name={s.icon} size={36} /></span>
              <span className="tlpf__node-num">{s.num}</span>
            </div>
            <div className="tlpf__body">
              <h3 className="tlpf__title">{s.title}</h3>
              <p className="tlpf__blurb">{s.shortBlurb}</p>
            </div>
            {i < PROC_STEPS.length - 1 && <span className="tlpf__arrow" aria-hidden="true">→</span>}
          </div>
        ))}
      </div>

      <div className="tlpf__footer" data-reveal="">
        <span className="tl-mono" style={{ color: "var(--c-ink-3)" }}>See the full process →</span>
        <Link href="/cross-border-process" className="tl-btn tl-btn--dark">
          Cross-Border Process page <span className="tl-btn-arr">→</span>
        </Link>
      </div>
    </div>
  );
}

// Zigzag column on the Cross-Border Process page. Each row owns its stem
// segment so vertical lines are exactly as tall as the row's card — no
// measurement, no resize observers.
export function ProcessFlowAdvanced() {
  const containerRef = useRef(null);
  const rowRefs = useRef([]);
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Walk up looking for the actual scroll container; fall back to window.
    let scrollEl = el.parentElement;
    while (scrollEl) {
      const cs = getComputedStyle(scrollEl);
      if ((cs.overflowY === "auto" || cs.overflowY === "scroll") && scrollEl.scrollHeight > scrollEl.clientHeight) break;
      scrollEl = scrollEl.parentElement;
    }
    const onScroll = () => {
      const viewportH = scrollEl ? scrollEl.clientHeight : window.innerHeight;
      let max = -1;
      rowRefs.current.forEach((row, i) => {
        if (!row) return;
        const r = row.getBoundingClientRect();
        if (r.top < viewportH * 0.6) max = Math.max(max, i);
      });
      setActiveStep(max);
    };
    const target = scrollEl || window;
    target.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => target.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={containerRef} className="tlpfx">
      <div className="tlpfx__head" data-reveal="">
        <ParallelRule label="HOW WE DO IT · DETAILED" />
        <h2 className="tl-display tl-display--l" style={{ marginTop: 24, maxWidth: "22ch" }}>
          The full path your material takes.
        </h2>
        <p className="tl-lead" style={{ marginTop: 16, maxWidth: "60ch" }}>
          Six steps, drawn out in full. Each step has its own deliverable, its own parties, and its own typical timing. Scroll to advance the truck.
        </p>
      </div>

      <div className="tlpfx__stage">
        {PROC_STEPS.map((s, i) => {
          const isLeft = i % 2 === 0;
          const active = i <= activeStep;
          const isTruck = i === Math.max(0, activeStep);
          const isFirst = i === 0;
          const isLast = i === PROC_STEPS.length - 1;
          return (
            <div
              key={s.key}
              ref={(el) => (rowRefs.current[i] = el)}
              className="tlpfx__row"
              data-side={isLeft ? "left" : "right"}
              data-active={active ? "1" : "0"}
              data-first={isFirst ? "1" : "0"}
              data-last={isLast ? "1" : "0"}
            >
              <div className="tlpfx__stem">
                <div
                  className="tlpfx__stem-half tlpfx__stem-half--top"
                  data-active={active && !isFirst ? "1" : "0"}
                  data-hidden={isFirst ? "1" : "0"}
                />
                <div className="tlpfx__stem-node" data-active={active ? "1" : "0"} />
                <div
                  className="tlpfx__stem-half tlpfx__stem-half--bot"
                  data-active={i < activeStep ? "1" : "0"}
                  data-hidden={isLast ? "1" : "0"}
                />

                {isTruck && activeStep >= 0 && (
                  <div className="tlpfx__truck" data-active={activeStep >= 0 ? "1" : "0"}>
                    <svg width="40" height="40" viewBox="0 0 40 40">
                      <circle cx="20" cy="20" r="18" fill="var(--c-bg)" stroke="var(--c-accent)" strokeWidth="2" />
                      <g transform="translate(7 11)">
                        <rect x="0" y="4" width="16" height="11" rx="1" fill="var(--c-accent-2)" />
                        <path d="M16 7 h5 l4 4 v4 h-9 z" fill="var(--c-accent-2)" />
                        <circle cx="4" cy="16" r="2.4" fill="#1a1a1a" />
                        <circle cx="21" cy="16" r="2.4" fill="#1a1a1a" />
                        <line x1="-4" y1="7" x2="-1" y2="7" stroke="var(--c-accent-2)" strokeWidth="1.5" />
                        <line x1="-5" y1="11" x2="-1" y2="11" stroke="var(--c-accent-2)" strokeWidth="1.5" opacity="0.6" />
                      </g>
                    </svg>
                  </div>
                )}
              </div>

              <div className="tlpfx__branch" data-active={active ? "1" : "0"} />

              <div className="tlpfx__card-wrap">
                <div className="tlpfx__card">
                  <div className="tlpfx__meta">
                    <span className="tl-mono" style={{ color: "var(--c-blue)" }}>STEP {s.num}</span>
                    <span className="tl-mono tlpfx__when">· {s.typicalTime}</span>
                  </div>
                  <div className="tlpfx__cardrow">
                    <div className="tlpfx__circle" data-active={active ? "1" : "0"}>
                      <StepIcon name={s.icon} size={42} />
                    </div>
                    <h3 className="tlpfx__title">{s.title}</h3>
                  </div>
                  <p className="tlpfx__blurb">{s.longBlurb}</p>
                  <div className="tlpfx__deliv">
                    <span>DELIVERABLE</span>
                    <strong>{s.deliverable}</strong>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
