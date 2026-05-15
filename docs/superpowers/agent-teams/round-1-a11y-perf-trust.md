# Round 1 review — Accessibility, Performance, Trust

## Verdict

**Approve with required changes.** The spec has a coherent a11y baseline (skip link, focus trap, labeled inputs) and a sane static-first performance posture, but three categories of risk are under-scoped: (1) the `EmergencyBanner` is the most-touched element on the site and the spec under-specifies its semantics, focus order, and viewport behavior; (2) the per-route 150 KB budget collides with the Remediation page shape and five Google Font families; (3) ISO certificates and the VBEC/Vaughn Bullough lineage — Miller's strongest trust signals — risk decorative treatment unless the spec mandates real PDF hrefs and surfaces the "only in Canada" claim above the fold.

## What's right

### A11y
- Section 6 codifies the right primitives: skip link inherited from shared globals, unique `<h1>` per route, `<label htmlFor>` + `aria-describedby` on form fields, visually hidden description on the emergency number, focus-trapped mobile drawer.
- The TL49 contact form pattern (`useId` for label/error pairing, `aria-invalid`, `role="alert"` on inline errors, `tl-sr-only` for "(required)") is already correct and worth porting verbatim — Miller should reuse `FormField` rather than rewrite it.
- Decision #4 (no fabricated stat counters) is the right call for cognitive a11y too: a counter animating to "—" or static "Data unavailable" reads more honestly to SR users than a counter announcing "0".

### Perf
- Static prerender of all 32 routes, no SSR, no JS map library, plain `<iframe>` for Google Maps with `loading="lazy"` — all good baseline calls.
- Pure-CSS hero carousel avoids a JS slideshow dependency.
- Server-components-by-default plus a tight allow-list of client islands (TopNav, EmergencyBanner, FAQ, ContactForm, RemediationCallback, ScrollReveal, Tweaks) is the right ceiling.
- Single `services.js` registry (Decision #8) eliminates duplicate payload across grid/nav/sitemap.

### Trust
- `CertificationGrid` as a dedicated component (§4.4) — correct instinct to give ISO 9001/14001/45001 first-class treatment instead of footer logos.
- Decision #5 (sitewide `EmergencyBanner`) correctly elevates the 24/7 number above nav burial.
- Decision #7 (stub routes over 404s for case studies and job slugs) preserves the trust signal that "real work / real openings exist."

## What's wrong

1. **EmergencyBanner accessibility under-specified.** *Lens: A11y.* §4.4 says "visually hidden 'Emergency contact' label" but doesn't pin landmark role, dismiss-button semantics, focus order, or live-region behavior. Concrete change: render the banner as `<aside role="region" aria-label="24-hour emergency contact">` containing a `tel:` link as the first interactive element, followed by a `<button aria-label="Dismiss emergency banner for this session">`. The dismiss must not be the first focusable element; the phone link must be.

2. **Phone number should NOT be the first focusable element after Skip-to-content.** *Lens: A11y.* The team-lead brief asks whether it should — answer is no. Skip-to-content must land in `<main>`. A keyboard user navigating sequentially encounters: skip link → banner phone link → banner dismiss → TopNav. That's correct. Forcing the phone to be globally first focusable would break the skip-link contract (skip links exist to *bypass* repeated chrome). Concrete change: spec must state explicitly that skip-link target is `<main id="main">` and the banner sits in tab order *before* the skip link's destination, not after it.

3. **Banner causes mobile address-bar/CLS thrash.** *Lens: A11y + Perf.* A sticky strip above a sticky TopNav on iOS Safari fights the dynamic address bar and produces layout shift on scroll. Concrete change: pin the banner with `position: sticky; top: 0` inside a wrapper that reserves height via `min-block-size` so collapse/dismiss doesn't shift LCP. Use `100dvh`-aware spacing, not `100vh`. Add a CLS budget assertion in §7 (CLS < 0.05).

4. **`EmergencyBanner` hydration pattern as written can flash.** *Lens: A11y + Perf.* §4.4's "render open on server, close in mount effect" guarantees a paint of the open banner before dismissal — that's a CLS event for returning users every session. Concrete change: gate the dismiss state on a `__banner` cookie read in the server component so SSR emits the correct initial state; the React-19 derived-state guard is only needed for the no-cookie path.

5. **ISO certificate links must be real PDFs, not decorative.** *Lens: Trust + A11y.* The QA scrape says each cert "links to a downloadable PDF." Spec §4.4 lists `CertificationGrid` but §3.4 only mentions "certificate download cards" loosely. Concrete change: §1.3 `lib/content/quality-assurance.js` must declare `{ name, iso, year, href, sizeKB }` per cert, and link text must follow the §6 rule literally — "ISO 9001:2015 certificate · PDF, 0.3 MB" with `<a download>` and `aria-describedby` pointing to the size span. Mandate that placeholder hrefs are flagged with a build-time warning, not silently `#`.

6. **150 KB per-route budget is unrealistic for Remediation.** *Lens: Perf.* RemediationTemplate = PageHero + 6-card grid + industries list + 5-step process + 4 case-study cards + 4-card "why choose" + callback form + emergency CTA. With React 19 runtime (~45 KB) + Next 16 client runtime + ScrollReveal + Tweaks + form state, you'll land near 180–210 KB compressed before app code. Concrete change: split the budget — **120 KB for thin service pages, 180 KB for Remediation and Contact**, set in `next.config.mjs` bundle analyzer thresholds. Keep Tweaks out of the prod bundle entirely (gate on `NODE_ENV !== "production"`).

7. **Five Google Font families is a perf foot-gun on 4G.** *Lens: Perf.* Geist + Geist Mono + Newsreader + Manrope + Funnel Display + JetBrains Mono = six families across three `data-type` modes. Each adds ~30–80 KB woff2 + a render-blocking preconnect. The Tweaks panel is a dev tool; prod users don't need three type pairings. Concrete change: ship only `data-type="utility"` (Geist + Geist Mono) to prod; lazy-load alternate families behind the Tweaks panel via dynamic `@font-face` injection. Preload only Geist regular + Geist Mono regular.

8. **External Unsplash hero photos threaten LCP 2.0 s on 4G.** *Lens: Perf.* Unsplash CDN response times from Manitoba over 4G commonly land 600–900 ms TTFB; a 1600w hero photo is 120–200 KB. Concrete change: §7 must mandate `<link rel="preload" as="image" fetchpriority="high">` for the first carousel frame, hard-cap hero width at 1600 (already in §7), and add a `preconnect` to `images.unsplash.com` in `app/layout.jsx`. Defer carousel frames 2 and 3 with `loading="lazy"`. Honor `prefers-reduced-motion` and freeze the carousel on the first frame — currently unspecified.

9. **Pure-CSS keyframed carousel can block LCP.** *Lens: Perf + A11y.* If frame 1 isn't the LCP element because the animation begins immediately (frame 2 swaps in before browser settles LCP), LCP detection picks the wrong element. Concrete change: hold frame 1 for ≥ 3 s before the first swap; mark the frame-1 `<img>` with `fetchpriority="high"`; respect `@media (prefers-reduced-motion: reduce) { animation: none }`.

10. **5-step process timeline must be an ordered list semantically.** *Lens: A11y.* Spec §3.2 calls it a "5-step process timeline" but `MillerProcessFlow` (§4.4) doesn't pin semantics. The TL49 `tl-steps` pattern in ContactClient uses `<div>` siblings — that's a regression risk. Concrete change: `MillerProcessFlow` must render `<ol>` with `<li>` per stage; visual numbering can stay as `tl-step__num` but list semantics are non-negotiable so SR users hear "list with 5 items."

11. **"Stats unavailable" needs SR-friendly phrasing, not visual ellipsis only.** *Lens: A11y.* §10 #4 says "data unavailable placeholder." Concrete change: render `<span aria-label="Data unavailable"><span aria-hidden="true">—</span></span>` paired with the visible label, so SR users hear "Satisfied clients: data unavailable" rather than "Satisfied clients: em-dash."

12. **Focus-on-error not specified for the Remediation callback form.** *Lens: A11y.* TL49 `validateStep` sets errors but doesn't focus the first invalid field. Concrete change: spec must state — on submit with errors, programmatically focus the first invalid input and ensure the inline error has `role="alert"` (already in `FormField`) so the new error is announced. Required-marking pattern (`<span class="req" aria-hidden> *</span>` + `<span class="tl-sr-only"> (required)</span>`) is already correct in `FormField`; mandate reuse.

13. **VBEC / Vaughn Bullough name not surfaced in the spec.** *Lens: Trust.* The team-lead brief flags this. The scrape doesn't show it in the homepage/QA pages provided, but the brief asserts it's a trust signal. Concrete change: `lib/content/treatment-facility.js` must declare `vbecHeading` and `vbecLead` explicitly, and `LocationTemplate` must render them in the hero — not buried in body prose. Add it to the homepage "Locations" cross-link block as well.

14. **The "only in Canada" QA claim is buried.** *Lens: Trust.* The QA scrape's strongest assertion — *"the only hazardous waste management company in Canada with an integrated management system featuring three ISO certifications"* — is the single most-defensible trust line on the entire site. Concrete change: surface this verbatim as the `AboutTemplate` hero `lead` for `/about-us/quality-assurance/`, **and** mirror it into the homepage `CertificationGrid` as a single-line eyebrow above the three logos. Currently the spec treats Certifications as a decorative strip.

15. **"Over 25 years" repetition not normalized.** *Lens: Trust.* Appears on homepage editorial block, remediation hero, and is likely repeated across about/services. The spec doesn't flag it. Concrete change: keep it where it earns its place (homepage editorial, remediation hero) but route a single string through `lib/content/brand.js` so the team can dial it up to "Over 25 years" or down to "Since 2000" in one place. Repetition is fine, copy drift is not.

16. **COR 2023 (MHCA) missing from `CertificationGrid`.** *Lens: Trust.* QA scrape lists four certifications; spec §4.4 says "3-card ISO display." Concrete change: rename to "4-card credentials grid" and include MHCA COR 2023 — it's a Manitoba-specific safety credential that strengthens regional trust.

17. **Skip link target not specified.** *Lens: A11y.* §6 says "Skip link present (already shipped via shared globals)" but doesn't name the target. The shared `.tl-skip` styles assume an `href`. Concrete change: every page's root must wrap content in `<main id="main" tabIndex={-1}>`; the layout's skip link must use `href="#main"`. Required for WCAG 2.4.1.

18. **No spec mention of `prefers-reduced-motion` for ScrollReveal.** *Lens: A11y.* The reveal system is inherited but the spec doesn't mandate honoring the OS preference. Concrete change: §4.5 must state that ScrollReveal short-circuits to "visible" when `(prefers-reduced-motion: reduce)` matches.

## Open questions

1. **EmergencyBanner persistence:** session-only dismiss (spec) or 24-hour cookie? Session feels right for a spill-response number, but if the user visits 6 pages in one session and dismisses on page 1, do we want it re-armed on page 6? Recommend: session-only, accept the trade.
2. **Are the real ISO PDFs available now**, or do we ship placeholders? If placeholders, the build-time warning (item 5) is critical so launch doesn't go out with `#` hrefs.
3. **VBEC asset rights** — does Miller's parent group have the Vaughn Bullough name and treatment-facility imagery cleared for use on the rebuilt site?
4. **Mobile EmergencyBanner collapse to icon button** (spec §2.2) — what's the icon's accessible name? Suggest `aria-label="Call 24/7 emergency: (204) 957-6327"` so it's not a mystery phone glyph.
5. **Carousel reduced-motion fallback** — freeze on frame 1, or rotate via a manual prev/next control? Recommend freeze-on-frame-1; controls add a client island.
