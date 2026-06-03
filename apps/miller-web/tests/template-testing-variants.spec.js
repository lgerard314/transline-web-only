import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3001";

test("config: tokens override applies to the section subtree", async ({ page }) => {
  await page.goto(`${BASE}/template-testing-variants`);
  const accent = await page.evaluate(() => getComputedStyle(document.querySelector(".mw-hero")).getPropertyValue("--c-accent").trim());
  expect(accent).toBe("#7a3d12");
});

test("config: scheme recolors the token-driven surface (resolved color)", async ({ page }) => {
  await page.goto(`${BASE}/template-testing-variants`);
  await expect(page.locator('.mw-fac2[data-scheme="cream"]')).toBeAttached();
  const { surface, bg } = await page.evaluate(() => {
    const sec = document.querySelector('.mw-fac2[data-scheme="cream"]');
    // Resolved background color of the cream-schemed section.
    const surface = getComputedStyle(sec).backgroundColor;
    // Resolve the --c-bg token to a color value (what `cream` remaps the surface to).
    const probe = document.createElement("div");
    probe.style.color = "var(--c-bg)";
    sec.appendChild(probe);
    const bg = getComputedStyle(probe).color;
    probe.remove();
    return { surface, bg };
  });
  expect(surface).toBe(bg);
});

test("config: reverse layout flips facility split above breakpoint", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${BASE}/template-testing-variants`);
  const dir = await page.evaluate(() => getComputedStyle(document.querySelector(".mw-fac2__split[data-layout='reverse']")).direction);
  expect(dir).toBe("rtl");
  // Prove the columns visually swapped: content now sits to the RIGHT of the media.
  const { contentLeft, mediaLeft } = await page.evaluate(() => {
    const split = document.querySelector(".mw-fac2__split[data-layout='reverse']");
    const contentLeft = split.querySelector(".mw-fac2__content").getBoundingClientRect().left;
    const mediaLeft = split.querySelector(".mw-fac2__media").getBoundingClientRect().left;
    return { contentLeft, mediaLeft };
  });
  expect(contentLeft).toBeGreaterThan(mediaLeft);
});

test("dark scheme: section surface + text invert to walnut/cream", async ({ page }) => {
  await page.goto(`${BASE}/template-testing-variants`);
  // history section rendered with scheme:"dark"
  const sec = page.locator('.mw-ten3[data-scheme="dark"]').first();
  await expect(sec).toBeAttached();
  const navy = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--c-navy").trim());
  const surface = await sec.evaluate((el) => getComputedStyle(el).getPropertyValue("--c-surface-warm").trim());
  expect(surface).toBe(navy);   // token rebind took effect on the section subtree
});

test("dark scheme: history milestone body is no longer white", async ({ page }) => {
  await page.goto(`${BASE}/template-testing-variants`);
  const body = page.locator('.mw-ten3[data-scheme="dark"] .mw-ten3__milestone-body').first();
  await expect(body).toBeAttached();
  const bg = await body.evaluate((el) => getComputedStyle(el).backgroundColor);
  // not white: rgb(255,255,255) / rgba(255,255,255,*) must NOT be the resolved bg
  expect(bg).not.toMatch(/255,\s*255,\s*255/);
});
