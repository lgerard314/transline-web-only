import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3001";

test("template-testing route renders inside chrome", async ({ page }) => {
  await page.goto(`${BASE}/template-testing`);
  await expect(page.locator("header")).toBeVisible();   // TopNav from root layout
  await expect(page.locator("footer")).toBeVisible();   // SiteFooter from root layout
  await expect(page.locator("main > section.mw-hero")).toBeVisible();
});

test("hero parity: hero DOM present like home", async ({ page }) => {
  await page.goto(`${BASE}/template-testing`);
  await expect(page.locator(".mw-hero")).toBeVisible();
  await expect(page.locator(".mw-hero__mark")).toBeAttached();   // TopNav logo-swap hook
  await expect(page.locator(".mw-hero__cycle")).toBeAttached();  // phrase cycle present
  await expect(page.locator(".mw-cta--solid")).toHaveCount(1);
});
