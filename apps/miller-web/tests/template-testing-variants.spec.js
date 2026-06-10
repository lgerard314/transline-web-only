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

test("dark scheme: section surface + text invert to walnut/cream", async ({ page }) => {
  await page.goto(`${BASE}/template-testing-variants`);
  // history section rendered with scheme:"dark"
  const sec = page.locator('.mw-ten3[data-scheme="dark"]').first();
  await expect(sec).toBeAttached();
  const navy = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue("--c-navy").trim());
  const surface = await sec.evaluate((el) => getComputedStyle(el).getPropertyValue("--c-surface-warm").trim());
  expect(surface).toBe(navy);   // token rebind took effect on the section subtree
});

test("dark scheme: history milestone copy uses reparented ink tokens", async ({ page }) => {
  await page.goto(`${BASE}/template-testing-variants`);
  const copy = page.locator('.mw-ten3[data-scheme="dark"] .mw-ten3__ibody').first();
  await expect(copy).toBeAttached();
  const color = await copy.evaluate((el) => getComputedStyle(el).color);
  // Cream ink on walnut (`--c-ink-2`), not a hardcoded light-surface black.
  expect(color).toMatch(/250,\s*243,\s*229|245,\s*230,\s*203/);
});
