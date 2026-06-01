// Project Management — service page content. Plain strings + arrays only (no
// JSX); markup lives in the section composition. Body copy is sourced from the
// live millerenvironmental.ca project-management page.

import { EMERGENCY_PHONE, GENERAL_PHONE } from "./brand";

const EMERGENCY_TEL = `tel:${EMERGENCY_PHONE.replace(/[^0-9+]/g, "")}`;

export const projectManagement = {
  slug: "project-management",

  hero: {
    eyebrow: "Project management",
    title: "Engineered projects,",
    titleEm: "start to closeout",
    lead:
      "Miller Environmental operates a Projects Group led by a team of Civil, Chemical, and Processing Engineers with a wealth of knowledge and experience — managing every project type on time and on budget.",
    photo: "/miller/services/project-management-hero.webp",
    emergencyDisplay: EMERGENCY_PHONE,
    emergencyHref: EMERGENCY_TEL,
    secondaryCta: { label: "Contact Miller", labelShort: "Contact", href: "/contact-us/" },
  },

  // §2 — The Projects Group (engineering disciplines + escalation story).
  group: {
    eyebrow: "The Projects Group",
    title: "Engineers who own the outcome",
    lead:
      "Miller's Projects Group has managed a wide variety of projects over the years — on time and on budget. The team also expands on our Emergency Response division, stepping in when an initial response becomes a larger project and priority for our clients.",
    disciplines: [
      { mark: "01", title: "Civil Engineers", body: "Earthworks, containment, and site civil design across every project." },
      { mark: "02", title: "Chemical Engineers", body: "Treatment chemistry and process design for complex waste streams." },
      { mark: "03", title: "Processing Engineers", body: "Plant and process engineering that turns a plan into throughput." },
    ],
  },

  // §3 — Types of projects Miller has managed (unique numbered grid).
  projects: {
    eyebrow: "What we manage",
    title: "Projects we've delivered",
    lead:
      "From a single demolition to a multi-discipline build, the Projects Group has delivered across the full range of environmental and industrial work.",
    items: [
      { num: "01", name: "Demolitions", body: "Controlled teardown and debris management for industrial structures." },
      { num: "02", name: "Lined Holding Ponds", body: "Engineered, lined containment ponds built to specification." },
      { num: "03", name: "Soil Remediation", body: "Excavation and treatment of contaminated soils to standard." },
      { num: "04", name: "Spill Contamination & Abatement", body: "Containment and abatement of hazardous-waste spill contamination." },
      { num: "05", name: "Asbestos Removal", body: "Safe, compliant removal and disposal of asbestos materials." },
      { num: "06", name: "Building Design", body: "In-house design for facilities and supporting structures." },
    ],
  },

  // §4 — Closing CTA (dark dispatch panel + contact form).
  cta: {
    eyebrow: "Contact Miller",
    title: "Scope your next project",
    titleEm: "with our team",
    titleAfter: "today",
    body:
      `Tell us what you're planning and our Projects Group will scope it end to end — or call now at ${GENERAL_PHONE}. When an emergency response becomes a full project, the same team carries it through.`,
    formTitle: "Contact Miller",
    formNote: "A project coordinator will reach out within one business day.",
  },
};
