// Template gallery registry — every components-v2 section template, paired with
// FAKE placeholder content and a declarative list of config toggles. The gallery
// (./gallery.jsx) renders each entry at true site width and merges the selected
// toggle values into the template's `config` prop. No real Miller copy is used
// here; image paths point at real /public assets only so the renders aren't broken.
//
// Control model: each `controls` entry is a mutually-exclusive option group. The
// selected option's `value` object is spread into the live config; combining
// several groups composes the final config. `content` is either a plain object or
// a function of the live config (used where the content shape changes by knob,
// e.g. PhotoCardGrid's cardStyle).

import { MonumentHero01 } from "@/components-v2/06_sections/heroes/monument-hero-01";
import { ServiceHero01 } from "@/components-v2/06_sections/heroes/service-hero-01";
import { RotatingBanner01 } from "@/components-v2/06_sections/banners/rotating-banner-01";
import { TallStaticBanner01 } from "@/components-v2/06_sections/banners/tall-static-banner-01";
import { StatementBand01 } from "@/components-v2/06_sections/statements/statement-band-01";
import { ScaleBand01 } from "@/components-v2/06_sections/statements/scale-band-01";
import { MediaSplit01 } from "@/components-v2/06_sections/splits/media-split-01";
import { TimelineSplit01 } from "@/components-v2/06_sections/splits/timeline-split-01";
import { FleetSplit01 } from "@/components-v2/06_sections/splits/fleet-split-01";
import { BentoGrid01 } from "@/components-v2/06_sections/grids/bento-grid-01";
import { HoverCardGrid01 } from "@/components-v2/06_sections/grids/hover-card-grid-01";
import { CapabilityGrid01 } from "@/components-v2/06_sections/grids/capability-grid-01";
import { CapacityLadder01 } from "@/components-v2/06_sections/grids/capacity-ladder-01";
import { FacilityShowcase01 } from "@/components-v2/06_sections/grids/facility-showcase-01";
import { PhotoCardGrid01 } from "@/components-v2/06_sections/grids/photo-card-grid-01";
import { WhyBand01 } from "@/components-v2/06_sections/grids/why-band-01";
import { NumberedCardGrid01 } from "@/components-v2/06_sections/grids/numbered-card-grid-01";
import { MultiColumnCta01 } from "@/components-v2/06_sections/callouts/multi-column-cta-01";
import { PhotoBleedCards01 } from "@/components-v2/06_sections/callouts/photo-bleed-cards-01";
import { DispatchCta01 } from "@/components-v2/06_sections/callouts/dispatch-cta-01";
import { ScheduleCta01 } from "@/components-v2/06_sections/callouts/schedule-cta-01";
import { ProcessFlow01 } from "@/components-v2/06_sections/flows/process-flow-01";
import { ResponseTimeline01 } from "@/components-v2/06_sections/flows/response-timeline-01";
import { PickerGallery01 } from "@/components-v2/06_sections/pickers/picker-gallery-01";
import { VideoPicker01 } from "@/components-v2/06_sections/pickers/video-picker-01";
import { RelatedRail01 } from "@/components-v2/06_sections/rails/related-rail-01";

// ── reusable control fragments ──────────────────────────────────────────────
const off = (label = "Off") => ({ label, value: {} });
const onOff = (key, onLabel = "On") => ({
  key,
  label: key,
  options: [off(), { label: onLabel, value: { [key]: true } }],
});
const schemeDark = {
  key: "scheme",
  label: "Scheme",
  options: [
    { label: "Light", value: {} },
    { label: "Dark", value: { scheme: "dark" } },
  ],
};
const layoutReverse = {
  key: "layout",
  label: "Layout",
  options: [
    { label: "Default", value: {} },
    { label: "Reverse", value: { layout: "reverse" } },
  ],
};

// ── placeholder content ─────────────────────────────────────────────────────

const MONUMENT_HERO = {
  titleId: "tg-monument-hero",
  photoSrc: "/miller/hero/home-frame-1.png",
  mark: { logoSrc: "/miller/logo/miller-logomark.webp", name: "Placeholder Co", corpLong: "Incorporated", corpShort: "Inc.", since: "Since 2001" },
  title: {
    line1: "leaders in",
    cyclePhrases: [{ text: "reliable" }, { text: "scalable", tone: "accent" }, { text: "trusted", tone: "accent" }],
    line3: "placeholder work",
  },
  lead: "Industrial-grade reliability for demo purposes only. Lorem ipsum dolor sit amet — this is generic placeholder copy standing in for real marketing text.",
  primaryCta: { label: "Get a quote", href: "#" },
  ghostPhone: { sup: "24/7 hotline", num: "1-800-000-0000", href: "tel:18000000000" },
  article: { strong: "DEMO", rest: " · placeholder facility · ISO 0000 · 0001 · 0002" },
};

const SERVICE_HERO = {
  titleId: "tg-service-hero",
  eyebrow: "24/7 placeholder service",
  title: "When it happens,",
  titleEm: "we respond fast",
  lead: "Industrial-grade reliability for demo purposes. Lorem ipsum dolor sit amet consectetur — generic placeholder copy standing in for a real service description.",
  photo: "/miller/fleet-trucks-gravel-transparent.png",
  emergencyDisplay: "1-800-000-0000",
  emergencyHref: "tel:18000000000",
  secondaryCta: { label: "Pre-incident planning", labelShort: "Get prepared", href: "#" },
  caption: "Placeholder caption · Demo location",
  video: { id: "VQhFqQjvFHg", title: "Placeholder video title" },
};
// The hero's `photo` is used differently per media mode: transparent-png/video
// want a cut-out PNG placed beside the masthead; photo-bleed wants a full
// edge-to-edge photograph. Swap the asset to match so every mode looks right.
function serviceHeroContent(config) {
  const photo = config.media === "photo-bleed"
    ? "/miller/services/customer-waste-collection-hero.webp"
    : "/miller/fleet-trucks-gravel-transparent.png";
  return { ...SERVICE_HERO, photo };
}

const ROTATING_BANNER = {
  ariaLabel: "Placeholder affiliates",
  label: ["Proud", "partners"],
  items: [
    { name: "Partner One", src: "/miller/affiliations/meia.png" },
    { name: "Partner Two", src: "/miller/affiliations/cme.png" },
    { name: "Partner Three", src: "/miller/affiliations/owma.png" },
  ],
};

const TALL_STATIC_BANNER = {
  ariaLabel: "Placeholder certifications",
  certs: [
    { slug: "iso-demo-9001", name: "ISO 9001:2015", year: "2015", long: "Placeholder Management System", href: "#", sizeKB: 149, mark: "/miller/certs/iso-9001-2015.webp" },
    { slug: "iso-demo-14001", name: "ISO 14001:2015", year: "2015", long: "Placeholder Environmental System", href: "#", sizeKB: 149, mark: "/miller/certs/iso-14001-2015.webp" },
    { slug: "cor-demo", name: "MHCA COR 2023", year: "2023", long: "Placeholder Safety Recognition", href: "#", sizeKB: 9, mark: "/miller/certs/mhca-cor-2023.webp" },
  ],
};

const MEDIA_SPLIT = {
  headingId: "tg-media-split",
  eyebrow: "Placeholder eyebrow",
  title: { top: "HEADLINE", em: "a short emphasized line" },
  lead: "This is placeholder lead copy that introduces the section and sits below the two-line heading.",
  figures: [
    { label: "Footprint", num: "64", unit: "hectares" },
    { label: "Distance", num: "70", unit: "km away" },
    { label: "Operating", num: "1996", unit: "to today" },
  ],
  capsTitle: "Four placeholder capabilities",
  capabilities: ["First capability", "Second capability", "Third capability", "Fourth capability"],
  primaryCta: { longLabel: "Primary action label", shortLabel: "Primary", href: "#" },
  aboutLink: { longLabel: "Secondary text link", shortLabel: "More", href: "#" },
  photos: [
    { src: "/miller/facility/vbec-drone-overview.png", alt: "Drone overview", caption: "Aerial drone overview" },
    { src: "/miller/facility/vbec-office-front.png", alt: "Office front", caption: "Office front entrance" },
    { src: "/miller/facility/vbec-stone-sign.png", alt: "Stone sign", caption: "Entrance stone sign" },
    { src: "/miller/facility/vbec-lake.png", alt: "Lake", caption: "Reflection pond" },
  ],
};

const TIMELINE_SPLIT = {
  headingId: "tg-timeline-split",
  eyebrow: "Placeholder eyebrow",
  title: { lead: "Three decades in", em: "the placeholder field" },
  lead: "Placeholder lead copy describing the company history shown in the timeline to the left.",
  timelineNote: "*hover for more info",
  milestones: [
    { year: "1996", title: "Founding milestone", body: "Placeholder description of the first milestone in the company timeline." },
    { year: "2007", title: "Expansion milestone", body: "Placeholder description of a later expansion milestone." },
    { year: "2019", title: "Capacity milestone", body: "Placeholder description of a capacity-related milestone." },
    { year: "2025", title: "Recent milestone", body: "Placeholder description of the most recent milestone." },
  ],
  plate: {
    imgSrc: "/miller/full-truck-sideview.png",
    stats: [
      { num: "25", unit: "+yrs", label: "Placeholder A" },
      { num: "96", unit: "%", label: "Placeholder B" },
      { num: "4.5", unit: "ML/yr", label: "Placeholder C" },
    ],
  },
  mission: {
    heading: "Mission",
    paragraphs: [
      "First placeholder mission paragraph describing the overarching goal.",
      "Second placeholder mission paragraph about values and approach.",
      "Third placeholder mission paragraph about community and trust.",
    ],
    cta: { label: "Read the placeholder story", href: "#" },
  },
};

const FLEET_SPLIT = {
  titleId: "tg-fleet-split",
  eyebrow: "The fleet",
  title: "Placeholder fleet headline",
  lead: "Placeholder lead copy describing the equipment fleet and how it is mobilized to a site.",
  items: [
    { mark: "01", name: "First unit type", body: "Placeholder description of the first piece of equipment and what it does." },
    { mark: "02", name: "Second unit type", body: "Placeholder description of the second piece of equipment and its use." },
    { mark: "03", name: "Third unit type", body: "Placeholder description of a third unit in the fleet." },
  ],
  mediaPhoto: "/miller/industrial-vaccum-truck-transparent.png",
};

const BENTO = {
  headingId: "tg-bento",
  eyebrow: "Services",
  title: { lead: "everything you need,", em: "in one place" },
  intro: "A short placeholder intro paragraph describing the breadth of the offering across the full grid of services shown below.",
  services: [
    { id: "svc-01", slug: "service-one", title: "Service One Alpha", summary: "Placeholder summary for the first service tile in the grid.", photo: "/miller/services/industrial-waste-treatment-hero.webp" },
    { id: "svc-02", slug: "service-two", title: "Service Two Beta", summary: "Placeholder summary for the second service tile.", photo: "/miller/services/remediation-contaminated-soil.webp" },
    { id: "svc-03", slug: "service-three", title: "Service Three Gamma", summary: "Placeholder summary for the third service tile.", photo: "/miller/fleet-trucks-gravel-transparent.png" },
    { id: "svc-04", slug: "service-four", title: "Service Four Delta", summary: "Placeholder summary for the fourth service tile.", photo: "/miller/services/vacuum-truck-hero.webp" },
    { id: "svc-05", slug: "service-five", title: "Service Five Epsilon", summary: "Placeholder summary for the fifth service tile.", photo: "/miller/services/specialty-recycling-hero.webp" },
    { id: "svc-06", slug: "service-six", title: "Service Six Zeta", summary: "Placeholder summary for the sixth service tile.", photo: "/miller/services/research-development-hero.webp" },
    { id: "svc-07", slug: "service-seven", title: "Service Seven Eta", summary: "Placeholder summary for the seventh service tile.", photo: "/miller/services/stewardship-hero.webp" },
    { id: "svc-08", slug: "service-eight", title: "Service Eight Theta", summary: "Placeholder summary for the eighth service tile.", photo: "/miller/services/customer-waste-collection-hero.webp" },
    { id: "svc-09", slug: "service-nine", title: "Service Nine Iota", summary: "Placeholder summary for the ninth service tile.", photo: "/miller/services/industrial-cleaning-hero.jpeg" },
    { id: "svc-10", slug: "service-ten", title: "Service Ten Kappa", summary: "Placeholder summary for the tenth service tile.", photo: "/miller/services/project-management-hero.webp" },
  ],
  externalTile: { href: "https://example.com", photo: "/miller/services/vacuum-truck-new-logo.webp", titleLines: ["Cross-Border", "Services"], summary: "Placeholder summary for the external cross-border tile that links offsite." },
};

const HOVERCARD = {
  headingId: "tg-hovercard",
  eyebrow: "Who we serve",
  title: "From one end of the market to the other",
  lead: "A short placeholder lead describing the range of sectors served, sitting beside the rotating stat cycle on the right.",
  stats: [
    { label: "Active clients", value: "450+", text: "Placeholder stat description for the first rotating figure." },
    { label: "Total volume", value: "49M+", unit: "tons", text: "Placeholder stat description for the second rotating figure." },
    { label: "Recovered", value: "40M+", unit: "tons", text: "Placeholder stat description for the third rotating figure." },
  ],
  cards: [
    { title: "Group One", items: [
      { slug: "industrial-manufacturing", name: "Industrial Manufacturing" },
      { slug: "mining", name: "Mining" },
      { slug: "oil-and-gas", name: "Oil & Gas" },
      { slug: "chemical-distribution", name: "Chemical Distribution" },
    ] },
    { title: "Group Two", items: [
      { slug: "aerospace-and-defence", name: "Aerospace & Defence" },
      { slug: "agriculture", name: "Agriculture" },
      { slug: "biotech-and-pharma", name: "Biotech & Pharma" },
      { slug: "households", name: "Households" },
    ] },
    { title: "Group Three", items: [
      { slug: "crown-insurers", name: "Crown Insurers" },
      { slug: "education-and-healthcare", name: "Education & Healthcare" },
      { slug: "federal-and-provincial-agencies", name: "Federal & Provincial Agencies" },
      { slug: "construction-and-demolition", name: "Construction & Demolition" },
    ] },
  ],
};

const CAPABILITY = {
  titleId: "tg-capability",
  eyebrow: "Capabilities",
  title: "What we handle",
  lead: "A short placeholder lead introducing the capability groups, with the first group rendered as a large feature card.",
  groups: [
    { heading: "Feature Group Alpha", photo: "/miller/facility/cap-specialty-soil.webp", body: "Placeholder body paragraph describing the featured capability group in a sentence or two.", items: ["Capability one", "Capability two", "Capability three", "Capability four", "Capability five", "Capability six"] },
    { heading: "Group Beta", photo: "/miller/facility/cap-inorganic.webp", items: ["Item one", "Item two", "Item three"] },
    { heading: "Group Gamma", photo: "/miller/facility/cap-liquid-organic.webp", items: ["Item one", "Item two", "Item three", "Item four"] },
    { heading: "Group Delta", photo: "/miller/facility/cap-solid-organic.webp", body: "Optional placeholder body for this grid card.", items: ["Item one", "Item two"] },
  ],
};

const CAPACITY = {
  titleId: "tg-capacity",
  eyebrow: "Any volume",
  title: "From the smallest container to a full load",
  lead: "A short placeholder lead explaining that service scales across container sizes, illustrated by the proportional ladder below.",
  headPhoto: "/miller/dumptruck-2.png",
  tiers: [
    { glyph: "pail", name: "Pails", spec: "≤ 20 L", fill: 16, note: "Placeholder note for the smallest tier." },
    { glyph: "drum", name: "Drums", spec: "205 L", fill: 42, note: "Placeholder note for the mid tier." },
    { glyph: "tote", name: "Totes / IBC", spec: "1,000 L", fill: 72, note: "Placeholder note for the larger tier." },
    { glyph: "van", name: "Van loads", spec: "Bulk", fill: 100, note: "Placeholder note for the largest tier." },
  ],
};

const FACILITY = {
  titleId: "tg-facility",
  eyebrow: "The facility",
  title: "Built for the whole job",
  lead: "A single location handles intake, sorting, and processing — sized to take everything from a single container to a full bulk load without rerouting the work.",
  photo: "/miller/facility/vbec-aerial.webp",
  caption: "Sample facility caption line",
  stats: [
    { value: "160", unit: "acres", label: "Sample footprint metric" },
    { value: "1", unit: "site", label: "Everything under one roof" },
    { value: "24/7", unit: "intake", label: "Round-the-clock capacity" },
    { value: "200+", unit: "loads", label: "Processed every week" },
  ],
  processEyebrow: "Treatment processes",
  processes: ["Intake", "Sorting", "Processing", "Recovery", "Disposal"],
};

const PCG_THUMB = {
  titleId: "tg-photocard",
  eyebrow: "What we respond to",
  title: "Prepared for the call\nyou hope never comes",
  headMedia: "/miller/pickup-truck-transparent-removebg.png",
  lead: "Placeholder lead describing the range of situations these cards cover, in one short sentence.",
  cta: { label: "Talk to us", href: "#" },
  items: [
    { name: "Chemical\nspills", blurb: "Placeholder blurb describing this response type.", photo: "/miller/chemical-spills.png" },
    { name: "Fuel\nreleases", blurb: "Placeholder blurb describing this response type.", photo: "/miller/fuel-and-diesel-spills.png" },
    { name: "Transport\nincidents", blurb: "Placeholder blurb describing this response type.", photo: "/miller/transport-incidents.png" },
    { name: "Industrial\nleaks", blurb: "Placeholder blurb describing this response type.", photo: "/miller/industrial-leaks.png" },
  ],
};
const PCG_GALLERY = {
  titleId: "tg-photocard",
  eyebrow: "Who we serve",
  title: "Built for regulated generators",
  headMedia: "/miller/pickup-truck-transparent-removebg.png",
  lead: "Placeholder lead sentence about the sectors served by this gallery grid.",
  cta: { label: "Talk to us", href: "#" },
  items: [
    { name: "Manufacturing", photo: "/miller/industrial-leaks.png", blurb: "Placeholder sector blurb, one line." },
    { name: "Aerospace", photo: "/miller/dangerous-goods.png", blurb: "Placeholder sector blurb, one line." },
    { name: "Agriculture", photo: "/miller/contaminated-soul.png", blurb: "Placeholder sector blurb, one line." },
    { name: "Healthcare", photo: "/miller/hazmat-cleaning.png", blurb: "Placeholder sector blurb, one line." },
  ],
};
const PCG_WWD = {
  titleId: "tg-photocard",
  eyebrow: "What we do",
  title: "Six sample capabilities",
  headMedia: "/miller/pickup-truck-transparent-removebg.png",
  lead: "Placeholder lead sentence introducing the hover-swap capability cards.",
  cta: { label: "Talk to us", href: "#" },
  items: [
    { name: "Capability One", photo: "/miller/what-we-do/contaminated-soil-remediation.png", blurb: "Short rest-state blurb shown before hover.", detail: "Longer placeholder paragraph revealed on hover, describing the capability in full sentences for demo purposes." },
    { name: "Capability Two", photo: "/miller/what-we-do/hazardous-material-excavation-disposal.png", blurb: "Short rest-state blurb shown before hover.", detail: "Longer placeholder paragraph revealed on hover, describing the capability in full sentences for demo purposes." },
    { name: "Capability Three", photo: "/miller/what-we-do/emergency-spiill-response-cleanup.png", blurb: "Short rest-state blurb shown before hover.", detail: "Longer placeholder paragraph revealed on hover, describing the capability in full sentences for demo purposes." },
    { name: "Capability Four", photo: "/miller/what-we-do/fire-damaged-site-remediation.png", blurb: "Short rest-state blurb shown before hover.", detail: "Longer placeholder paragraph revealed on hover, describing the capability in full sentences for demo purposes." },
  ],
};
const PCG_CASE = {
  titleId: "tg-photocard",
  eyebrow: "Proof of work",
  title: "Sample case studies",
  headMedia: "/miller/pickup-truck-transparent-removebg.png",
  lead: "Placeholder lead sentence introducing the case-study cards.",
  cta: { label: "All case studies", href: "#" },
  items: [
    { href: "#sample-one", title: "Sample Project One", location: "Sample Location, MB", photo: "/miller/case-studies/grain-elevator-arsenic.webp", desc: "Placeholder one-sentence summary of the case study." },
    { href: "#sample-two", title: "Sample Project Two", location: "Sample Location, MB", photo: "/miller/case-studies/hwy-16-diesel-spill-response.webp", desc: "Placeholder one-sentence summary of the case study." },
    { href: "#sample-three", title: "Sample Project Three", location: "Sample Location, MB", photo: "/miller/case-studies/steinbach-strip-mall-fire.webp", desc: "Placeholder one-sentence summary of the case study." },
    { href: "#sample-four", title: "Sample Project Four", location: "Sample Location, MB", photo: "/miller/case-studies/brandon-power-vbec.webp", desc: "Placeholder one-sentence summary of the case study." },
  ],
};
function photoCardContent(config) {
  switch (config.cardStyle) {
    case "gallery": return PCG_GALLERY;
    case "wwd": return PCG_WWD;
    case "case": return PCG_CASE;
    default: return PCG_THUMB;
  }
}

const WHY_BAND = {
  titleId: "tg-why",
  eyebrow: "Why choose us",
  title: "Why crews call first",
  lead: "Placeholder lead sentence summarizing the value proposition for the band.",
  highlights: [
    { label: "Licensed", value: "ABC", text: "Placeholder highlight description sentence." },
    { label: "Full-service", value: "One", unit: "contract", text: "Placeholder highlight description sentence." },
    { label: "Experienced", value: "25+", unit: "years", text: "Placeholder highlight description sentence." },
    { label: "Fast", value: "24/7", text: "Placeholder highlight description sentence." },
  ],
  items: [
    { mark: "01", title: "Reason One", body: "Placeholder body sentence for this reason." },
    { mark: "02", title: "Reason Two", body: "Placeholder body sentence for this reason." },
    { mark: "03", title: "Reason Three", body: "Placeholder body sentence for this reason." },
    { mark: "04", title: "Reason Four", body: "Placeholder body sentence for this reason." },
  ],
};

const NUMBERED = {
  titleId: "tg-numbered",
  eyebrow: "What we manage",
  title: "Projects we've delivered",
  lead: "Placeholder lead sentence describing the range of work in this numbered grid.",
  items: [
    { num: "01", name: "Sample Project Type One", body: "Placeholder body sentence describing this project type." },
    { num: "02", name: "Sample Project Type Two", body: "Placeholder body sentence describing this project type." },
    { num: "03", name: "Sample Project Type Three", body: "Placeholder body sentence describing this project type." },
    { num: "04", name: "Sample Project Type Four", body: "Placeholder body sentence describing this project type." },
    { num: "05", name: "Sample Project Type Five", body: "Placeholder body sentence describing this project type." },
    { num: "06", name: "Sample Project Type Six", body: "Placeholder body sentence describing this project type." },
  ],
};

const MULTI_COLUMN_CTA = {
  headingId: "tg-multicol",
  truckImgSrc: "/miller/truck-graphic-angled.png",
  logoImgSrc: "/miller/logo/miller-logomark.webp",
  eyebrow: "Reach out",
  title: "Let's start the conversation.",
  body: "Routine service, a scheduled job, or an urgent call — one number connects you to the whole team.",
  primaryCta: { label: "Get in touch", href: "#" },
  ghostPhone: { sup: "24/7 hotline", num: "1-800-555-0100", href: "tel:18005550100" },
  socials: [
    { label: "Facebook", href: "#", path: "M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" },
    { label: "LinkedIn", href: "#", path: "M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" },
    { label: "X", href: "#", path: "M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.6.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" },
  ],
  socialsAriaLabel: "Follow us on social media",
};

const PHOTO_BLEED = {
  headingId: "tg-photobleed",
  bleedPhotoSrc: "/miller/careers/team-at-conv-booth-big-5.jpg",
  eyebrow: "Careers",
  title: { lead: "Build a career", em: "that matters" },
  lead: "We hire people who take pride in doing the work right. Competitive pay, room to grow, and a team that has your back.",
  cards: [
    { tag: "Culture", title: "Why work here", text: "A diverse, inclusive team where every perspective moves the work forward.", cta: { label: "Life on the team", href: "#" } },
    { tag: "Hiring now", title: "Open positions", text: "Ready to share our mission? Explore the roles we're filling right now.", cta: { label: "See openings", href: "#" } },
  ],
};

const DISPATCH_CTA = {
  titleId: "tg-dispatch",
  eyebrow: "Don't wait for trouble",
  title: "Save our number",
  titleEm: "before",
  titleAfter: "you need it",
  body: "Program our 24/7 line into your phone today. When minutes matter, one call puts a trained crew on the road.",
  formTitle: "Request a callback",
  formNote: "Quotes, planning, and general questions — we'll be in touch.",
  emergencyHref: "tel:18005550100",
  emergencyDisplay: "1-800-555-0100",
  hotlineNote: "Answered by a trained responder — every hour, every day of the year.",
  showOptionalFields: false,
};

const SCHEDULE_CTA = {
  titleId: "tg-schedule",
  eyebrow: "Get on the schedule",
  title: "Set up a regular",
  titleEm: "pickup",
  body: "Tell us what you generate and how often. We'll build a cadence that keeps your site compliant and your volume under control.",
  formTitle: "Request a pickup schedule",
  nextEyebrow: "What happens next",
  next: [
    { num: "01", name: "We review your streams", text: "A coordinator looks over your waste types and site — usually within one business day." },
    { num: "02", name: "We confirm a cadence", text: "You get a schedule sized to how fast you generate, from a one-time clear-out to weekly service." },
    { num: "03", name: "Your first pickup runs", text: "Technicians pack, label, and manifest every container for compliant transport." },
  ],
};

const PROCESS_FLOW = {
  titleId: "tg-process",
  eyebrow: "How it works",
  title: "Four steps from request to result",
  lead: "Every job runs the same documented route — from the first call to a signed record at the gate.",
  route: "Your site → Facility",
  steps: [
    { num: "01", tag: "Intake", name: "Profile", body: "Tell us your streams, volumes, and site so nothing is a surprise on the day." },
    { num: "02", tag: "Cadence", name: "Schedule", body: "We set a cadence that matches how fast you generate — one-off or recurring." },
    { num: "03", tag: "On-site", name: "Package & manifest", body: "Technicians pack, label, and document every container for compliant transport." },
    { num: "04", tag: "Transport", name: "Move to facility", body: "Dedicated trucks move the load under documented chain of custody." },
  ],
  notifications: [
    { title: "Streams profiled", body: "Waste types and volumes logged — service sized to your site." },
    { title: "Pickup scheduled", body: "A cadence is set. Your next window is booked." },
    { title: "Packed & manifested", body: "Containers labelled and documented for transport." },
    { title: "En route", body: "Dedicated truck rolling to the facility under chain of custody." },
  ],
  interval: 3000,
};

const RESPONSE_TIMELINE = {
  titleId: "tg-response",
  eyebrow: "When you call",
  title: "From your call to all-clear",
  lead: "Every incident is different — but the response cadence never changes. Answered fast, dispatched fast, contained first.",
  steps: [
    { t: "T + 0", name: "Call answered", body: "A real responder picks up — 24/7, no queue. We capture location, material, and scale." },
    { t: "Mobilize", name: "Crew dispatched", body: "The nearest trained crew and equipment roll out toward the site." },
    { t: "On site", name: "Contain first", body: "Stop the spread — booms and berms to secure the source and protect drains." },
    { t: "Recover", name: "Clean up", body: "Recover product, treat impacted soil, and decontaminate the affected area." },
    { t: "Close out", name: "Dispose & document", body: "Material moves under documented chain of custody, with a full incident record." },
  ],
  notifications: [
    { title: "Live on the line", body: "A responder is on the line. Estimated arrival: 45 min." },
    { title: "Crew en route", body: "Nearest crew is en route with containment gear. ETA: 38 min." },
    { title: "On site now", body: "Crew on site — booms deployed and the source is secured." },
    { title: "Recovery underway", body: "Recovery underway. Impacted soil is being excavated and treated." },
    { title: "Closing the loop", body: "Material routed for disposal. Full incident record in progress." },
  ],
  interval: 3000,
};

const PICKER_GALLERY = {
  titleId: "tg-picker",
  eyebrow: "Who we serve",
  title: "Placeholder industries\nwe serve",
  lead: "Placeholder lead copy describing the industries served, shown beside an interactive photo picker.",
  cta: { label: "Discuss your placeholder", href: "#" },
  phoneHref: "tel:18005551234",
  phoneDisplay: "1-800-555-1234",
  items: [
    { text: "First industry", photo: "/miller/who-we-serve-industries/industrial-manufacturing.png", bigAnchor: "50% 50%", thumbAnchor: "50% 50%", caption: "Placeholder caption describing the first industry served.", default: true },
    { text: "Second industry", photo: "/miller/who-we-serve-industries/municipal-programs.png", bigAnchor: "50% 50%", thumbAnchor: "50% 50%", caption: "Placeholder caption describing the second industry served." },
    { text: "Third industry", photo: "/miller/who-we-serve-industries/construction-and-demolition.png", bigAnchor: "50% 50%", thumbAnchor: "50% 50%", caption: "Placeholder caption describing the third industry served." },
    { text: "Fourth industry", photo: "/miller/who-we-serve-industries/agriculture.png", bigAnchor: "50% 50%", thumbAnchor: "50% 50%", caption: "Placeholder caption describing the fourth industry served." },
  ],
};

const VIDEO_PICKER = {
  titleId: "tg-video",
  eyebrow: "On film",
  title: "Placeholder video headline",
  lead: "Placeholder lead copy introducing the video gallery; selecting a card on the left loads it in the player.",
  films: [
    { id: "VQhFqQjvFHg", accent: "Field project", title: "First placeholder film title", desc: "Placeholder one-line description of the first film." },
    { id: "zocx7OaaVPk", accent: "Who we are", title: "Second placeholder film title", desc: "Placeholder one-line description of the second film." },
    { id: "AchmNsx3rzU", accent: "At the facility", title: "Third placeholder film title", desc: "Placeholder one-line description of the third film." },
  ],
};

const RELATED_RAIL = { currentSlug: "emergency-response", titleId: "tg-related" };

const STATEMENT_BAND = {
  headingId: "tg-statement",
  eyebrow: "Placeholder eyebrow",
  statement: { lead: "A short editorial statement that", em: "lands hard" },
  body: "Placeholder supporting sentence beneath the oversized statement — one short prose line that frames the figure on the right.",
  stat: { label: "Sample metric", value: "96", unit: "%", note: "placeholder note · three short tokens" },
};

const SCALE_BAND = {
  headingId: "tg-scale",
  eyebrow: "Placeholder eyebrow · since 0000",
  figure: { value: 49, suffix: "M+", unit: "units" },
  body: "Placeholder supporting sentence beneath the hero figure — one short prose line describing what the big number measures.",
  support: [
    { value: "40M+", label: "Sample metric one" },
    { value: "450+", label: "Sample metric two" },
    { value: "96%", label: "Sample metric three" },
  ],
};

// ── registry ────────────────────────────────────────────────────────────────
export const GROUPS = ["Heroes", "Banners", "Statements", "Splits", "Grids", "Callouts", "Flows", "Pickers", "Rails"];

export const GALLERY = [
  // Heroes
  { group: "Heroes", name: "MonumentHero01", path: "components-v2/06_sections/heroes/monument-hero-01.jsx", Component: MonumentHero01, content: MONUMENT_HERO, controls: [{ key: "tokens", label: "Accent", options: [{ label: "Default", value: {} }, { label: "Token override", value: { tokens: { "--c-accent": "#7a3d12" } } }] }] },
  // ServiceHero01 is the "alert masthead" every service page ships — it only
  // looks right with alert on, so the control defaults (index 0) reproduce ER's
  // production config: transparent-png · alert · ghostPhone. No defaultConfig:
  // it would fight these (an "Off" {} option can't clear a key set there).
  { group: "Heroes", name: "ServiceHero01", path: "components-v2/06_sections/heroes/service-hero-01.jsx", Component: ServiceHero01, content: serviceHeroContent, controls: [
    { key: "media", label: "Media", options: [{ label: "Transparent PNG", value: { media: "transparent-png" } }, { label: "Photo bleed", value: { media: "photo-bleed" } }, { label: "Video", value: { media: "video" } }] },
    { key: "alert", label: "Alert", options: [{ label: "On", value: { alert: true } }, off()] },
    onOff("photoHalf"),
    onOff("reveal"),
    { key: "ghostPhone", label: "ghostPhone", options: [{ label: "On", value: { ghostPhone: true } }, off()] },
  ] },

  // Banners
  { group: "Banners", name: "RotatingBanner01", path: "components-v2/06_sections/banners/rotating-banner-01.jsx", Component: RotatingBanner01, content: ROTATING_BANNER, controls: [schemeDark] },
  { group: "Banners", name: "TallStaticBanner01", path: "components-v2/06_sections/banners/tall-static-banner-01.jsx", Component: TallStaticBanner01, content: TALL_STATIC_BANNER, controls: [schemeDark] },

  // Statements
  { group: "Statements", name: "StatementBand01", path: "components-v2/06_sections/statements/statement-band-01.jsx", Component: StatementBand01, content: STATEMENT_BAND, controls: [] },
  { group: "Statements", name: "ScaleBand01", path: "components-v2/06_sections/statements/scale-band-01.jsx", Component: ScaleBand01, content: SCALE_BAND, controls: [] },

  // Splits
  { group: "Splits", name: "MediaSplit01", path: "components-v2/06_sections/splits/media-split-01.jsx", Component: MediaSplit01, content: MEDIA_SPLIT, controls: [
    layoutReverse,
    { key: "scheme", label: "Scheme", options: [{ label: "Warm", value: {} }, { label: "Cream", value: { scheme: "cream" } }, { label: "Dark", value: { scheme: "dark" } }] },
  ] },
  { group: "Splits", name: "TimelineSplit01", path: "components-v2/06_sections/splits/timeline-split-01.jsx", Component: TimelineSplit01, content: TIMELINE_SPLIT, controls: [schemeDark] },
  { group: "Splits", name: "FleetSplit01", path: "components-v2/06_sections/splits/fleet-split-01.jsx", Component: FleetSplit01, content: FLEET_SPLIT, controls: [] },

  // Grids
  { group: "Grids", name: "BentoGrid01", path: "components-v2/06_sections/grids/bento-grid-01.jsx", Component: BentoGrid01, content: BENTO, controls: [schemeDark] },
  { group: "Grids", name: "HoverCardGrid01", path: "components-v2/06_sections/grids/hover-card-grid-01.jsx", Component: HoverCardGrid01, content: HOVERCARD, controls: [layoutReverse, schemeDark] },
  { group: "Grids", name: "CapabilityGrid01", path: "components-v2/06_sections/grids/capability-grid-01.jsx", Component: CapabilityGrid01, content: CAPABILITY, controls: [] },
  { group: "Grids", name: "CapacityLadder01", path: "components-v2/06_sections/grids/capacity-ladder-01.jsx", Component: CapacityLadder01, content: CAPACITY, controls: [] },
  { group: "Grids", name: "FacilityShowcase01", path: "components-v2/06_sections/grids/facility-showcase-01.jsx", Component: FacilityShowcase01, content: FACILITY, controls: [] },
  { group: "Grids", name: "PhotoCardGrid01", path: "components-v2/06_sections/grids/photo-card-grid-01.jsx", Component: PhotoCardGrid01, content: photoCardContent, defaultConfig: { cardStyle: "thumb", head: "media-split" }, controls: [
    { key: "cardStyle", label: "Card style", options: [
      { label: "Thumb", value: { cardStyle: "thumb" } },
      { label: "Gallery", value: { cardStyle: "gallery" } },
      { label: "What-we-do", value: { cardStyle: "wwd", variant: "mw-rem-wwd" } },
      { label: "Case study", value: { cardStyle: "case", variant: "mw-rem-case" } },
    ] },
    { key: "head", label: "Head", options: [{ label: "Media split", value: { head: "media-split" } }, { label: "Split", value: { head: "split" } }] },
    onOff("trailingCta"),
  ] },
  // Defaults to PM's real combo (statCycle off · numbered · three-up); the bare
  // no-variant state renders with a low-contrast inverted eyebrow, so it's an
  // option but not the default.
  { group: "Grids", name: "WhyBand01", path: "components-v2/06_sections/grids/why-band-01.jsx", Component: WhyBand01, content: WHY_BAND, controls: [
    onOff("statCycle"),
    { key: "marker", label: "Marker", options: [{ label: "Number", value: { marker: "number" } }, { label: "None", value: {} }] },
    { key: "variant", label: "Variant", options: [{ label: "Three-up", value: { variant: "mw-why--3up" } }, { label: "Remediation", value: { variant: "mw-why--rem" } }, { label: "Default", value: {} }] },
  ] },
  { group: "Grids", name: "NumberedCardGrid01", path: "components-v2/06_sections/grids/numbered-card-grid-01.jsx", Component: NumberedCardGrid01, content: NUMBERED, controls: [] },

  // Callouts
  { group: "Callouts", name: "MultiColumnCta01", path: "components-v2/06_sections/callouts/multi-column-cta-01.jsx", Component: MultiColumnCta01, content: MULTI_COLUMN_CTA, controls: [layoutReverse, schemeDark] },
  { group: "Callouts", name: "PhotoBleedCards01", path: "components-v2/06_sections/callouts/photo-bleed-cards-01.jsx", Component: PhotoBleedCards01, content: PHOTO_BLEED, controls: [] },
  { group: "Callouts", name: "DispatchCta01", path: "components-v2/06_sections/callouts/dispatch-cta-01.jsx", Component: DispatchCta01, content: DISPATCH_CTA, controls: [
    { key: "reverse", label: "Layout", options: [{ label: "Form left", value: { reverse: true } }, { label: "Form right", value: { reverse: false } }] },
  ] },
  { group: "Callouts", name: "ScheduleCta01", path: "components-v2/06_sections/callouts/schedule-cta-01.jsx", Component: ScheduleCta01, content: SCHEDULE_CTA, controls: [] },

  // Flows
  { group: "Flows", name: "ProcessFlow01", path: "components-v2/06_sections/flows/process-flow-01.jsx", Component: ProcessFlow01, content: PROCESS_FLOW, controls: [onOff("wide")] },
  { group: "Flows", name: "ResponseTimeline01", path: "components-v2/06_sections/flows/response-timeline-01.jsx", Component: ResponseTimeline01, content: RESPONSE_TIMELINE, controls: [] },

  // Pickers
  { group: "Pickers", name: "PickerGallery01", path: "components-v2/06_sections/pickers/picker-gallery-01.jsx", Component: PickerGallery01, content: PICKER_GALLERY, controls: [onOff("serve")] },
  { group: "Pickers", name: "VideoPicker01", path: "components-v2/06_sections/pickers/video-picker-01.jsx", Component: VideoPicker01, content: VIDEO_PICKER, controls: [] },

  // Rails
  { group: "Rails", name: "RelatedRail01", path: "components-v2/06_sections/rails/related-rail-01.jsx", Component: RelatedRail01, content: RELATED_RAIL, controls: [] },
];
