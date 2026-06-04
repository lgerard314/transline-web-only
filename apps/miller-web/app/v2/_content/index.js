// app/v2/_content/index.js — content for the isolated /v2 award page.
//
// This REshapes the shared template-testing-home content into V2_* objects. The
// rule is additive framing, NOT prose rewriting: every sentence/label below is
// the existing copy; what /v2 adds is the manifest grammar — custody STAGE
// labels, ledger field-heads (the cross-cutting `field — value` line above each
// title), zero-padded lineNo on list items, and v2-specific photo paths. The
// creed is de-statted (the giant 96% number is removed; the vow body stays) so
// the ONE crescendo number lives only in ScaleTally. Reused photos resolve to
// their verified current public/miller/ locations; new photos live in /v2/.

import {
  HERO, CREED, SERVICES_GRID, LIFETIME_SCALE, SECTORS,
  FACILITY, HISTORY, CAREERS, AFFILIATES_BANNER, FINAL_CTA,
} from "@/lib/content/template-testing-home";
import { CERTS } from "@/lib/certs";

// ── 00 · ORIGIN — the manifest header ──────────────────────────────────────
export const V2_HERO = {
  stage: "00 · ORIGIN",
  manifestLine: "MANIFEST № 1996 — ORIGIN · INTAKE",
  titleId: "v2-hero-title",
  photoSrc: "/miller/v2/hero.jpg",
  // existing prose, fixed (no kinetic cycle on /v2 — the seal lands in stillness)
  title: { line1: HERO.title.line1, line2: HERO.title.cyclePhrases[0].text, line3: HERO.title.line3 },
  lead: HERO.lead,
  primaryCta: HERO.primaryCta,
  ghostPhone: HERO.ghostPhone,
  registration: HERO.article, // { strong: "VBEC", rest: " · 64 ha … ISO 9001 · 14001 · 45001" }
  sealLegend: "ISSUED · MILLER ENVIRONMENTAL",
};

// ── 01 · CERTIFIED — the seals ──────────────────────────────────────────────
export const V2_CERTS = {
  stage: "01 · CERTIFIED",
  field: "CERTIFICATIONS ON FILE",
  ariaLabel: "Certifications",
  certs: CERTS, // ISO 9001 / 14001 / 45001 (blue seals kept — sanctioned) + MHCA COR
};

// ── CLAUSE · THE STANDARD — the de-statted vow ──────────────────────────────
export const V2_CREED = {
  field: "CLAUSE — THE STANDARD",
  eyebrow: CREED.eyebrow, // "The Miller difference"
  headingId: "v2-creed-heading",
  statement: CREED.statement, // { lead: "We don’t hand your waste to", em: "someone else" }
  body: CREED.body, // the 96% in-house paragraph (number stays in prose, not as a giant figure)
  // NOTE: CREED.stat intentionally dropped — the crescendo number is ScaleTally only.
};

// ── 02 · SERVICES — the line-item ledger ────────────────────────────────────
export const V2_SERVICES = {
  stage: "02 · SERVICES",
  field: "SERVICES — WHAT WE HANDLE",
  eyebrow: SERVICES_GRID.eyebrow,
  headingId: "v2-services-heading",
  title: SERVICES_GRID.title, // { lead, em }
  intro: SERVICES_GRID.intro,
  items: SERVICES_GRID.services.map((s, i) => ({
    lineNo: String(i + 1).padStart(2, "0"),
    slug: s.slug,
    title: s.title,
    summary: s.summary,
    icon: s.icon,
    href: `/industrial-services/${s.slug}/`,
  })),
  external: {
    lineNo: String(SERVICES_GRID.services.length + 1).padStart(2, "0"),
    title: SERVICES_GRID.externalTile.titleLines.join(" "),
    summary: SERVICES_GRID.externalTile.summary,
    href: SERVICES_GRID.externalTile.href,
    photo: SERVICES_GRID.externalTile.photo,
  },
};

// ── 03 · GENERATORS — who originates the waste (matched 3-photo set) ─────────
// The original SECTORS.lead names exactly three tiers (industrial / public /
// household); the three v2 photos are art-directed to that triptych. Items are
// representative generators drawn from the full SECTOR_CARDS taxonomy.
export const V2_SECTORS = {
  stage: "03 · GENERATORS",
  field: "GENERATORS — WHO WE SERVE",
  eyebrow: SECTORS.eyebrow,
  headingId: "v2-sectors-heading",
  title: SECTORS.title,
  lead: SECTORS.lead,
  cards: [
    {
      lineNo: "01",
      title: "Industrial",
      photo: "/miller/v2/sector-industrial.jpg",
      items: ["Industrial Manufacturing", "Mining", "Oil & Gas", "Transportation & Rail"],
    },
    {
      lineNo: "02",
      title: "Public & Institutional",
      photo: "/miller/v2/sector-public.jpg",
      items: ["Federal & Provincial Agencies", "Crown Insurers", "Biotech & Pharma", "Education & Healthcare"],
    },
    {
      lineNo: "03",
      title: "Community & Household",
      photo: "/miller/v2/sector-household.jpg",
      items: ["Municipal Programs", "Households (HHW)", "Small Business", "Construction & Demolition"],
    },
  ],
};

// ── 04 · TREATMENT — VBEC (dark mid-anchor) ─────────────────────────────────
export const V2_FACILITY = {
  stage: "04 · TREATMENT",
  field: "TREATMENT — VAUGHN BULLOUGH ENVIRONMENTAL CENTRE",
  eyebrow: FACILITY.eyebrow,
  headingId: "v2-facility-heading",
  title: FACILITY.title, // { top: "VBEC", em: "A facility built for the work" }
  lead: FACILITY.lead,
  figures: FACILITY.figures, // [{ label, num, unit } × 3] — oversized-numeral treatment
  capsTitle: FACILITY.capsTitle,
  capabilities: FACILITY.capabilities,
  primaryCta: FACILITY.primaryCta,
  aboutLink: FACILITY.aboutLink,
  photo: { src: FACILITY.photos[0].src, alt: FACILITY.photos[0].alt }, // VBEC aerial (reused, verified)
};

// ── RECORD · SINCE 1996 — the timeline proof (cream) ────────────────────────
export const V2_HISTORY = {
  field: "RECORD — SINCE 1996",
  eyebrow: HISTORY.eyebrow,
  headingId: "v2-history-heading",
  title: HISTORY.title, // { lead, em }
  lead: HISTORY.lead,
  milestones: HISTORY.milestones, // [{ year, title, body } × 11]
  plate: HISTORY.plate, // { imgSrc: full-truck-sideview.png, stats:[{num,unit,label}×3] } — photo, stats on photo
  mission: HISTORY.mission, // { heading, paragraphs[], cta }
};

// ── Σ · TO DATE — THE money shot (dark) ─────────────────────────────────────
// The lifetime "reel": three highlight diamonds that auto-advance once the
// section scrolls into view (D1 lands centred with the long lead below it → D1
// parks left + D2 enters → D2 parks right + D3 enters; final L→R: D1, D3, D2).
// Each diamond carries a short `label` shown beneath it and a longer `reveal`
// paragraph surfaced on hover/tap over the numeral. D1's number/label/reveal are
// the existing LIFETIME_SCALE copy; D2/D3 promote two of the existing support
// stats, with concise reveal prose authored from the same facts.
export const V2_SCALE = {
  field: "Σ — LIFETIME TO DATE",
  eyebrow: LIFETIME_SCALE.eyebrow,
  headingId: "v2-scale-heading",
  highlights: [
    {
      value: LIFETIME_SCALE.figure.value,   // 49
      suffix: LIFETIME_SCALE.figure.suffix, // "M+"
      unit: LIFETIME_SCALE.figure.unit,     // "tons"
      label: "of disposal",
      reveal: LIFETIME_SCALE.body,          // the existing "Hazardous and regulated…" paragraph
    },
    {
      value: 40,
      suffix: "M+",
      unit: "tons",
      label: "recycled",
      reveal: "Over 40 million tons recovered and returned to productive use — sorted and treated for reuse rather than landfilled.",
    },
    {
      value: 100,
      suffix: "%",
      unit: "",
      label: "chain of custody",
      reveal: "Every load tracked end to end — from the generator’s dock to final disposition, under one unbroken, documented chain of custody.",
    },
  ],
};

// ── · THE CREW — the people ─────────────────────────────────────────────────
export const V2_CAREERS = {
  field: "THE CREW — WHO SIGNS THE MANIFEST",
  eyebrow: CAREERS.eyebrow,
  headingId: "v2-careers-heading",
  bleedPhotoSrc: CAREERS.bleedPhotoSrc, // team-at-conv-booth-big-5.jpg (verified)
  title: CAREERS.title, // { lead, em }
  lead: CAREERS.lead,
  cards: CAREERS.cards, // [{ tag, title, text, cta } × 2]
};

// ── · COUNTERSIGNED — affiliates ────────────────────────────────────────────
export const V2_AFFILIATES = {
  field: "COUNTERSIGNED BY",
  ariaLabel: "Affiliates",
  items: AFFILIATES_BANNER.items, // [{ name, src } × 8]
};

// ── · DISPOSITION — the close (dark, signature beat #3) ─────────────────────
export const V2_DISPOSITION = {
  stage: "· DISPOSITION",
  field: "DISPOSITION — FINAL",
  eyebrow: FINAL_CTA.eyebrow,
  headingId: "v2-disposition-heading",
  title: FINAL_CTA.title,
  body: FINAL_CTA.body,
  primaryCta: FINAL_CTA.primaryCta,
  ghostPhone: FINAL_CTA.ghostPhone,
  socials: FINAL_CTA.socials,
  socialsAriaLabel: FINAL_CTA.socialsAriaLabel,
  stamp: "DELIVERED",
};
