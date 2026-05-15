// Deliberate repetition list — phrases that appear on multiple Miller pages
// by design (design spec §5.4). Centralised here so a re-word touches one
// file. Templates and content modules import from this module instead of
// inlining the strings.
//
// Plain strings only — no JSX, no React. This module is consumed by both
// server components and content modules.

// "Over 25 years" — Home trust eyebrow; Remediation lead; About hero;
// service-page leads (optional).
export const OVER_25_YEARS = "Over 25 years";

// Home hero subhead; footer tagline; contact-page hero.
export const SAFE_DEPENDABLE_ON_TIME =
  "Safe, dependable, and on-time service";

// Home trust eyebrow; QA hero (verbatim); inline trust badge on the five
// regulated-service pages. Verbatim from QA scrape — change here only.
export const ONLY_IN_CANADA_CLAIM =
  "The only hazardous waste management company in Canada with an integrated management system featuring three ISO certifications.";

// Home editorial block (verbatim); QA tracking section (verbatim).
export const CRADLE_TO_GRAVE_PHRASE = "cradle to grave";

// 24/7 emergency line. Lives in EmergencyBanner + Contact-page Phone card +
// final-CTA on home. Not in service-page body copy.
export const EMERGENCY_PHONE = "(204) 957-6327";

// General switchboard. TopNav + Contact + footer.
export const GENERAL_PHONE = "(204) 925-9600";

export const EMAIL_INQUIRIES = "inquiries@millerenvironmental.mb.ca";
export const EMAIL_SALES = "sales@millerenvironmental.mb.ca";
export const EMAIL_HR = "hr@millerenvironmental.mb.ca";

// Full name on first use per page; short form thereafter (design spec §5.4).
export const VBEC_FULL_NAME = "Vaughn Bullough Environmental Centre";
export const VBEC_SHORT = "VBEC";

// Two distinct addresses — corporate office and the treatment facility
// (VBEC). Each as an array of display lines so templates can render
// <address> with line breaks without parsing strings.
export const WINNIPEG_ADDRESS = [
  "Miller Environmental Corporation",
  "1803 Hekla Ave",
  "Winnipeg, MB R2R 0K3",
];

export const VBEC_ADDRESS = [
  "Vaughn Bullough Environmental Centre",
  "Hwy 14 & 75",
  "Saint Jean Baptiste, MB R0G 2B0",
];
