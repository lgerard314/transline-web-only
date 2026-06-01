// Environmental Remediation — bespoke service page content. Plain strings +
// arrays only (no JSX); markup lives in the section composition. All body copy
// is sourced from the live millerenvironmental.ca remediation page.

import { OVER_25_YEARS, EMERGENCY_PHONE, GENERAL_PHONE } from "./brand";

const EMERGENCY_TEL = `tel:${EMERGENCY_PHONE.replace(/[^0-9+]/g, "")}`;

export const REMEDIATION = {
  slug: "environmental-remediation-services",

  hero: {
    eyebrow: "Environmental remediation",
    title: "Contamination,",
    titleEm: "fully remediated",
    lead:
      `At Miller Environmental Corporation, we specialize in comprehensive environmental remediation tailored to a wide range of contamination scenarios. With ${OVER_25_YEARS.toLowerCase()} of experience, our team delivers safe, dependable, full-service solutions — ensuring regulatory compliance and promoting sustainability on every site.`,
    photo: "/miller/services/remediation-contaminated-soil.webp",
    emergencyDisplay: EMERGENCY_PHONE,
    emergencyHref: EMERGENCY_TEL,
    secondaryCta: { label: "Book a consult", labelShort: "Book a consult", href: "/contact-us/" },
    caption: "Contaminated-soil excavation · Manitoba",
    stat: { value: "25+ yrs", label: "Remediation experience" },
  },

  // §2 — What we do: six remediation capabilities (photo gallery cards).
  whatWeDo: {
    eyebrow: "What we do",
    title: "Six remediation capabilities",
    lead:
      "Our environmental remediation services cover a wide range of contamination and cleanup scenarios — every project planned, executed, and signed off in-house.",
    items: [
      {
        name: "Contaminated Soil Remediation",
        photo: "/miller/what-we-do/contaminated-soil-remediation.png",
        blurb:
          "Safe, effective removal of pollutants from soil at industrial, commercial, and residential sites — assessed individually for minimal impact, cost efficiency, and compliance.",
      },
      {
        name: "Hazardous Material Excavation & Disposal",
        photo: "/miller/what-we-do/hazardous-material-excavation-disposal.png",
        blurb:
          "Heavy metals, PCBs, and industrial chemicals excavated with precision and transported to our fully licensed Vaughn Bullough Environmental Centre.",
      },
      {
        name: "Emergency Spill Response & Cleanup",
        photo: "/miller/what-we-do/emergency-spiill-response-cleanup.png",
        blurb:
          "Rapid 24/7 response for diesel, petroleum hydrocarbons, and chemicals — contained and cleaned from first assessment to final treatment or disposal.",
      },
      {
        name: "Fire-Damaged Site Remediation",
        photo: "/miller/what-we-do/fire-damaged-site-remediation.png",
        blurb:
          "Asbestos, soot, and contaminated runoff removed with advanced techniques that restore fire-damaged sites to a safe, usable condition.",
      },
      {
        name: "Industrial Site Cleanup & Brownfield Prep",
        photo: "/miller/what-we-do/industrial-site-cleanup-brownfield-redevelopment-prep.png",
        blurb:
          "Underutilized, abandoned, or contaminated properties returned to productive use through detailed assessment, planning, and full remediation.",
      },
      {
        name: "Underground Storage Tank (UST) Work",
        photo: "/miller/what-we-do/underground-storage-tank-excavation-soil-remediation.png",
        blurb:
          "Leaks, corrosion, and hazardous contamination addressed end-to-end — tank pull, impacted-soil remediation, and verification under one contract.",
      },
    ],
  },

  // §3 — Industries & situations we serve.
  industries: {
    eyebrow: "Who we serve",
    title: "Industries & situations we serve",
    lead:
      "From a single-site spill to a multi-phase brownfield program, our crews mobilize across Manitoba and Western Canada for the clients who carry the risk.",
    items: [
      "Municipalities & Public Works",
      "Industrial & Manufacturing Facilities",
      "Developers & Construction Firms",
      "Insurance & Claims Adjusters",
      "Agricultural Operations",
      "Transportation & Logistics Companies",
    ],
  },

  // §4 — Our process. Linear 5-step route (rendered as <ol>); one banner per
  // step, cycled in lock-step with the route-line animation.
  process: {
    eyebrow: "Our process",
    title: "Assessment to closure",
    lead:
      "Every remediation runs the same documented route — from the first site inspection to final regulatory sign-off.",
    route: "Assessment → Closure",
    steps: [
      { num: "01", tag: "Plan", name: "Assessment & Planning", body: "Site inspections, Phase II ESA reviews, and Remedial Action Plan (RAP) preparation." },
      { num: "02", tag: "Secure", name: "Containment & Safety", body: "Barriers, berms, air monitoring, and regulatory coordination throughout the work." },
      { num: "03", tag: "Excavate", name: "Specialized Excavation", body: "Hydrovac soft-dig near utilities, deep excavation for heavy metals, and selective demolition." },
      { num: "04", tag: "Treat", name: "Licensed Treatment & Disposal", body: "Contaminated material processed at our licensed hazardous waste treatment facility." },
      { num: "05", tag: "Verify", name: "Verification & Sign-Off", body: "Independent lab testing, third-party oversight, and final regulatory closure." },
    ],
    notifications: [
      { title: "Site assessed", body: "Phase II ESA reviewed and a Remedial Action Plan prepared." },
      { title: "Site secured", body: "Berms, barriers, and air monitoring in place under regulatory oversight." },
      { title: "Excavation underway", body: "Impacted material removed with hydrovac and selective dig." },
      { title: "Treated & disposed", body: "Material processed at the licensed VBEC facility." },
      { title: "Closure signed off", body: "Independent lab testing confirms regulatory closure." },
    ],
  },

  // §5 — Field footage: real Miller Environmental project + brand films.
  videos: {
    eyebrow: "On film",
    title: "Remediation in the field",
    lead:
      "Real Miller crews, real sites. See how a remediation program comes together — and the integrated facility that closes the loop on every load.",
    featured: { id: "VQhFqQjvFHg", title: "Environmental Remediation — Falcon Beach, MB" },
    supporting: [
      { id: "zocx7OaaVPk", title: "Your Trusted Partner for Reliable, Direct Industrial Waste Management" },
      { id: "AchmNsx3rzU", title: "Industrial Waste Management with a Focus on Maximum Recovery" },
    ],
  },

  // §6 — Case studies that prove our expertise.
  caseStudies: {
    eyebrow: "Proof of work",
    title: "Case studies that prove it",
    lead: "Complex, high-risk sites brought back to compliance — under provincial and CCME oversight.",
    items: [
      {
        href: "/case-studies/grain-elevator-remediation-project/",
        title: "Arsenic-Contaminated Soil Removal",
        location: "Grain Elevator, Winnipeg",
        photo: "/miller/case-studies/grain-elevator-arsenic.webp",
      },
      {
        href: "/case-studies/highway-16-diesel-spill-response-remediation/",
        title: "Diesel Spill Remediation",
        location: "Highway 16 Emergency Response",
        photo: "/miller/case-studies/hwy-16-diesel-spill-response.webp",
      },
      {
        href: "/case-studies/steinbach-strip-mall-fire-recovery-restoration-project/",
        title: "Fire Site Hazard Removal",
        location: "Steinbach Strip Mall",
        photo: "/miller/case-studies/steinbach-strip-mall-fire.webp",
      },
      {
        href: "/case-studies/brandon-power-facility/",
        title: "Brandon Power Facility — Lime Removal",
        location: "Brandon, MB",
        photo: "/miller/case-studies/brandon-power-vbec.webp",
      },
    ],
  },

  // §7 — Why choose Miller.
  whyChoose: {
    eyebrow: "Why Miller",
    title: "Why crews call us first",
    items: [
      { mark: "01", title: "Licensed", body: "Our own licensed hazardous waste treatment facility in Manitoba." },
      { mark: "02", title: "Full-service", body: "Demolition, remediation, and disposal under one contract." },
      { mark: "03", title: "Experienced", body: "Decades of proven work on complex, high-risk projects." },
      { mark: "04", title: "Fast", body: "Rapid mobilization and compliance with provincial & CCME standards." },
    ],
  },

  // §8 — Closing CTA (dark dispatch panel + callback form).
  cta: {
    eyebrow: "Request a callback",
    title: "Book a consult or",
    titleEm: "request a callback",
    titleAfter: "today",
    body:
      `Tell us about your site and we'll be in touch — or call now at ${GENERAL_PHONE} for immediate assistance. For an active spill or release, our 24/7 emergency team is standing by.`,
    formTitle: "Request a callback",
    formNote: "A remediation coordinator will reach out within one business day.",
  },
};
