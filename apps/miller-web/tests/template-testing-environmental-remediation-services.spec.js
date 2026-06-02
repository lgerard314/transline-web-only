import { test, expect } from "@playwright/test";

// Parity gate for the environmental-remediation-services sandbox (components-v2) vs the real page.
// Like ER/CWC plus two REM-specific realities:
//   1) Same sandbox-URL nav-underline chrome artifact → desktop compares the PAGE BODY (hero down).
//   2) REM is the first page with reused NON-DETERMINISTIC client embeds: the LiteYouTube facade
//      (.mw-lyt — external YouTube poster) in the hero + film gallery, and the JS-scroll RelatedServices
//      carousel (.mw-rel__track) which parks its scroll offset on mount. These are reused components,
//      not template DOM, and they render with sub-pixel non-determinism. We MASK exactly those two so the
//      byte-compare proves the template-controlled DOM is identical, and we additionally assert every
//      section's top+height matches exactly (layout parity) and reveal-attribute placement matches.
const MASK_SELECTORS = [".mw-lyt", ".mw-rel__track"];
function masks(page) { return MASK_SELECTORS.map((s) => page.locator(s)); }

const REAL = "http://localhost:3001/industrial-services/environmental-remediation-services";
const TT = "http://localhost:3001/template-testing/environmental-remediation-services";

async function prep(page, url) {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto(url, { waitUntil: "networkidle" });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 800) { window.scrollTo(0, y); await new Promise((r) => setTimeout(r, 50)); }
    window.scrollTo(0, 0);
    const imgs = [...document.querySelectorAll("img")];
    imgs.forEach((im) => { im.loading = "eager"; if (!im.complete) im.src = im.src; });
    await Promise.all(imgs.map((im) => (im.complete ? 0 : im.decode().catch(() => {}))));
  });
  await page.waitForTimeout(500);
}

async function sectionClasses(page) {
  return page.$$eval(
    ".mw-svc-hero, .mw-svc-inds, .mw-svc-cov, .mw-flow, .mw-rem-vid, .mw-why, .mw-svc-cta, .mw-svc-related-sec",
    (els) => els.map((e) => e.className.split(/\s+/).filter(Boolean).sort().join(" "))
  );
}

async function revealSignature(page) {
  return page.$$eval("[data-reveal], [data-reveal-stagger]", (els) =>
    els.map((e) => `${e.tagName}.${e.className.split(/\s+/).filter(Boolean).sort().join(".")}|${e.hasAttribute("data-reveal") ? "r" : ""}${e.hasAttribute("data-reveal-stagger") ? "s" : ""}`).sort()
  );
}

async function bodyShot(page, width) {
  await page.setViewportSize({ width, height: 1000 });
  const top = await page.$eval(".mw-svc-hero", (e) => Math.round(e.getBoundingClientRect().top + window.scrollY));
  const full = await page.evaluate(() => document.body.scrollHeight);
  return page.screenshot({ fullPage: true, clip: { x: 0, y: top, width, height: full - top }, mask: masks(page), maskColor: "#ff00ff" });
}

async function sectionBoxes(page) {
  return page.$$eval(
    ".mw-svc-hero, .mw-svc-inds, .mw-svc-cov, .mw-flow, .mw-rem-vid, .mw-why, .mw-svc-cta, .mw-svc-related-sec, footer",
    (els) => els.map((e) => { const r = e.getBoundingClientRect(); return `${e.className.split(/\s+/)[0] || e.tagName}@${Math.round(r.top + window.scrollY)}+${Math.round(r.height)}`; })
  );
}

test("REM: section set + order parity", async ({ page }) => {
  await prep(page, TT); const tt = await sectionClasses(page);
  await prep(page, REAL); const real = await sectionClasses(page);
  expect(tt).toEqual(real);
});

test("REM: reveal-attribute placement parity", async ({ page }) => {
  await prep(page, TT); const tt = await revealSignature(page);
  await prep(page, REAL); const real = await revealSignature(page);
  expect(tt).toEqual(real);
});

test("REM: no stray variant attributes on the sandbox", async ({ page }) => {
  await prep(page, TT);
  const stray = await page.$$eval("[data-scheme], [data-layout]", (els) => els.length);
  expect(stray).toBe(0);
});

test("REM: section box parity (top + height, layout identical)", async ({ page }) => {
  await prep(page, TT); const tt = await sectionBoxes(page);
  await prep(page, REAL); const real = await sectionBoxes(page);
  expect(tt).toEqual(real);
});

test("REM: mobile full-page byte parity (embeds masked)", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await prep(page, REAL); const real = await page.screenshot({ fullPage: true, mask: masks(page), maskColor: "#ff00ff" });
  await prep(page, TT); const tt = await page.screenshot({ fullPage: true, mask: masks(page), maskColor: "#ff00ff" });
  expect(Buffer.compare(real, tt)).toBe(0);
});

test("REM: desktop page-body byte parity (hero-down, excludes header chrome)", async ({ page }) => {
  await prep(page, REAL); const real = await bodyShot(page, 1280);
  await prep(page, TT); const tt = await bodyShot(page, 1280);
  expect(Buffer.compare(real, tt)).toBe(0);
});
