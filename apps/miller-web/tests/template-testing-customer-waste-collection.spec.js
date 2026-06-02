import { test, expect } from "@playwright/test";

// Parity gate for the customer-waste-collection sandbox recreation (components-v2) vs the real page.
// Same approach as the emergency-response spec: mobile is byte-identical end-to-end; on desktop the
// only difference is the global-header nav active-link underline driven by the real URL
// (/industrial-services/...), which the sandbox URL can't replicate — a chrome artifact that resolves
// at cutover. So the desktop visual assertion compares the PAGE BODY (from the hero down), excluding
// the global header. Structural + reveal-attribute parity is asserted over the full page.

const REAL = "http://localhost:3001/industrial-services/customer-waste-collection";
const TT = "http://localhost:3001/template-testing/customer-waste-collection";

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
    ".mw-svc-hero, .mw-vol, .mw-flow, .mw-svc-inds, .mw-sched, .mw-svc-related-sec",
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
  return page.screenshot({ fullPage: true, clip: { x: 0, y: top, width, height: full - top } });
}

test("CWC: section set + order parity", async ({ page }) => {
  await prep(page, TT);
  const tt = await sectionClasses(page);
  await prep(page, REAL);
  const real = await sectionClasses(page);
  expect(tt).toEqual(real);
});

test("CWC: reveal-attribute placement parity", async ({ page }) => {
  await prep(page, TT);
  const tt = await revealSignature(page);
  await prep(page, REAL);
  const real = await revealSignature(page);
  expect(tt).toEqual(real);
});

test("CWC: no stray variant attributes on the sandbox", async ({ page }) => {
  await prep(page, TT);
  const stray = await page.$$eval("[data-scheme], [data-layout]", (els) => els.length);
  expect(stray).toBe(0);
});

test("CWC: mobile full-page byte parity", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });
  await prep(page, REAL); const real = await page.screenshot({ fullPage: true });
  await prep(page, TT); const tt = await page.screenshot({ fullPage: true });
  expect(Buffer.compare(real, tt)).toBe(0);
});

test("CWC: desktop page-body byte parity (hero-down, excludes header chrome)", async ({ page }) => {
  await prep(page, REAL); const real = await bodyShot(page, 1280);
  await prep(page, TT); const tt = await bodyShot(page, 1280);
  expect(Buffer.compare(real, tt)).toBe(0);
});
