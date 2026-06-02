import { test, expect } from "@playwright/test";

// Parity gate for the emergency-response sandbox recreation (components-v2) vs the real page.
// Mobile is byte-identical end-to-end. On desktop the global header differs by ONE thing:
// the real URL (/industrial-services/...) sets aria-current="page" on the Services nav item,
// drawing a clay underline; the sandbox URL does not. That is a sandbox-URL chrome artifact,
// not a template difference — it resolves automatically at cutover. So the desktop visual
// assertion compares the PAGE BODY (from the hero down), which excludes the global header and
// is byte-identical. Structural + reveal-attribute parity is asserted over the full page.

const REAL = "http://localhost:3001/industrial-services/emergency-response";
const TT = "http://localhost:3001/template-testing/emergency-response";

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
  // The migration-owned page sections (everything from the hero down to the related rail).
  return page.$$eval(
    ".mw-svc-hero, .mw-svc-tl-sec, .mw-svc-inds, .mw-svc-cov, .mw-svc-cta, .mw-svc-related-sec",
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
  // clip from the top of the first page section (hero) downward — excludes the global header chrome
  const top = await page.$eval(".mw-svc-hero", (e) => Math.round(e.getBoundingClientRect().top + window.scrollY));
  const full = await page.evaluate(() => document.body.scrollHeight);
  return page.screenshot({ fullPage: true, clip: { x: 0, y: top, width, height: full - top } });
}

test("ER: section set + order parity", async ({ page }) => {
  await prep(page, TT);
  const tt = await sectionClasses(page);
  await prep(page, REAL);
  const real = await sectionClasses(page);
  expect(tt).toEqual(real);
});

test("ER: reveal-attribute placement parity", async ({ page }) => {
  await prep(page, TT);
  const tt = await revealSignature(page);
  await prep(page, REAL);
  const real = await revealSignature(page);
  expect(tt).toEqual(real);
});

test("ER: no stray variant attributes on the sandbox", async ({ page }) => {
  await prep(page, TT);
  const stray = await page.$$eval("[data-scheme], [data-layout]", (els) => els.length);
  expect(stray).toBe(0);
});

test("ER: mobile full-page byte parity", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await prep(page, REAL); const real = await page.screenshot({ fullPage: true });
  await prep(page, TT); const tt = await page.screenshot({ fullPage: true });
  expect(Buffer.compare(real, tt)).toBe(0);
});

test("ER: desktop page-body byte parity (hero-down, excludes header chrome)", async ({ page }) => {
  await prep(page, REAL); const real = await bodyShot(page, 1280);
  await prep(page, TT); const tt = await bodyShot(page, 1280);
  expect(Buffer.compare(real, tt)).toBe(0);
});
