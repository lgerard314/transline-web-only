# Round 2 — Skeptical review of `2026-05-15-miller-web-design.md` (v2)

## Verdict

The spec papered over round 1 by accepting nearly every recommendation verbatim (18/18 from a11y/perf, 9/9 from frontend, 7/7 from brand/IA — see §11) without negotiating *cost*. The result is a v2 that has more invented commitments than v1: hard numeric budgets, novel mechanisms (lazy `@font-face` injection, dual-namespaced tweaks, cookie-gated SSR banner), and a class-rename prerequisite — none of which is grounded in measurement or in the scrape. Several of these will not survive contact with phase 1.

## Strongest objections

### 1. The `tl-*` → `wo-*` rename is vanity, framed as hygiene (§1.2, decision-log Brand #4)

Claim: "One sed pass in `apps/transline49-web/` rewrites every selector and JSX className from `tl-` → `wo-`. The migration commit precedes Miller phase 1 and keeps TL49 lint-clean."

Why it's weak: there is zero user-facing payoff. The brand-IA critic's justification — "competitors, partners, journalists, the parent group's PR team see the inversion immediately" — is not a real audit surface. A sed across a shipping production codebase has a non-zero defect rate (collisions with substrings like `control`, `intl`, `httl`-prefixed third-party class names, CSS-in-JS templates, generated CSS module hashes that *contain* `tl-` as a fragment, content strings that legitimately say "tl;dr", inline `style` attribute order). The spec doesn't promise a sed-collision audit, a screenshot diff, or a visual-regression gate. It also doesn't decide what happens if `wo-` collides with anything in shipped HTML cached at edge / iOS-Safari-cached-bundles (the user just shipped commit `af55da6` *to bust* iOS Safari cache — they have lived experience this matters).

What the author should commit to: either (a) **defer the rename indefinitely**, ship Miller with `tl-*` selectors and a one-line code-comment ("class prefix is historical; shared package owns the vocabulary"); or (b) before the migration commit, produce a screenshot-diff of every TL49 route at three viewports, a grep-audit of the sed regex against every file under `apps/transline49-web/`, and a documented rollback commit. Pick (a). It is the right call.

### 2. The per-route JS budgets (120 KB / 180 KB) are made-up numbers presented as engineering (§7, decision-log A11y/Perf #6)

Claim: "Thin pages: 120 KB. Rich pages: 180 KB. Set the threshold in CI via `@next/bundle-analyzer` + a custom script."

Why it's weak: the round-1 critic estimated "180–210 KB compressed before app code" for Remediation and the author rounded *down* to 180 KB as the *budget*. No measurement of the current TL49 client bundle exists in the spec. React 19 + Next 16 client runtime alone has shifted between minor releases; pinning two integers in CI before the framework is even installed in `miller-web/` invites a phase-1 day-2 budget-violation that gets fixed by raising the budget, which makes the budget theatre. `@next/bundle-analyzer` outputs HTML, not pass/fail — the "custom script" doing the threshold check is undefined.

What the author should commit to: phase 1 includes a calibration step — install the package, run `next build` on the empty Miller app + on `TopNav + EmergencyBanner` only, *measure* the floor, set the budgets to floor + a documented headroom number. Or concede there is no CI budget gate in v1 and that the 120/180 KB numbers are aspirational.

### 3. Lazy `@font-face` injection from the Tweaks panel is a load-bearing mechanism the spec invents but doesn't design (§4.3, decision-log A11y/Perf #7)

Claim: "Newsreader, Manrope, Funnel Display, JetBrains Mono are lazy-loaded behind the Tweaks panel via dynamic `@font-face` injection."

Why it's weak: dynamic `@font-face` injection in a Next 16 RSC app crossing a server/client boundary has known pitfalls — FOUT on first toggle, `next/font` not being involved means no preload hints / no font CSS subset / no `size-adjust` metric override, layout shift on every toggle, and the act of injecting via `document.head.appendChild(new CSSStyleSheet)` from inside a React 19 event handler is not the same as Next's compile-time font pipeline. The spec asserts the behaviour as if it's a known solved problem; there is no link to a working pattern in the TL49 codebase (because there isn't one — TL49 ships all the families through the framework). Even §1.2's claim that the panel is dev-only doesn't rescue this: a dev tool that crashes / FOUTs every toggle is worse than no tool.

What the author should commit to: either (a) phase 1 produces a 50-line spike proving dynamic injection works without FOUT in this stack and lands in TL49 first, or (b) accept that alternate fonts ship in the framework font pipeline gated by a `process.env` build flag (slower iteration, but real), or (c) drop alternate fonts from the production Tweaks panel entirely — designers use the local dev server with the framework's font config flipped.

### 4. "LCP < 2.0 s on mid-range Android over 4G" is a promise without a device, a route, or a measurement plan (§7)

Why it's weak: no specific device (Pixel 6a? a 2024 Samsung A-series?), no network throttle profile (Lighthouse "Slow 4G" is 1.6 Mbps; "Regular 4G" is 9 Mbps — fivefold gap), no geography (the round-1 critic explicitly named "Unsplash from Manitoba over 4G commonly 600–900 ms TTFB" — the spec's preconnect + preload mitigates *some* of that, not all), and no CI gate. The Tweaks panel itself, even gated to non-prod, is a third-party dependency hazard if it ever leaks (one mis-merged `process.env.NODE_ENV` check and the panel ships).

What the author should commit to: replace "< 2.0 s on mid-range Android over 4G" with the concrete tool — "Lighthouse mobile preset (Moto G Power, Slow 4G) on `/` and `/industrial-services/environmental-remediation-services/` ≤ 2.5 s LCP, measured in phase 4." Or admit LCP is monitored, not gated.

### 5. The `motif` prop on `ParallelRule` (§4.2) is brand-decoration architecture (decision-log Brand #3)

Claim: a `motif: "parallel-49" | "cert-tick" | "vbec-coord"` prop with "both motifs render at the same DOM size — no layout shift."

Why it's weak: there are three motif values for two brands. The `vbec-coord` motif is invented in this spec — there is no scrape evidence Miller users encounter a coordinate-glyph trust signal anywhere. It is a designer's hypothesis dressed as a requirement. The simpler design is: TL49 ships `ParallelRule`, Miller ships `MillerRule`, they share base CSS through a token. A prop with a three-value enum invites: a fourth value next quarter for a hypothetical third brand, conditional CSS that grows, a Storybook story per motif, accessibility review per motif. None of which the spec budgets.

What the author should commit to: ship two distinct components (`ParallelRule`, `CertRule`) in `@white-owl/brand`, kill `vbec-coord`. Add a third only when a third brand exists.

### 6. The "32 static-prerendered routes" count is presented as a fact but the spec has internal contradictions about whether stubs count (§1.4)

Claim: "Total static-prerendered routes: 32." From: 26 captured + 4 case-study slugs + 2 career slugs = 32. But the same spec calls the case-study and career slugs *stubs* with placeholder body. A reviewer or a future contributor reads "32 static routes" and assumes 32 real pages. The phasing in §9 inherits the ambiguity — phase 2 promises "every page independent once templates land" but a stub page is not a page.

What the author should commit to: distinguish "26 real routes + 6 stub routes" everywhere the count appears, and decide whether `generateStaticParams` for stubs ships in phase 2 or is deferred entirely until a fifth case study or third career posting exists.

### 7. The Tweaks panel namespacing is treated as solved (§1.2, decision-log Frontend #8) but the spec doesn't pick a strategy for the dev-only / prod-gated boundary

Claim: `SiteTweaksProvider` factory accepts `namespace`, becomes the `localStorage` key prefix. "Prevents future cohabitation collisions."

Why it's weak: two same-origin apps cohabiting is already a hypothetical (`apps/miller-web/` and `apps/transline49-web/` ship under different domains). The real risk is the opposite — a designer running both `npm run dev:tl49` and `npm run dev:miller` on `localhost:3000` and `localhost:3001` *will* share localStorage (same origin: `localhost`). The namespacing solves the right problem, but the spec doesn't say which app's namespace wins when both dev servers are open in the same tab via port-switch. Minor, but it's listed as adopted-and-done.

### 8. §5 still hasn't decided what `lib/photos.js` does when an Unsplash ID is removed by Unsplash (cf. §4.4)

The placeholder strategy assumes Unsplash IDs stay live for the duration of the placeholder phase. Unsplash regularly removes photos; the live site will 404 a hero. There's no fallback. "Until real assets are wired" in non-goals doesn't define how long that is or what happens at the boundary.

## What the spec doesn't decide that it must

- **The rollback plan for the `tl-*` → `wo-*` rename.** What's the revert commit if the rename breaks something the screenshot-diff didn't catch and is found three days post-deploy? "Just git revert" — but in the meantime the shared package will have started importing from `wo-*` selectors.
- **Who owns the build-time check that fails on `href="#"` PDF placeholders** (mentioned §6, repeated decision-log A11y/Perf #5). A check that doesn't exist yet, in a file that doesn't exist yet, gated on a content registry (`lib/certs.js`) that doesn't exist yet. Phase ownership: unclear.
- **The Tweaks panel `process.env.NODE_ENV !== "production"` gate**: the spec doesn't say *where* this check runs — at the import site (tree-shakes), at the render site (still ships JS), or both. The difference is whether Tweaks is 0 KB or a few KB in prod. §7 claims "Zero KB in production"; that requires import-site gating, not render-site, and the spec doesn't pin it.
- **The `wo-*` migration commit's CI gate.** If lint passes on `tl-*` *and* `wo-*` during the transition, the rename can land half-finished. If lint fails on `tl-*` *or* `wo-*` strictly, the transition is impossible to land in one commit. The spec implies one sed commit; the lint enforcement is silent.
- **What `lib/content/brand.js` actually exports**, beyond "Over 25 years" + tagline. The decision-log uses it as the answer to copy drift but the body of the spec only names two strings. Is the cradle-to-grave refrain in there? The 24/7 number? The two addresses (HQ + VBEC)? Phase 1 will rediscover this.
- **The `FamilyOfCompanies` cross-link target URLs.** Spec says "current site is bolded" and "TL49 entry links to the sibling site" but does not declare the URL — is it the production TL49 domain (which exists)? An anchor on the parent group page (which may not)?  Phase 1 will hard-code a guess.

## Open questions

1. **§9 phasing claims phase 2 + 3 are parallel-friendly. Is the shared `<FormField>` actually shippable from `@white-owl/brand` in phase 1**, or does it remain in TL49 and get copy-imported, in which case Remediation in phase 3 blocks on a shared-form-component decision the spec never makes?
2. **Are the four ISO PDFs + the MHCA COR 2023 certificate actually procurable** (§3.1 step 2 + §3.5 + decision-log A11y/Perf #16 promises four cards)? Open question #2 in §10 acknowledges this is a blocker; the spec adopts the build-time warning but doesn't decide whether launch ships with all-`href="#"` and the warning suppressed, or refuses to ship.
3. **What's the staging story?** All the perf + a11y assertions are testable in CI but the spec doesn't name a staging URL, a preview-deploy gating mechanism, or who approves a preview before phase-4 verification.
4. **Does Tweaks-panel-in-non-prod include `vercel preview` deployments?** If yes, every preview leaks the Newsreader/Manrope/Funnel/JetBrains payload — a perf gate run against a preview will not match the gate run against prod. If no, the panel is useless to remote design reviewers.
5. **The `[data-palette]` system can still flip Miller to `clay` via the Tweaks panel** (open question #4 in round-1 brand-ia). Spec didn't answer it. Adopted-and-done in §11 doesn't apply — it wasn't in the seven items adopted.
