import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3001";

test("template-testing route renders inside chrome", async ({ page }) => {
  await page.goto(`${BASE}/template-testing`);
  await expect(page.locator("header")).toBeVisible();   // TopNav from root layout
  await expect(page.locator("footer")).toBeVisible();   // SiteFooter from root layout
  await expect(page.locator('[data-tt-root="1"]')).toBeAttached();
});
