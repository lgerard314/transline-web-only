// Environmental Remediation — bespoke service page content. Plain strings +
// arrays only (no JSX); markup lives in the section composition. All body copy
// is sourced from the live millerenvironmental.ca remediation page.

import { OVER_25_YEARS, EMERGENCY_PHONE, GENERAL_PHONE, VBEC_SHORT } from "./brand";

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
    caption: "Remediation in the field · Falcon Beach, MB",
    titleId: "rem-hero-title",
    video: { id: "VQhFqQjvFHg", title: "Environmental Remediation — Falcon Beach, MB" },
  },

  // §2 — What we do: six remediation capabilities. Full-bleed photo cards whose
  // overlay swaps from a short blurb to the full capability paragraph on hover.
  whatWeDo: {
    titleId: "rem-wwd-title",
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
        detail:
          "Our contaminated soil remediation services focus on the safe and effective removal of pollutants from soil in a range of industrial, commercial, and residential sites. We assess each site individually to determine the most appropriate method, ensuring minimal environmental impact, cost efficiency, and compliance with local regulations. By restoring soil health and stability, we contribute to the protection of groundwater resources, support sustainable land use, and strengthen the overall ecosystem.",
      },
      {
        name: "Hazardous Material Excavation & Disposal",
        photo: "/miller/what-we-do/hazardous-material-excavation-disposal.png",
        blurb:
          "Heavy metals, PCBs, and industrial chemicals excavated with precision and transported to our fully licensed Vaughn Bullough Environmental Centre.",
        detail:
          "Miller Environmental provides expert hazardous material excavation and disposal services, handling substances like heavy metals, PCBs, and industrial chemicals with precision and safety. Our certified professionals use state-of-the-art equipment and industry-leading techniques to safely excavate contaminated materials before transporting them to our fully licensed waste processing facility (the Vaugn Bullough Environmental Centre). Our meticulous approach mitigates environmental risks, prevents further contamination, and supports sustainable waste management practices for diverse project types and sizes.",
      },
      {
        name: "Emergency Spill Response & Cleanup",
        photo: "/miller/what-we-do/emergency-spiill-response-cleanup.png",
        blurb:
          "Rapid 24/7 response for diesel, petroleum hydrocarbons, and chemicals — contained and cleaned from first assessment to final treatment or disposal.",
        detail:
          "In the event of a spill, time is critical for both safety and environmental protection. Miller Environmental offers rapid, 24/7 emergency spill response services for various substances, including diesel, petroleum hydrocarbons, and chemicals. Our trained personnel are equipped to contain and clean up spills promptly, minimizing environmental damage and ensuring strict compliance with safety regulations. We manage the entire process, from initial assessment to final cleanup and proper treatment or disposal of all contaminated materials.",
      },
      {
        name: "Fire-Damaged Site Remediation",
        photo: "/miller/what-we-do/fire-damaged-site-remediation.png",
        blurb:
          "Asbestos, soot, and contaminated runoff removed with advanced techniques that restore fire-damaged sites to a safe, usable condition.",
        detail:
          "Fire-damaged sites pose unique environmental and safety challenges, including the presence of hazardous materials such as asbestos and contaminated runoff. Miller Environmental specializes in comprehensive fire-damaged site remediation, employing advanced techniques to safely remove debris, treat hazardous materials, and restore the site to a safe, usable condition. Our team works diligently to address all aspects of fire-related contamination, ensuring environmental safety, compliance with regulations, and long-term site sustainability for redevelopment or safe reuse.",
      },
      {
        name: "Industrial Site Cleanup & Brownfield Prep",
        photo: "/miller/what-we-do/industrial-site-cleanup-brownfield-redevelopment-prep.png",
        blurb:
          "Underutilized, abandoned, or contaminated properties returned to productive use through detailed assessment, planning, and full remediation.",
        detail:
          "We provide industrial site cleanup and brownfield redevelopment preparation services, transforming underutilized, abandoned, or contaminated properties into viable, productive spaces for communities and businesses. Our services include detailed site assessment, remediation planning, and full implementation, adhering strictly to environmental standards, safety protocols, and local regulations. By revitalizing brownfield sites through proven remediation techniques, we contribute to sustainable urban development, community revitalization, environmental protection, and the creation of safe spaces for future growth.",
      },
      {
        name: "Underground Storage Tank (UST) Work",
        photo: "/miller/what-we-do/underground-storage-tank-excavation-soil-remediation.png",
        blurb:
          "Leaks, corrosion, and hazardous contamination addressed end-to-end — tank pull, impacted-soil remediation, and verification under one contract.",
        detail:
          "Miller Environmental offers comprehensive underground storage tank (UST) excavation and soil remediation services, addressing issues such as leaks, corrosion, and hazardous contamination. Our team conducts thorough site assessments, safely removes USTs, and remediates affected soil using industry-leading processes tailored to each site’s needs. We ensure all activities comply with environmental regulations, protecting public health, preserving surrounding ecosystems, and enabling safe reuse or redevelopment of the property for future projects.",
      },
    ],
  },

  // §3 — Who we serve. Coverage-gallery layout: the industry list doubles as a
  // picker that swaps the large photo on the right.
  whoWeServe: {
    titleId: "rem-serve-title",
    eyebrow: "Who we serve",
    title: "Industries & situations\nwe serve",
    lead:
      "From a single-site spill to a multi-phase brownfield program, our crews mobilize across Manitoba and Western Canada for the clients who carry the risk.",
    cta: { label: "Discuss your site", href: "/contact-us/" },
    provides: [
      {
        text: "Municipalities & Public Works",
        photo: "/miller/who-we-serve-industries/municipal-programs.png",
        bigAnchor: "50% 50%",
        thumbAnchor: "50% 50%",
        caption: "Public-works departments and municipal sites returned to compliance after spills, fuel releases, and aging infrastructure.",
      },
      {
        text: "Industrial & Manufacturing Facilities",
        photo: "/miller/who-we-serve-industries/industrial-manufacturing.png",
        bigAnchor: "50% 50%",
        thumbAnchor: "50% 50%",
        caption: "Plants and manufacturing facilities remediated around live operations — from process leaks to legacy soil contamination.",
        default: true,
      },
      {
        text: "Developers & Construction Firms",
        photo: "/miller/who-we-serve-industries/construction-and-demolition.png",
        bigAnchor: "50% 50%",
        thumbAnchor: "50% 50%",
        caption: "Developers and builders cleared to break ground — contaminated and brownfield parcels assessed and remediated for redevelopment.",
      },
      {
        text: "Insurance & Claims Adjusters",
        photo: "/miller/who-we-serve-industries/crown-insurers.png",
        bigAnchor: "50% 50%",
        thumbAnchor: "50% 50%",
        caption: "Adjusters and insurers supported with fast, fully documented cleanup and reporting on environmental claims.",
      },
      {
        text: "Agricultural Operations",
        photo: "/miller/who-we-serve-industries/agriculture.png",
        bigAnchor: "50% 50%",
        thumbAnchor: "50% 50%",
        caption: "Farm and acreage sites restored after fuel, chemical, and equipment-related contamination.",
      },
      {
        text: "Transportation & Logistics Companies",
        photo: "/miller/who-we-serve-industries/transportation-and-rail.png",
        bigAnchor: "50% 50%",
        thumbAnchor: "50% 50%",
        caption: "Carriers and logistics operators served after highway and rail releases — corridors cleared and impacted soil treated.",
      },
    ],
  },

  // §4 — Our process. Linear 5-step route (rendered as <ol>); one banner per
  // step, cycled in lock-step with the route-line animation.
  process: {
    titleId: "rem-steps-title",
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

  // §5 — On film: real Miller Environmental project + brand films. Left-column
  // picker cards swap the large player on the right.
  videos: {
    titleId: "rem-vid-title",
    eyebrow: "On film",
    title: "Remediation in the field",
    lead:
      "Real Miller crews, real sites. See how a remediation program comes together — and the integrated facility that closes the loop on every load.",
    films: [
      {
        id: "VQhFqQjvFHg",
        accent: "Field project",
        title: "Environmental Remediation — Falcon Beach, MB",
        desc: "A full remediation program on a live Manitoba site, from first assessment to final closure.",
      },
      {
        id: "zocx7OaaVPk",
        accent: "Who we are",
        title: "Your trusted partner for reliable, direct industrial waste management",
        desc: "How Miller handles industrial waste directly — one accountable partner, full chain of custody.",
      },
      {
        id: "AchmNsx3rzU",
        accent: "At the facility",
        title: "Industrial waste management with a focus on maximum recovery",
        desc: "Inside the VBEC, where every load is processed for the maximum possible resource recovery.",
      },
    ],
  },

  // §6 — Case studies that prove our expertise.
  caseStudies: {
    titleId: "rem-case-title",
    eyebrow: "Proof of work",
    title: "Case studies that prove it",
    lead: "Complex, high-risk sites brought back to compliance — under provincial and CCME oversight.",
    items: [
      {
        href: "/case-studies/grain-elevator-remediation-project/",
        title: "Arsenic-Contaminated Soil Removal",
        location: "Grain Elevator, Winnipeg",
        photo: "/miller/case-studies/grain-elevator-arsenic.webp",
        desc: "Excavation and licensed disposal of arsenic-impacted soil at a decommissioned grain elevator, returning the site to provincial compliance.",
      },
      {
        href: "/case-studies/highway-16-diesel-spill-response-remediation/",
        title: "Diesel Spill Remediation",
        location: "Highway 16 Emergency Response",
        photo: "/miller/case-studies/hwy-16-diesel-spill-response.webp",
        desc: "Rapid containment and recovery of a highway diesel release, with impacted soil treated and the corridor restored under CCME standards.",
      },
      {
        href: "/case-studies/steinbach-strip-mall-fire-recovery-restoration-project/",
        title: "Fire Site Hazard Removal",
        location: "Steinbach Strip Mall",
        photo: "/miller/case-studies/steinbach-strip-mall-fire.webp",
        desc: "Post-fire hazardous-material abatement and debris removal at a commercial strip mall, clearing the site for safe restoration.",
      },
      {
        href: "/case-studies/brandon-power-facility/",
        title: "Brandon Power Facility — Lime Removal",
        location: "Brandon, MB",
        photo: "/miller/case-studies/brandon-power-vbec.webp",
        desc: "Removal and treatment of accumulated lime at a power facility, processed through our licensed VBEC for documented disposal.",
      },
    ],
  },

  // §7 — Why choose Miller.
  whyChoose: {
    titleId: "rem-why-title",
    eyebrow: "Why Miller",
    title: "Why crews call us first",
    lead:
      "One operator from first assessment through treatment, transport, and regulatory sign-off — not a patchwork of subcontractors.",
    highlights: [
      {
        label: "Licensed",
        value: VBEC_SHORT,
        text: "Our own licensed hazardous waste treatment facility in Manitoba — every load documented through chain of custody.",
      },
      {
        label: "Full-service",
        value: "One",
        unit: "contract",
        text: "Demolition, remediation, and disposal coordinated under a single operator.",
      },
      {
        label: "Experienced",
        value: "25+",
        unit: "years",
        text: "Decades of proven work on complex, high-risk remediation programs.",
      },
      {
        label: "Fast",
        value: "24/7",
        text: "Rapid mobilization and compliance with provincial and CCME standards.",
      },
    ],
    items: [
      { mark: "01", title: "Licensed", body: "Our own licensed hazardous waste treatment facility in Manitoba." },
      { mark: "02", title: "Full-service", body: "Demolition, remediation, and disposal under one contract." },
      { mark: "03", title: "Experienced", body: "Decades of proven work on complex, high-risk projects." },
      { mark: "04", title: "Fast", body: "Rapid mobilization and compliance with provincial & CCME standards." },
    ],
  },

  // §8 — Closing CTA (dark dispatch panel + callback form).
  cta: {
    titleId: "rem-cta-title",
    eyebrow: "Request a callback",
    title: "Book a consult or",
    titleEm: "request a callback",
    titleAfter: "today",
    body:
      `Tell us about your site and we'll be in touch — or call now at ${GENERAL_PHONE} for immediate assistance. For an active spill or release, our 24/7 emergency team is standing by.`,
    formTitle: "Request a callback",
    formNote: "A remediation coordinator will reach out within one business day.",
    hotlineNote: "Answered by a trained responder — every hour, every day of the year.",
  },

  // §9 — Related services rail.
  related: {
    currentSlug: "environmental-remediation-services",
    titleId: "rem-related-title",
  },
};
