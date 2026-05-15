// Environmental Remediation content — verbatim from 04-svc-environmental-remediation.md.
// VBEC short form throughout this module (no need for full name; the
// service page references the facility but never names it formally).

import { OVER_25_YEARS, EMERGENCY_PHONE, GENERAL_PHONE } from "./brand";

export const REMEDIATION = {
  eyebrow: "Service",
  title: "Environmental Remediation Services",
  lead:
    `At Miller Environmental Corporation, we specialize in comprehensive environmental remediation services tailored to address a wide range of contamination scenarios. With ${OVER_25_YEARS.toLowerCase()} of experience, we deliver licensed treatment, regulatory compliance, and rapid mobilization across Manitoba and Western Canada.`,
  photo: "/miller/services/remediation-contaminated-soil.webp",

  whatWeDoIntro:
    "Six specialised remediation capabilities — every project planned, executed, and signed off in-house.",
  whatWeDo: [
    {
      title: "Contaminated Soil Remediation",
      body:
        "Our contaminated soil remediation services focus on the safe and effective removal of pollutants from soil. From hydrocarbon impacts to heavy-metal contamination, we plan, excavate, and treat impacted material to provincial and CCME standards.",
    },
    {
      title: "Hazardous Material Excavation & Disposal",
      body:
        "Miller Environmental provides expert hazardous material excavation and disposal services, handling substances like heavy metals, PCBs, and other regulated waste streams. Materials are tracked from site to licensed treatment.",
    },
    {
      title: "Emergency Spill Response & Cleanup",
      body:
        "In the event of a spill, time is critical for both safety and environmental protection. Our 24/7 response team mobilises with vacuum trucks, containment, and licensed treatment capacity behind it.",
    },
    {
      title: "Fire-Damaged Site Remediation",
      body:
        "Fire-damaged sites pose unique environmental and safety challenges, including the presence of hazardous materials such as asbestos, soot, and chemical residues. We coordinate hazard removal, demolition, and restoration prep.",
    },
    {
      title: "Industrial Site Cleanup & Brownfield Redevelopment Prep",
      body:
        "We provide industrial site cleanup and brownfield redevelopment preparation services, supporting clients in returning legacy industrial properties to safe, productive use.",
    },
    {
      title: "Underground Storage Tank (UST) Excavation & Soil Remediation",
      body:
        "Miller Environmental offers comprehensive underground storage tank excavation and soil remediation services — tank pull, impacted soil management, and verification testing under one contract.",
    },
  ],

  industries: [
    "Municipalities & Public Works",
    "Industrial & Manufacturing Facilities",
    "Developers & Construction Firms",
    "Insurance & Claims Adjusters",
    "Agricultural Operations",
    "Transportation & Logistics Companies",
  ],

  // 5-step process. MUST render as <ol> — design spec §6 a11y rule.
  process: [
    {
      title: "Assessment & Planning",
      body:
        "Site inspections, Phase II ESA reviews, and Remedial Action Plan (RAP) preparation.",
    },
    {
      title: "Containment & Safety",
      body:
        "Barriers, berms, air monitoring, and regulatory coordination throughout the work.",
    },
    {
      title: "Specialized Excavation",
      body:
        "Hydro vac soft-dig near utilities, deep excavation for heavy-metals contamination, and selective demolition.",
    },
    {
      title: "Licensed Treatment & Disposal",
      body:
        "Contaminated material is processed at our licensed hazardous waste treatment facility.",
    },
    {
      title: "Verification & Sign-Off",
      body:
        "Independent lab testing, third-party oversight, and final regulatory closure.",
    },
  ],

  // Case-study rail — 4 cards link to detail routes built in Phase 03.
  caseStudies: [
    {
      href: "/case-studies/brandon-power-facility/",
      title: "Brandon Power Facility — Lime Removal",
      location: "Brandon, MB",
      summary: "Heavy-handed lime contamination managed under tight power-utility constraints.",
    },
    {
      href: "/case-studies/grain-elevator-remediation-project/",
      title: "Arsenic-Contaminated Soil Removal",
      location: "Grain Elevator, Winnipeg",
      summary: "Arsenic-impacted soil excavated and disposed under provincial oversight.",
    },
    {
      href: "/case-studies/highway-16-diesel-spill-response-remediation/",
      title: "Diesel Spill Remediation",
      location: "Highway 16",
      summary: "Emergency mobilisation, containment, and impacted-soil management on a highway corridor.",
    },
    {
      href: "/case-studies/steinbach-strip-mall-fire-recovery-restoration-project/",
      title: "Fire Site Hazard Removal",
      location: "Steinbach Strip Mall",
      summary: "Post-fire hazard removal — asbestos, soot, residual chemicals — for restoration handoff.",
    },
  ],

  whyChoose: [
    {
      title: "Licensed",
      body: "Licensed hazardous waste treatment facility in Manitoba.",
    },
    {
      title: "Full-service",
      body: "Full-service demolition, remediation, and disposal under one contract.",
    },
    {
      title: "Experience",
      body: "Decades of proven experience with complex, high-risk projects.",
    },
    {
      title: "Speed",
      body: "Rapid mobilization and compliance with provincial and CCME standards.",
    },
  ],

  callback: {
    title: "Request a Callback",
    body:
      `Fill out the form to request a callback or book a consult — or call now at ${GENERAL_PHONE} for immediate assistance.`,
    emergency:
      `For our 24/7 spill response team, call ${EMERGENCY_PHONE}.`,
  },
};
