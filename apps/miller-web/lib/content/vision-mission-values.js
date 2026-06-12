// Vision, Mission and Core Values — v2 about page content (the "company
// creed" page). Plain strings + arrays only (no JSX); markup lives in the
// components-v2 templates this page composes. The v1 module
// (about-vision-mission-and-core-values.js) stays untouched for reference.
// Vision/mission sentences and the four values are the company's real
// published text — do not rewrite their substance.

export const visionMissionValues = {
  slug: "vision-mission-and-core-values",

  // §1 — manifesto masthead over a full-bleed crew photo.
  hero: {
    titleId: "vmv2-hero-title",
    eyebrow: "About Miller",
    title: "What we",
    titleEm: "stand for",
    lead:
      "Two sentences and four values, written down and worked to. This is the measure we hold every truck roll, treatment run, and handshake against.",
    photo: "/miller/vmv/hero-crew.png",
    photoAlt: "Miller crew walking out of the yard together at golden hour",
    photoCaption: "The Miller crew, end of shift",
  },

  // §2/§3 — the creed diptych: vision on cream, mission on walnut. Each
  // sentence renders as display type with a scroll-scrubbed clay marker
  // sweep (the page's scroll signature).
  vision: {
    titleId: "vmv2-vision-title",
    cap: "Vision",
    statement:
      "To be recognized as a trusted provider of sustainable environmental waste and process solutions.",
    // The marker pass lands on this phrase.
    sweep: "trusted provider",
    note: "Recognition is earned in the field — trusted is a word other people use about you.",
  },
  mission: {
    titleId: "vmv2-mission-title",
    cap: "Mission",
    statement:
      "To provide innovative and accountable environmental management solutions that advance an environmentally sustainable world.",
    sweep: "innovative and accountable",
    note: "Innovation without accountability is a liability in this industry. We commit to both in the same breath.",
  },

  // §4 — the four values as a staggered editorial grid with candid crew
  // photography.
  values: {
    titleId: "vmv2-values-title",
    eyebrow: "Core values",
    title: "Four values, worked daily",
    lead:
      "Not poster words. These are the standards the crew holds each other to — on site, in the shop, and at your gate.",
    items: [
      {
        name: "Respect",
        body: "We will treat all fellow team members, the community, our customers, our business partners and the environment with courtesy, dignity and respect.",
        photo: "/miller/vmv/value-respect.png",
        caption: "Trade knowledge, passed on",
      },
      {
        name: "Empowerment & accountability",
        body: "We take personal responsibility for excellence and quality in everything we do and hold ourselves accountable as professionals at all times.",
        photo: "/miller/vmv/value-accountability.png",
        caption: "Signed for, every time",
      },
      {
        name: "Teamwork",
        body: "We rely on each other for our successes, and we encourage diversity of culture, gender and skill set to enable a positive team environment.",
        photo: "/miller/vmv/value-teamwork.png",
        caption: "All hands on the same line",
      },
      {
        name: "Healthy work environment",
        body: "We are committed to providing all team members with a positive, fun and safe work environment.",
        photo: "/miller/vmv/value-environment.png",
        caption: "Before-shift coffee, swept floors",
      },
    ],
  },

  // §5 — close: two doors out (join the crew / put us to work).
  close: {
    titleId: "vmv2-close-title",
    eyebrow: "Hold us to it",
    title: "Words are cheap.",
    titleEm: "Watch us work",
    body:
      "The fastest way to test a company's values is to work with it — or for it.",
    doors: [
      {
        name: "Join the crew",
        text: "Careers at Miller — trades, drivers, technicians, and engineers.",
        cta: "See open roles",
        href: "/careers/",
      },
      {
        name: "Put us to work",
        text: "Talk to the team about your site, your streams, or your next project.",
        cta: "Contact Miller",
        href: "/contact-us/",
      },
    ],
  },
};
