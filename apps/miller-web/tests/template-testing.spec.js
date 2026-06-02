import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3001";

test("template-testing route renders inside chrome", async ({ page }) => {
  await page.goto(`${BASE}/template-testing`);
  await expect(page.getByRole("banner")).toBeVisible();   // TopNav from root layout
  await expect(page.locator("footer")).toBeVisible();     // SiteFooter from root layout
  await expect(page.locator("main > section.mw-hero")).toBeVisible();
});

test("hero parity: hero DOM present like home", async ({ page }) => {
  await page.goto(`${BASE}/template-testing`);
  await expect(page.locator(".mw-hero")).toBeVisible();
  await expect(page.locator(".mw-hero__mark")).toBeAttached();   // TopNav logo-swap hook
  await expect(page.locator(".mw-hero__cycle")).toBeAttached();  // phrase cycle present
  await expect(page.locator(".mw-hero .mw-cta--solid")).toHaveCount(1);
});

const SECTION_SELECTORS = [
  ".mw-hero", ".mw-trust", ".mw-services", ".mw-sec2",
  ".mw-fac2", ".mw-ten3", ".mw-careers", ".mw-marquee", ".mw-final",
];

test("section set + order matches home", async ({ page }) => {
  await page.goto(`${BASE}/template-testing`);
  for (const sel of SECTION_SELECTORS) {
    await expect(page.locator(`main ${sel}`)).toHaveCount(1);
  }
  const tops = await page.evaluate((sels) =>
    sels.map((s) => document.querySelector(`main ${s}`)?.getBoundingClientRect().top ?? -1),
    SECTION_SELECTORS,
  );
  expect(tops.every((t, i) => i === 0 || t > tops[i - 1])).toBe(true);
});

test("reveal attributes present (animation parity)", async ({ page }) => {
  await page.goto(`${BASE}/template-testing`);
  expect(await page.locator("[data-reveal-stagger]").count()).toBeGreaterThanOrEqual(5);
  expect(await page.locator("[data-reveal]").count()).toBeGreaterThanOrEqual(5);
});

test("hero image preload hint present (LCP parity)", async ({ page }) => {
  await page.goto(`${BASE}/template-testing`);
  await expect(page.locator('link[rel="preload"][as="image"][fetchpriority="high"]')).toBeAttached();
});

test("config: scheme emits data-scheme + token override applies", async ({ page }) => {
  await page.goto(`${BASE}/template-testing-variants`);
  await expect(page.locator('.mw-hero[data-scheme="cream"]')).toBeAttached();
  const accent = await page.evaluate(() => getComputedStyle(document.querySelector(".mw-hero")).getPropertyValue("--c-accent").trim());
  expect(accent).toBe("#7a3d12");
});

test("config: default page emits no variant attributes (parity)", async ({ page }) => {
  await page.goto(`${BASE}/template-testing`);
  expect(await page.locator("main [data-scheme], main [data-layout]").count()).toBe(0);
});

test("config: reverse layout flips facility split above breakpoint", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${BASE}/template-testing-variants`);
  const dir = await page.evaluate(() => getComputedStyle(document.querySelector(".mw-fac2__split[data-layout='reverse']")).direction);
  expect(dir).toBe("rtl");
});
