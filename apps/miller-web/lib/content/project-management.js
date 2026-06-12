// Project Management — v2 service page content (the "project dossier" page).
// Plain strings + arrays only (no JSX); markup lives in the components-v2
// templates this page composes. The v1 module (service-project-management.js)
// stays untouched for reference. No leading mono numbers on stacked lists —
// logan's call after the CWC pass.

import { EMERGENCY_PHONE, GENERAL_PHONE } from "./brand";

const EMERGENCY_TEL = `tel:${EMERGENCY_PHONE.replace(/[^0-9+]/g, "")}`;

export const projectManagement = {
  slug: "project-management",

  // §1 — drawing-sheet masthead: light masthead over a full-bleed site photo,
  // with a drafting title block overlapping the photo's lower edge.
  hero: {
    titleId: "pm2-hero-title",
    eyebrow: "The Projects Group",
    title: "Engineered delivery,",
    titleEm: "scope to closeout",
    lead:
      "A Projects Group led by Civil, Chemical, and Processing Engineers — scoping, designing, and delivering environmental and industrial projects on time and on budget, from the first site walk to the signed closeout file.",
    photo: "/miller/pm/hero-site.png",
    photoAlt: "Miller engineers reviewing drawings on a truck tailgate above a lined holding pond under construction",
    emergencyDisplay: EMERGENCY_PHONE,
    emergencyHref: EMERGENCY_TEL,
    cta: { label: "Scope a project", href: "/contact-us/" },
    // Drafting title block — the corner block of a drawing sheet.
    titleblock: {
      caption: "Project record",
      cells: [
        { k: "Group", v: "Miller Projects" },
        { k: "Disciplines", v: "Civil · Chemical · Processing" },
        { k: "Record", v: "On time · on budget" },
        { k: "Escalation", v: "24/7 emergency line" },
      ],
    },
  },

  // §2 — The Projects Group: narrative + discipline ledger beside a field portrait.
  group: {
    titleId: "pm2-group-title",
    eyebrow: "Who runs it",
    title: "Engineers who own the outcome",
    lead:
      "Miller's Projects Group has managed a wide variety of projects over the years — on time and on budget. The engineers who scope your work are the same ones standing on it: one accountable team from estimate to as‑builts.",
    disciplines: [
      {
        name: "Civil engineers",
        body: "Earthworks, containment, and site civil design across every project.",
      },
      {
        name: "Chemical engineers",
        body: "Treatment chemistry and process design for complex waste streams.",
      },
      {
        name: "Processing engineers",
        body: "Plant and process engineering that turns a plan into throughput.",
      },
    ],
    photo: "/miller/pm/group-engineer.png",
    photoCaption: "Field engineering at the work face",
  },

  // §3 — Delivery schedule: the page's scroll-tied signature. Four overlapping
  // phase bars draw across a drafting grid as the band scrolls in; each phase's
  // milestone diamond sets when its bar completes, with handover at p = 1.
  schedule: {
    titleId: "pm2-sched-title",
    eyebrow: "How we deliver",
    title: "One schedule, owned end to end",
    lead:
      "Every project runs on a single accountable schedule. The phases overlap by design — permits move while estimates close, crews mobilize while drawings finish — and the same team carries the file across all four.",
    caption: "Typical delivery arc — phases overlap by design",
    // start/span are % of the schedule lane; bars overlap like a real gantt.
    phases: [
      {
        name: "Scope & estimate",
        body: "Site walk, sampling, and a firm scope with costs you can take to the board.",
        start: 0,
        span: 26,
      },
      {
        name: "Engineering & permits",
        body: "Drawings, treatment design, and regulatory approvals handled in-house.",
        start: 18,
        span: 30,
      },
      {
        name: "Execution",
        body: "Crews, equipment, and subcontract trades managed daily at the work face.",
        start: 40,
        span: 38,
      },
      {
        name: "Closeout & documentation",
        body: "As‑builts, manifests, and a complete compliance file at handover.",
        start: 70,
        span: 30,
      },
    ],
    handoverLabel: "Handover",
  },

  // §4 — Delivered work: asymmetric portfolio grid (2 feature + 4 standard).
  portfolio: {
    titleId: "pm2-work-title",
    eyebrow: "Delivered work",
    title: "Projects we've delivered",
    lead:
      "From a single demolition to a multi-discipline build, the Projects Group has delivered across the full range of environmental and industrial work.",
    items: [
      {
        name: "Demolitions",
        body: "Controlled teardown and debris management for industrial structures.",
        tag: "Structures · Debris",
        photo: "/miller/pm/portfolio-demolition.png",
        feature: true,
      },
      {
        name: "Lined holding ponds",
        body: "Engineered, lined containment ponds built to specification.",
        tag: "Earthworks · Containment",
        photo: "/miller/pm/portfolio-pond.png",
        feature: true,
      },
      {
        name: "Soil remediation",
        body: "Excavation and treatment of contaminated soils to standard.",
        tag: "Excavation · Treatment",
        photo: "/miller/pm/portfolio-soil.png",
      },
      {
        name: "Spill contamination & abatement",
        body: "Containment and abatement of hazardous-waste spill contamination.",
        tag: "Containment · Abatement",
        photo: "/miller/pm/portfolio-spill.png",
      },
      {
        name: "Asbestos removal",
        body: "Safe, compliant removal and disposal of asbestos materials.",
        tag: "Abatement · Disposal",
        photo: "/miller/pm/portfolio-asbestos.png",
      },
      {
        name: "Building design",
        body: "In-house design for facilities and supporting structures.",
        tag: "Design · Build",
        photo: "/miller/pm/portfolio-building.png",
      },
    ],
  },

  // §5 — dark walnut escalation band: the ER → Projects continuity story.
  escalation: {
    titleId: "pm2-esc-title",
    eyebrow: "Response to project",
    title: "When a response becomes",
    titleEm: "a project",
    body:
      "The Projects Group expands on our Emergency Response division. When an initial response grows into a larger scope — a contaminated site, a damaged structure, a long recovery — the same company carries it from the first call to the last signature. No handoff to strangers.",
    meter: { from: "Emergency response", to: "Projects Group" },
    emergencyDisplay: EMERGENCY_PHONE,
    emergencyHref: EMERGENCY_TEL,
    hotlineNote: "Answered by a trained responder — every hour, every day of the year.",
  },

  // §6 — light intake CTA: form beside a what-to-have-ready checklist.
  cta: {
    titleId: "pm2-cta-title",
    eyebrow: "Scope it with us",
    title: "Put your project",
    titleEm: "on our books",
    body:
      `Tell us what you're planning and the Projects Group will scope it end to end — or call ${GENERAL_PHONE} and talk it through first. Either way, you'll deal with the engineers who deliver it.`,
    readyEyebrow: "What to have ready",
    ready: [
      "Site location and access notes",
      "What happened, or what you're planning to build",
      "Any drawings, reports, or sampling data you have",
      "Your timeline and constraints",
    ],
    formTitle: "Project intake",
    formNote: "A project coordinator replies within one business day.",
  },

  // §7 — related services rail (shared, locked).
  related: {
    currentSlug: "project-management",
    titleId: "pm2-related-title",
  },
};
