// apps/miller-web/lib/content/template-testing-home.js
// Sandbox content for /template-testing. These arrays are COPIED from the
// inline, non-exported consts in app/(home)/ section files (which cannot be
// imported without editing them). Exported, importable HOME/SERVICES/CERTS
// content is imported directly by the v2 sections, not duplicated here.

import { HOME } from "@/app/(home)/home";
import { SERVICES } from "@/lib/services";
import { CERTS } from "@/lib/certs";
import { EMERGENCY_PHONE } from "@/lib/content/brand";

const EMERGENCY_HREF = `tel:${EMERGENCY_PHONE.replace(/[^0-9+]/g, "")}`;

function orderedServices() {
  const map = new Map(SERVICES.map((s) => [s.slug, s]));
  const head = HOME_FIRST.map((slug) => map.get(slug)).filter(Boolean);
  const rest = SERVICES.filter((s) => !HOME_FIRST.includes(s.slug)).sort((a, b) =>
    a.title.localeCompare(b.title),
  );
  return [...head, ...rest];
}

// HOME_FIRST — the services-section ordering for the home BentoGrid (now the source of truth; formerly mirrored in the old app/(home)/sections/02-services.jsx).
export const HOME_FIRST = [
  "industrial-waste-treatment",
  "environmental-remediation-services",
  "emergency-response",
];

export const SECTOR_CARDS = [
  { title: "Industrial", items: [
    { slug: "industrial-manufacturing", name: "Industrial Manufacturing" },
    { slug: "mining", name: "Mining" },
    { slug: "oil-and-gas", name: "Oil & Gas" },
    { slug: "chemical-distribution", name: "Chemical Distribution" },
  ] },
  { title: "Infrastructure", items: [
    { slug: "aerospace-and-defence", name: "Aerospace & Defence" },
    { slug: "transportation-and-rail", name: "Transportation & Rail" },
    { slug: "utlities-and-power", name: "Utilities & Power" },
    { slug: "agriculture", name: "Agriculture" },
  ] },
  { title: "Institutional", items: [
    { slug: "biotech-and-pharma", name: "Biotech & Pharma" },
    { slug: "crown-insurers", name: "Crown Insurers" },
    { slug: "federal-and-provincial-agencies", name: "Federal & Provincial Agencies" },
    { slug: "education-and-healthcare", name: "Education & Healthcare" },
  ] },
  { title: "Community", items: [
    { slug: "small-business", name: "Small Business" },
    { slug: "households", name: "Households (HHW)" },
    { slug: "municipal-programs", name: "Municipal Programs" },
    { slug: "construction-and-demolition", name: "Construction & Demolition" },
  ] },
];

export const FACILITY_PHOTOS = [
  { src: "/miller/vbec-drone-overview.png", alt: "VBEC drone overview", caption: "Aerial drone overview" },
  { src: "/miller/vbec-office-front-aerial.png", alt: "Office front, aerial view", caption: "Office front, from above" },
  { src: "/miller/vbec-office-front.png", alt: "Office front, ground view", caption: "Office front entrance" },
  { src: "/miller/vbec-stone-sign.png", alt: "Vaughn Bullough Environmental Centre stone sign", caption: "Entrance stone sign" },
  { src: "/miller/vbec-lake.png", alt: "Lake on the VBEC grounds", caption: "Reflection pond on the grounds" },
  { src: "/miller/vbec-windmills-1.png", alt: "Wind turbines visible from VBEC", caption: "Wind turbines on the horizon" },
];

export const MILESTONES = [
  { year: "1996", title: "Founding year", body: "The Province of Manitoba and Miller Paving sign a 50/50 partnership creating Miller Environmental Corporation, announced January 10, 1996." },
  { year: "1997", title: "Vaughn Bullough hired as GM", body: "Bullough builds the operation into Manitoba’s only fully-licensed hazardous-waste operator, leading it for twenty-five years." },
  { year: "2007", title: "Winnipeg Service Centre opens", body: "The Hekla Avenue centre opens as the company’s public-facing base and a licensed PCB-storage and waste-coordination hub." },
  { year: "2015", title: "Licence 58 HW S2 RRRR", body: "Manitoba posts the core treatment-facility operating licence — the regulatory backbone for everything that follows." },
  { year: "2017", title: "Federal disposal contract won", body: "MEC wins a federal Hazardous Waste Disposal Services contract, since amended through 2026." },
  { year: "2019 — 2022", title: "Processing Cell 5 commissioned", body: "A new engineered processing cell is constructed and licensed, expanding treatment, storage, and disposal capacity at the Montcalm facility." },
  { year: "August 2022", title: "Treatment Facility → VBEC", body: "The flagship facility is renamed the Vaughn Bullough Environmental Centre in recognition of Vaughn Bullough’s 25-year leadership." },
  { year: "2023", title: "MHCA COR safety certification", body: "MEC earns its MHCA COR 2023 safety certification and joins the Mining Association of Manitoba, broadening its sector standing." },
  { year: "2024", title: "MEIA Lifetime Achievement Award", body: "President Paul Bauer receives the MEIA Lifetime Achievement Award, anchoring the company’s credibility with regulators and large generators." },
  { year: "May 2025", title: "Solvent recycling online", body: "Manitoba approves an in-province solvent-recovery system reclaiming up to 4.5 million litres annually — moving MEC up the waste hierarchy." },
  { year: "February 2026", title: "Charting the path forward", body: "President Paul Bauer lays out the company’s strategy, with 96% of waste now managed in-house." },
];

export const AFFILIATES = [
  { name: "Manitoba Environmental Industries Association", src: "/miller/affiliations/meia.png" },
  { name: "Canadian Manufacturers & Exporters", src: "/miller/affiliations/cme.png" },
  { name: "Manitoba Chamber of Commerce", src: "/miller/affiliations/manitoba-chamber.png" },
  { name: "Winnipeg Chamber of Commerce", src: "/miller/affiliations/winnipeg-chamber.png" },
  { name: "Construction Safety Association of Manitoba", src: "/miller/affiliations/csam.png" },
  { name: "Manitoba Trucking Association", src: "/miller/affiliations/mta.png" },
  { name: "Ontario Waste Management Association", src: "/miller/affiliations/owma.png" },
  { name: "Commitment To Opportunity, Diversity & Equity", src: "/miller/affiliations/code.png" },
];

export const SOCIALS = [
  { label: "Facebook", href: "https://www.facebook.com/millerenvironmentalcorporation", path: "M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" },
  { label: "Instagram", href: "https://www.instagram.com/millerenvironmentalcorporation/", path: "M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0h.003zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.281.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z" },
  { label: "X", href: "https://x.com/MillerEnviron", path: "M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.6.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/miller-environmental-corporation", path: "M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" },
  { label: "YouTube", href: "https://www.youtube.com/@MillerEnvironmental", path: "M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.108-.082 2.06l-.008.105-.009.104c-.05.572-.124 1.14-.235 1.558a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.167-.128-2.654-.26a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.42c1.123-.302 5.288-.332 6.11-.335zM6.4 5.209v4.818l4.157-2.408L6.4 5.209z" },
];

export const HERO = {
  titleId: "mw-hero-title",
  photoSrc: "/miller/home-frame-1.png",
  mark: {
    logoSrc: "/miller/logo/miller-logomark-1.webp",
    name: "Miller Environmental",
    corpLong: "Corporation",
    corpShort: "Corp.",
    since: "Since 1996",
  },
  title: {
    line1: "leaders in",
    cyclePhrases: [{ text: "hazardous" }, { text: "safe", tone: "accent" }, { text: "reliable", tone: "accent" }],
    line3: "waste disposal",
  },
  lead: "Twenty-five years of licensed hazardous waste management in Manitoba. Three ISO certifications. One documented chain of custody from your loading dock to final disposition at VBEC.",
  primaryCta: { label: "Talk to Miller", href: "/contact-us/" },
  ghostPhone: { sup: "24/7 emergency", num: EMERGENCY_PHONE, href: EMERGENCY_HREF },
  article: { strong: "VBEC", rest: " · 64 ha, Montcalm MB · ISO 9001 · 14001 · 45001" },
};

export const CERTS_BANNER = { ariaLabel: "Certifications", certs: CERTS };

export const CREED = {
  headingId: "mw-creed-heading",
  eyebrow: "The Miller difference",
  statement: { lead: "We don’t hand your waste to", em: "someone else" },
  body: "Ninety-six percent of every stream is treated, recycled, or disposed in-house at VBEC — one operator, one documented chain of custody, from intake to final disposition.",
  stat: { label: "Managed in-house", value: "96", unit: "%", note: "treated · recycled · disposed under one roof" },
};

export const LIFETIME_SCALE = {
  headingId: "mw-scale-heading",
  eyebrow: "Lifetime impact · since 1996",
  figure: { value: 49, suffix: "M+", unit: "tons" },
  body: "Hazardous and regulated waste collected, treated, and dispositioned under one documented chain of custody — the measured weight of Manitoba’s first licensed hazardous-waste operation.",
  support: [
    { value: "40M+", label: "Tons recycled" },
    { value: "450+", label: "Active clients" },
    { value: "100%", label: "Chain of custody" },
  ],
};

export const LIFETIME_REEL = {
  headingId: "mw-lifetime-reel-heading",
  srHeading: "Lifetime impact since 1996",
  eyebrow: LIFETIME_SCALE.eyebrow,   // "Lifetime impact · since 1996"
  highlights: [
    { value: 49, suffix: "M+", unit: "tons", label: "of disposal", reveal: LIFETIME_SCALE.body },
    { value: 40, suffix: "M+", unit: "tons", label: "recycled", reveal: "Over 40 million tons recovered and returned to productive use — sorted and treated for reuse rather than landfilled." },
    { value: 100, suffix: "%", unit: "", label: "chain of custody", reveal: "Every load tracked end to end — from the generator’s dock to final disposition, under one unbroken, documented chain of custody." },
  ],
};

export const SERVICES_GRID = {
  headingId: "mw-services-heading",
  eyebrow: "Services",
  title: { lead: "whatever your waste needs,", em: "we’ve got you covered" },
  intro: "From routine industrial streams to one-off emergency calls, Miller’s licensed VBEC facility and field crews handle the full spectrum — collection, treatment, and final disposition, all under one roof.",
  services: orderedServices(),
  externalTile: {
    href: "https://www.transline49.com",
    photo: "/miller/vacuum-truck-new-logo-2.webp",
    titleLines: ["Cross-Border", "Services"],
    summary: "Transboundary movement of waste from the United States to Canada to mitigate your US liabilities.",
  },
};

export const SECTORS = {
  headingId: "mw-sectors-heading-copy",
  eyebrow: "Who we serve",
  title: "From refineries to households — and everything between",
  lead: "Large industrial manufacturers, public agencies, small businesses, and even the household-hazardous-waste drop-off down the street — one operator, one chain of custody.",
  cards: SECTOR_CARDS,
};

export const FACILITY = {
  headingId: "mw-facility-heading-copy",
  eyebrow: "Vaughn Bullough Environmental Centre",
  title: { top: "VBEC", em: "A facility built for the work" },
  lead: HOME.vbec.body,
  figures: [
    { label: "Footprint", num: "64", unit: "hectares" },
    { label: "Location", num: "70", unit: "km S of Winnipeg" },
    { label: "Operating", num: "1996", unit: "to today" },
  ],
  capsTitle: "7 powerful capabilities",
  capabilities: HOME.vbec.capabilities,
  primaryCta: { longLabel: HOME.vbec.cta.label, shortLabel: "Visit Facility", href: HOME.vbec.cta.href },
  aboutLink: { longLabel: HOME.vbec.aboutLinkLabel, shortLabel: "Read the story", href: HOME.vbec.aboutHref },
  photos: FACILITY_PHOTOS,
};

export const HISTORY = {
  headingId: "mw-tenure-heading-copy-b",
  eyebrow: "Our history",
  title: { lead: "Three decades in", em: "hazardous waste" },
  lead: "Miller Environmental was formed in 1996 as Manitoba’s first private-public hazardous-waste operator. Vaughn Bullough joined as General Manager in 1997 and led operations for twenty-five years. The facility was renamed in his honour in 2022. The work continues.",
  timelineNote: "*hover for more info",
  milestones: MILESTONES,
  plate: {
    imgSrc: "/miller/full-truck-sideview.png",
    stats: [
      { num: "25", unit: "+yrs", label: "Relationships" },
      { num: "96", unit: "%", label: "In-house" },
      { num: "4.5", unit: "ML/yr", label: "Solvent reclaimed" },
    ],
  },
  mission: {
    heading: "Mission",
    paragraphs: [
      "At Miller Environmental, our mission is to lead the hazardous waste disposal industry by exemplifying unwavering commitment to environmentally responsible practices, rigorous regulatory compliance, and continuous innovation.",
      "We prioritize safety in all operations, ensuring the well-being of our team, clients, and the communities we serve.",
      "Our dedication to transparency fosters trust, while active community engagement reflects our belief in shared responsibility.",
    ],
    cta: HOME.mission.cta,
  },
};

export const CAREERS = {
  headingId: "mw-careers-bleed-heading",
  bleedPhotoSrc: "/miller/team-at-conv-booth-big-5.jpg",
  eyebrow: "Careers",
  title: { lead: "Join the", em: "Miller team" },
  lead: HOME.joinFamily.intro,
  cards: [
    { tag: "Culture", title: HOME.joinFamily.whyTitle, text: HOME.joinFamily.whyBody, cta: HOME.joinFamily.whyCta },
    { tag: "Hiring now", title: HOME.joinFamily.opportunitiesTitle, text: HOME.joinFamily.opportunitiesBody, cta: HOME.joinFamily.opportunitiesCta },
  ],
};

export const AFFILIATES_BANNER = { ariaLabel: "Affiliates", label: ["Proud", "affiliates"], items: AFFILIATES };

export const FINAL_CTA = {
  headingId: "mw-final-heading",
  truckImgSrc: "/miller/truck-graphic-angled.png",
  logoImgSrc: "/miller/logo/miller-logomark-1.webp",
  eyebrow: HOME.finalCta.eyebrow,
  title: HOME.finalCta.title,
  body: HOME.finalCta.body,
  primaryCta: { label: "Contact Miller", href: HOME.finalCta.contactHref },
  ghostPhone: { sup: "24/7 emergency", num: HOME.finalCta.emergencyDisplay, href: HOME.finalCta.emergencyHref },
  socials: SOCIALS,
  socialsAriaLabel: "Miller Environmental on social media",
};
