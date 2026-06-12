// Environmental Remediation — v2 service page content (the "site file"
// page). Plain strings + arrays only (no JSX); markup lives in the
// components-v2 templates this page composes. The v1 module
// (service-environmental-remediation.js) stays untouched for reference.
// Case studies and films are REAL — keep their hrefs/ids/photos intact.

import { OVER_25_YEARS, EMERGENCY_PHONE, GENERAL_PHONE, VBEC_SHORT } from "./brand";

const EMERGENCY_TEL = `tel:${EMERGENCY_PHONE.replace(/[^0-9+]/g, "")}`;

export const environmentalRemediation = {
  slug: "environmental-remediation-services",

  // §1 — slab-over-photo masthead: cream content slab overlapping a
  // full-height site photo.
  hero: {
    titleId: "rem2-hero-title",
    eyebrow: "Environmental remediation",
    title: "Contaminated sites,",
    titleEm: "returned to compliance",
    lead:
      `Comprehensive remediation for every contamination scenario — assessment, excavation, licensed treatment, and regulatory sign-off under one operator, with ${OVER_25_YEARS.toLowerCase()} on complex, high-risk sites.`,
    photo: "/miller/rem/hero-site.png",
    photoAlt: "Miller remediation crew excavating impacted soil at a live site",
    emergencyDisplay: EMERGENCY_PHONE,
    emergencyHref: EMERGENCY_TEL,
    cta: { label: "Discuss your site", href: "/contact-us/" },
  },

  // §2 — the page's scroll signature: a before/after restoration wipe of
  // one site, scroll-scrubbed from impacted to closed.
  wipe: {
    titleId: "rem2-wipe-title",
    eyebrow: "The work, measured",
    title: "One site, before and after",
    lead:
      "Remediation is judged by the difference it leaves behind. The same framing, months apart: an impacted excavation taken down to verified clean, backfilled, and finish-graded.",
    before: { src: "/miller/rem/wipe-before.png", label: "Impacted" },
    after: { src: "/miller/rem/wipe-after.png", label: "Closed" },
    caption: "The standard we close to — backfilled, graded, verified",
  },

  // §3 — six capabilities as a type-led ledger grid (the page is
  // image-heavy elsewhere; this section is deliberately typographic).
  capabilities: {
    titleId: "rem2-cap-title",
    eyebrow: "What we do",
    title: "Six remediation capabilities",
    lead:
      "Every scenario planned, executed, and signed off in-house — no patchwork of subcontractors.",
    items: [
      {
        name: "Contaminated soil remediation",
        tag: "Soil · Groundwater",
        body: "Pollutants removed from industrial, commercial, and residential sites — each assessed for method, impact, and compliance.",
      },
      {
        name: "Hazardous material excavation",
        tag: "Metals · PCBs",
        body: `Heavy metals, PCBs, and industrial chemicals excavated with precision and processed at the licensed ${VBEC_SHORT}.`,
      },
      {
        name: "Emergency spill cleanup",
        tag: "24/7 · Response",
        body: "Diesel, hydrocarbons, and chemicals contained and cleaned — first assessment to final treatment or disposal.",
      },
      {
        name: "Fire-damaged site remediation",
        tag: "Asbestos · Soot",
        body: "Asbestos, soot, and contaminated runoff removed; fire-damaged sites restored to safe, usable condition.",
      },
      {
        name: "Brownfield redevelopment prep",
        tag: "Assessment · Cleanup",
        body: "Underutilized or contaminated parcels assessed, remediated, and cleared for productive redevelopment.",
      },
      {
        name: "Underground storage tanks",
        tag: "UST · Removal",
        body: "Tank pull, impacted-soil remediation, and verification handled end to end under one contract.",
      },
    ],
  },

  // §4 — the closure ladder: five steps descending to sign-off, with the
  // cycling notification feed (the device logan loves) running alongside.
  process: {
    titleId: "rem2-proc-title",
    eyebrow: "Our process",
    title: "Assessment to closure",
    lead:
      "Every remediation runs the same documented route — from the first site inspection to final regulatory sign-off.",
    steps: [
      { tag: "Plan", name: "Assessment & planning", body: "Site inspections, Phase II ESA reviews, and Remedial Action Plan preparation." },
      { tag: "Secure", name: "Containment & safety", body: "Barriers, berms, air monitoring, and regulatory coordination throughout." },
      { tag: "Excavate", name: "Specialized excavation", body: "Hydrovac soft-dig near utilities, deep excavation for heavy metals, selective demolition." },
      { tag: "Treat", name: "Licensed treatment & disposal", body: `Contaminated material processed at the licensed ${VBEC_SHORT} facility.` },
      { tag: "Verify", name: "Verification & sign-off", body: "Independent lab testing, third-party oversight, and final regulatory closure." },
    ],
    notifications: [
      { title: "Site assessed", body: "Phase II ESA reviewed and a Remedial Action Plan prepared." },
      { title: "Site secured", body: "Berms, barriers, and air monitoring in place under regulatory oversight." },
      { title: "Excavation underway", body: "Impacted material removed with hydrovac and selective dig." },
      { title: "Treated & disposed", body: "Material processed at the licensed VBEC facility." },
      { title: "Closure signed off", body: "Independent lab testing confirms regulatory closure." },
    ],
  },

  // §5 — proof of work: REAL case studies (live hrefs + library photos).
  cases: {
    titleId: "rem2-case-title",
    eyebrow: "Proof of work",
    title: "Sites we've closed",
    lead: "Complex, high-risk programs brought back to compliance under provincial and CCME oversight.",
    items: [
      {
        href: "/case-studies/grain-elevator-remediation-project/",
        title: "Arsenic-contaminated soil removal",
        location: "Grain elevator · Winnipeg",
        photo: "/miller/custom/arsenic-contaiminated-soil-removal-1.png",
        desc: "Excavation and licensed disposal of arsenic-impacted soil at a decommissioned grain elevator.",
      },
      {
        href: "/case-studies/highway-16-diesel-spill-response-remediation/",
        title: "Diesel spill remediation",
        location: "Highway 16 · Emergency response",
        photo: "/miller/custom/diesel-spill-remediation.png",
        desc: "Rapid containment and recovery of a highway diesel release, restored under CCME standards.",
      },
      {
        href: "/case-studies/steinbach-strip-mall-fire-recovery-restoration-project/",
        title: "Fire site hazard removal",
        location: "Strip mall · Steinbach",
        photo: "/miller/custom/fire-damaged-site-remediation.png",
        desc: "Post-fire hazardous-material abatement and debris removal, clearing the site for restoration.",
      },
      {
        href: "/case-studies/brandon-power-facility/",
        title: "Power facility lime removal",
        location: "Brandon, MB",
        photo: "/miller/home-frame-2-2.webp",
        desc: "Accumulated lime removed and treated through the licensed VBEC for documented disposal.",
      },
    ],
  },

  // §6 — the screening room: REAL films, dark anchor.
  films: {
    titleId: "rem2-film-title",
    eyebrow: "On film",
    title: "Remediation in the field",
    lead:
      "Real Miller crews, real sites — how a program comes together, and the integrated facility that closes the loop on every load.",
    items: [
      {
        id: "VQhFqQjvFHg",
        accent: "Field project",
        title: "Environmental Remediation — Falcon Beach, MB",
        desc: "A full remediation program on a live Manitoba site, from first assessment to final closure.",
      },
      {
        id: "zocx7OaaVPk",
        accent: "Who we are",
        title: "Direct industrial waste management",
        desc: "One accountable partner, full chain of custody.",
      },
      {
        id: "AchmNsx3rzU",
        accent: "At the facility",
        title: "Maximum recovery at the VBEC",
        desc: "Inside the facility where every load is processed for maximum resource recovery.",
      },
    ],
  },

  // §7 — light callback close.
  cta: {
    titleId: "rem2-cta-title",
    eyebrow: "Request a callback",
    title: "Put your site",
    titleEm: "back in compliance",
    body:
      `Tell us about your site and a remediation coordinator will be in touch — or call ${GENERAL_PHONE} for immediate assistance. For an active spill or release, the 24/7 emergency team is standing by.`,
    askEyebrow: "What we'll ask",
    ask: [
      "Site address and current use",
      "What was released, or what you suspect",
      "Any ESA reports or lab data you have",
      "How urgent it is — active release or legacy condition",
    ],
    formTitle: "Request a callback",
    formNote: "A remediation coordinator replies within one business day.",
    emergencyDisplay: EMERGENCY_PHONE,
    emergencyHref: EMERGENCY_TEL,
  },

  // §8 — related services rail (shared, locked).
  related: {
    currentSlug: "environmental-remediation-services",
    titleId: "rem2-related-title",
  },
};
