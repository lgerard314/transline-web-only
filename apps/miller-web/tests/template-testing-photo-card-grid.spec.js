// TDD spec for PhotoCardGrid01 + IndThumbCard01 + IndGalleryCard01.
// This test targets a minimal sandbox fixture at /template-testing/photo-card-grid-test
// which must render both configs side-by-side so both can be asserted.
//
// RED phase: run before the components or sandbox page exist — every test should fail.
// GREEN phase: run after implementation — all tests pass.

import { test, expect } from "@playwright/test";

const BASE = "http://localhost:3001";
const ROUTE = `${BASE}/template-testing/photo-card-grid-test`;

// ── IndThumbCard01 (cardStyle: "thumb") ─────────────────────────────────────

test("thumb variant: section has mw-svc-inds--photo modifier class", async ({ page }) => {
  await page.goto(ROUTE, { waitUntil: "domcontentloaded" });
  await expect(page.locator("section.mw-svc-inds.mw-svc-inds--photo")).toHaveCount(1);
});

test("thumb variant: section has aria-labelledby pointing at visible h2", async ({ page }) => {
  await page.goto(ROUTE, { waitUntil: "domcontentloaded" });
  const section = page.locator("section.mw-svc-inds--photo");
  const labelledBy = await section.getAttribute("aria-labelledby");
  expect(labelledBy).toBeTruthy();
  await expect(page.locator(`#${labelledBy}`)).toBeVisible();
});

test("thumb variant: header carries data-reveal, grid carries data-reveal-stagger", async ({ page }) => {
  await page.goto(ROUTE, { waitUntil: "domcontentloaded" });
  const section = page.locator("section.mw-svc-inds--photo");
  await expect(section.locator("header.mw-svc-inds__head[data-reveal]")).toHaveCount(1);
  await expect(section.locator("ul.mw-svc-inds__grid[data-reveal-stagger]")).toHaveCount(1);
});

test("thumb variant: head has media-split (mw-svc-inds__head-media with img)", async ({ page }) => {
  await page.goto(ROUTE, { waitUntil: "domcontentloaded" });
  const section = page.locator("section.mw-svc-inds--photo");
  await expect(section.locator(".mw-svc-inds__head-media img")).toHaveCount(1);
});

test("thumb variant: head-media img has aria-hidden on parent", async ({ page }) => {
  await page.goto(ROUTE, { waitUntil: "domcontentloaded" });
  const section = page.locator("section.mw-svc-inds--photo");
  const mediaDiv = section.locator(".mw-svc-inds__head-media");
  await expect(mediaDiv).toHaveAttribute("aria-hidden", "true");
});

test("thumb variant: cards are <li class='mw-svc-ind'> inside the grid", async ({ page }) => {
  await page.goto(ROUTE, { waitUntil: "domcontentloaded" });
  const section = page.locator("section.mw-svc-inds--photo");
  const cards = section.locator("ul.mw-svc-inds__grid > li.mw-svc-ind");
  expect(await cards.count()).toBeGreaterThanOrEqual(1);
});

test("thumb variant: each card has __thumb (with img + __name) and __text (with __tick + __desc)", async ({ page }) => {
  await page.goto(ROUTE, { waitUntil: "domcontentloaded" });
  const section = page.locator("section.mw-svc-inds--photo");
  const firstCard = section.locator("li.mw-svc-ind").first();
  await expect(firstCard.locator(".mw-svc-ind__thumb")).toHaveCount(1);
  await expect(firstCard.locator(".mw-svc-ind__thumb img")).toHaveCount(1);
  await expect(firstCard.locator(".mw-svc-ind__name")).toHaveCount(1);
  await expect(firstCard.locator(".mw-svc-ind__text")).toHaveCount(1);
  await expect(firstCard.locator(".mw-svc-ind__tick")).toHaveCount(1);
  await expect(firstCard.locator(".mw-svc-ind__tick-dot")).toHaveCount(1);
  await expect(firstCard.locator(".mw-svc-ind__tick-line")).toHaveCount(1);
  await expect(firstCard.locator(".mw-svc-ind__desc")).toHaveCount(1);
});

test("thumb variant: tick has aria-hidden on __tick span", async ({ page }) => {
  await page.goto(ROUTE, { waitUntil: "domcontentloaded" });
  const section = page.locator("section.mw-svc-inds--photo");
  const firstCard = section.locator("li.mw-svc-ind").first();
  await expect(firstCard.locator(".mw-svc-ind__tick[aria-hidden='true']")).toHaveCount(1);
});

test("thumb variant: thumb img has loading=lazy and empty alt", async ({ page }) => {
  await page.goto(ROUTE, { waitUntil: "domcontentloaded" });
  const section = page.locator("section.mw-svc-inds--photo");
  const thumbImg = section.locator("li.mw-svc-ind").first().locator(".mw-svc-ind__thumb img");
  await expect(thumbImg).toHaveAttribute("loading", "lazy");
  await expect(thumbImg).toHaveAttribute("alt", "");
});

test("thumb variant: no stray data-scheme or data-layout on section", async ({ page }) => {
  await page.goto(ROUTE, { waitUntil: "domcontentloaded" });
  const section = page.locator("section.mw-svc-inds--photo");
  expect(await section.getAttribute("data-scheme")).toBeNull();
  expect(await section.getAttribute("data-layout")).toBeNull();
});

// ── IndGalleryCard01 (cardStyle: "gallery") ─────────────────────────────────

test("gallery variant: section has mw-svc-inds--gallery modifier class", async ({ page }) => {
  await page.goto(ROUTE, { waitUntil: "domcontentloaded" });
  await expect(page.locator("section.mw-svc-inds.mw-svc-inds--gallery")).toHaveCount(1);
});

test("gallery variant: section has aria-labelledby pointing at visible h2", async ({ page }) => {
  await page.goto(ROUTE, { waitUntil: "domcontentloaded" });
  const section = page.locator("section.mw-svc-inds--gallery");
  const labelledBy = await section.getAttribute("aria-labelledby");
  expect(labelledBy).toBeTruthy();
  await expect(page.locator(`#${labelledBy}`)).toBeVisible();
});

test("gallery variant: header has NO data-reveal; tag+h2+lead each have data-reveal", async ({ page }) => {
  await page.goto(ROUTE, { waitUntil: "domcontentloaded" });
  const section = page.locator("section.mw-svc-inds--gallery");
  // The header itself must NOT have data-reveal
  expect(await section.locator("header.mw-svc-inds__head[data-reveal]").count()).toBe(0);
  // Individual elements inside head carry data-reveal
  await expect(section.locator(".mw-section-tag[data-reveal]")).toHaveCount(1);
  await expect(section.locator("h2.mw-section-title[data-reveal]")).toHaveCount(1);
  await expect(section.locator("p.mw-svc-inds__lead[data-reveal]")).toHaveCount(1);
});

test("gallery variant: grid carries data-reveal-stagger", async ({ page }) => {
  await page.goto(ROUTE, { waitUntil: "domcontentloaded" });
  const section = page.locator("section.mw-svc-inds--gallery");
  await expect(section.locator("ul.mw-svc-inds__grid[data-reveal-stagger]")).toHaveCount(1);
});

test("gallery variant: no mw-svc-inds__head-media present", async ({ page }) => {
  await page.goto(ROUTE, { waitUntil: "domcontentloaded" });
  const section = page.locator("section.mw-svc-inds--gallery");
  expect(await section.locator(".mw-svc-inds__head-media").count()).toBe(0);
});

test("gallery variant: mw-svc-inds__lead is OUTSIDE head-left (sibling layout)", async ({ page }) => {
  await page.goto(ROUTE, { waitUntil: "domcontentloaded" });
  const section = page.locator("section.mw-svc-inds--gallery");
  // lead is a direct child of header, not inside __head-left
  expect(await section.locator(".mw-svc-inds__head-left .mw-svc-inds__lead").count()).toBe(0);
  await expect(section.locator("header.mw-svc-inds__head > p.mw-svc-inds__lead")).toHaveCount(1);
});

test("gallery variant: cards are <li class='mw-ind-card'> inside the grid", async ({ page }) => {
  await page.goto(ROUTE, { waitUntil: "domcontentloaded" });
  const section = page.locator("section.mw-svc-inds--gallery");
  const cards = section.locator("ul.mw-svc-inds__grid > li.mw-ind-card");
  expect(await cards.count()).toBeGreaterThanOrEqual(1);
});

test("gallery variant: each card has __media (img) and __body (__name + __tick + __blurb)", async ({ page }) => {
  await page.goto(ROUTE, { waitUntil: "domcontentloaded" });
  const section = page.locator("section.mw-svc-inds--gallery");
  const firstCard = section.locator("li.mw-ind-card").first();
  await expect(firstCard.locator(".mw-ind-card__media")).toHaveCount(1);
  await expect(firstCard.locator(".mw-ind-card__media img")).toHaveCount(1);
  await expect(firstCard.locator(".mw-ind-card__body")).toHaveCount(1);
  await expect(firstCard.locator(".mw-ind-card__name")).toHaveCount(1);
  await expect(firstCard.locator(".mw-ind-card__tick")).toHaveCount(1);
  await expect(firstCard.locator(".mw-ind-card__tick-dot")).toHaveCount(1);
  await expect(firstCard.locator(".mw-ind-card__tick-line")).toHaveCount(1);
  await expect(firstCard.locator(".mw-ind-card__blurb")).toHaveCount(1);
});

test("gallery variant: tick has aria-hidden on __tick span", async ({ page }) => {
  await page.goto(ROUTE, { waitUntil: "domcontentloaded" });
  const section = page.locator("section.mw-svc-inds--gallery");
  const firstCard = section.locator("li.mw-ind-card").first();
  await expect(firstCard.locator(".mw-ind-card__tick[aria-hidden='true']")).toHaveCount(1);
});

test("gallery variant: img has loading=lazy and empty alt", async ({ page }) => {
  await page.goto(ROUTE, { waitUntil: "domcontentloaded" });
  const section = page.locator("section.mw-svc-inds--gallery");
  const img = section.locator("li.mw-ind-card").first().locator(".mw-ind-card__media img");
  await expect(img).toHaveAttribute("loading", "lazy");
  await expect(img).toHaveAttribute("alt", "");
});

test("gallery variant: trailing CTA cell (mw-ind-cta-cell) is present", async ({ page }) => {
  await page.goto(ROUTE, { waitUntil: "domcontentloaded" });
  const section = page.locator("section.mw-svc-inds--gallery");
  await expect(section.locator("li.mw-ind-cta-cell")).toHaveCount(1);
  await expect(section.locator("li.mw-ind-cta-cell a.mw-ind-cta")).toHaveCount(1);
  // Arrow is aria-hidden
  await expect(section.locator(".mw-ind-cta__arrow[aria-hidden='true']")).toHaveCount(1);
});

test("gallery variant: no stray data-scheme or data-layout on section", async ({ page }) => {
  await page.goto(ROUTE, { waitUntil: "domcontentloaded" });
  const section = page.locator("section.mw-svc-inds--gallery");
  expect(await section.getAttribute("data-scheme")).toBeNull();
  expect(await section.getAttribute("data-layout")).toBeNull();
});

// ── Structural wrapper parity ────────────────────────────────────────────────

test("both variants: inner structure is mw-svc-inds__inner mw-inner > head + grid", async ({ page }) => {
  await page.goto(ROUTE, { waitUntil: "domcontentloaded" });
  for (const modifier of ["mw-svc-inds--photo", "mw-svc-inds--gallery"]) {
    const section = page.locator(`section.${modifier}`);
    await expect(section.locator(".mw-svc-inds__inner.mw-inner")).toHaveCount(1);
    await expect(section.locator(".mw-svc-inds__inner > header.mw-svc-inds__head")).toHaveCount(1);
    await expect(section.locator(".mw-svc-inds__inner > ul.mw-svc-inds__grid")).toHaveCount(1);
  }
});
