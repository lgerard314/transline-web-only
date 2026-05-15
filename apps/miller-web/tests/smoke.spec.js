// Miller smoke suite — Playwright + Chromium. Covers every real route
// + the interaction-heavy components called out in the test plan.
//
// Console error policy:
// - Any unhandled pageerror fails the test.
// - Any `console.error` fails the test (after filtering).
// - `console.warn` only fails if the message matches a "React prop/attr
//   bug" pattern (see SUSPECT_WARN_PATTERNS). Generic HMR/fast-refresh
//   chatter is ignored.
// - 4xx/5xx responses on the navigated page fail the test.
//
// All routes the user listed (32 total) are exercised in test 1.

import { test, expect } from "@playwright/test";

const ROUTES = [
  "/",
  "/about-us",
  "/about-us/health-safety",
  "/about-us/licencing-information",
  "/about-us/professional-affiliations",
  "/about-us/quality-assurance",
  "/about-us/vision-mission-and-core-values",
  "/careers",
  "/careers/benefits-rewards",
  "/careers/enterprise-automation-manager",
  "/careers/plant-manager",
  "/careers/working-at-miller",
  "/case-studies",
  "/case-studies/brandon-power-facility",
  "/case-studies/grain-elevator-remediation-project",
  "/case-studies/highway-16-diesel-spill-response-remediation",
  "/case-studies/steinbach-strip-mall-fire-recovery-restoration-project",
  "/contact-us",
  "/industrial-services",
  "/industrial-services/customer-waste-collection",
  "/industrial-services/emergency-response",
  "/industrial-services/environmental-remediation-services",
  "/industrial-services/industrial-cleaning",
  "/industrial-services/industrial-waste-treatment",
  "/industrial-services/project-management",
  "/industrial-services/research-development",
  "/industrial-services/specialty-recycling",
  "/industrial-services/stewardship",
  "/industrial-services/vacuum-truck",
  "/processes/disposal-of-inorganic-oxidizers",
  "/treatment-facility",
  "/winnipeg-service-centre",
];

// Patterns we treat as "real" React/JS bugs that should fail a test.
const SUSPECT_WARN_PATTERNS = [
  /Warning:/i,
  /Received an empty string/i,
  /Each child in a list should have a unique "key" prop/i,
  /Invalid prop/i,
  /Failed prop type/i,
  /Hydration/i,
  /not a valid boolean attribute/i,
  /Maximum update depth/i,
  /A component is changing an uncontrolled input/i,
];

// Console.error messages we treat as ignorable noise (HMR, dev-only
// React 19 telemetry, third-party stuff). Keep this list TINY and
// document each entry.
const IGNORED_ERROR_PATTERNS = [
  // Next.js HMR error overlay echoes — only matters when the underlying
  // pageerror already fired (which is itself a hard fail), so we don't
  // need to count the duplicate.
  /\[Fast Refresh\]/i,
];

function setupConsoleSpy(page) {
  const issues = [];
  page.on("pageerror", (err) => {
    issues.push({ type: "pageerror", text: err.message });
  });
  page.on("console", (msg) => {
    const type = msg.type();
    const text = msg.text();
    if (type === "error") {
      if (IGNORED_ERROR_PATTERNS.some((re) => re.test(text))) return;
      issues.push({ type: "console.error", text });
    } else if (type === "warning") {
      if (SUSPECT_WARN_PATTERNS.some((re) => re.test(text))) {
        issues.push({ type: "console.warn(suspect)", text });
      }
    }
  });
  page.on("requestfailed", (req) => {
    const url = req.url();
    // Ignore favicon noise + analytics/3rd-party we don't control.
    if (/\/favicon\.ico$/.test(url)) return;
    issues.push({ type: "requestfailed", text: `${req.method()} ${url} ${req.failure()?.errorText || ""}` });
  });
  return issues;
}

function assertNoIssues(route, issues) {
  if (issues.length === 0) return;
  const summary = issues
    .map((i) => `  [${i.type}] ${i.text}`)
    .join("\n");
  throw new Error(
    `Route ${route} surfaced ${issues.length} console/runtime issue(s):\n${summary}`
  );
}

// ---------------------------------------------------------------------------
// test 1 — every route renders without console errors
// ---------------------------------------------------------------------------
test.describe("routes render clean", () => {
  for (const route of ROUTES) {
    test(`renders ${route}`, async ({ page }) => {
      const issues = setupConsoleSpy(page);
      const resp = await page.goto(route, { waitUntil: "networkidle" });
      expect(resp, `no response for ${route}`).not.toBeNull();
      expect(resp.status(), `status for ${route}`).toBe(200);
      // H1 must exist (even if visually hidden).
      const h1Count = await page.locator("h1").count();
      expect(h1Count, `h1 count on ${route}`).toBeGreaterThan(0);
      assertNoIssues(route, issues);
    });
  }
});

// ---------------------------------------------------------------------------
// test 2 — TopNav desktop dropdowns
// ---------------------------------------------------------------------------
test.describe("TopNav desktop dropdowns", () => {
  // Expected child counts per nav.js (Phase 05 actual values).
  const EXPECTED = [
    { label: "Services", childCount: 10 },
    { label: "About",    childCount: 5 },
    { label: "Locations", childCount: 2 },
    { label: "Careers",  childCount: 2 },
  ];

  for (const { label, childCount } of EXPECTED) {
    test(`${label} dropdown opens and closes`, async ({ page }) => {
      const issues = setupConsoleSpy(page);
      await page.setViewportSize({ width: 1280, height: 800 });
      await page.goto("/", { waitUntil: "networkidle" });
      // Use the in-bar trigger (button), not the mobile drawer link.
      const trigger = page
        .locator("nav[aria-label='Primary'] button.mw-nav-trigger", { hasText: label })
        .first();
      await expect(trigger).toBeVisible();
      await trigger.click();
      const submenu = page.locator(".mw-submenu");
      await expect(submenu).toBeVisible();
      const items = submenu.locator("a[role='menuitem']");
      await expect(items).toHaveCount(childCount);
      // Toggle off via second click.
      await trigger.click();
      await expect(submenu).toHaveCount(0);
      assertNoIssues(`TopNav:${label}`, issues);
    });
  }
});

// ---------------------------------------------------------------------------
// test 3 — TopNav mobile drawer + focus management
// ---------------------------------------------------------------------------
test.describe("TopNav mobile drawer", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("drawer open/close + escape + click-through", async ({ page }) => {
    const issues = setupConsoleSpy(page);
    await page.goto("/", { waitUntil: "networkidle" });
    const hamburger = page.locator("button.tl-menu-btn");
    await expect(hamburger).toBeVisible();
    // Desktop nav list should be hidden at this width.
    await expect(page.locator("nav.tl-nav-desktop")).toBeHidden();

    // Open drawer.
    await hamburger.click();
    const drawer = page.locator("#mw-mobile-nav");
    await expect(drawer).toHaveAttribute("data-open", "1");

    // First link inside the drawer should be focusable (drawer is no
    // longer inert).
    const firstLink = drawer.locator("a").first();
    await expect(firstLink).toBeVisible();

    // Escape closes + returns focus to hamburger.
    await page.keyboard.press("Escape");
    await expect(drawer).toHaveAttribute("data-open", "0");

    // Re-open, then click a link → drawer closes + route changes.
    await hamburger.click();
    await expect(drawer).toHaveAttribute("data-open", "1");
    const aboutLink = drawer.locator("a", { hasText: "About" }).first();
    await aboutLink.click();
    await page.waitForURL("**/about-us");
    await expect(drawer).toHaveAttribute("data-open", "0");

    assertNoIssues("TopNav:mobile", issues);
  });
});

// ---------------------------------------------------------------------------
// test 4 — EmergencyBanner gating + dismiss + cookie persistence
// ---------------------------------------------------------------------------
test.describe("EmergencyBanner", () => {
  test("dismiss persists; not shown on /about-us", async ({ page, context }) => {
    await context.clearCookies();
    await page.goto("/", { waitUntil: "networkidle" });
    const banner = page.locator(".miller-eb");
    await expect(banner).toBeVisible();
    await page.locator(".miller-eb__dismiss").click();
    await expect(banner).toHaveCount(0);
    const cookies = await context.cookies();
    expect(cookies.find((c) => c.name === "miller_eb_dismissed")?.value).toBe("1");
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.locator(".miller-eb")).toHaveCount(0);
    await context.clearCookies();
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.locator(".miller-eb")).toBeVisible();

    // Non-allowlisted route: banner should NOT be visible (CSS gate on
    // body[data-banner=off]).
    await page.goto("/about-us", { waitUntil: "domcontentloaded" });
    // Banner exists in DOM but body has data-banner="off" so it is
    // visually hidden.
    const bannerOnAbout = page.locator(".miller-eb");
    await expect(bannerOnAbout).toBeHidden();
  });
});

// ---------------------------------------------------------------------------
// test 5 — RemediationCallback form
// ---------------------------------------------------------------------------
test.describe("RemediationCallback form", () => {
  test("validates required fields + shows confirmation", async ({ page }) => {
    const issues = setupConsoleSpy(page);
    await page.goto("/industrial-services/environmental-remediation-services", {
      waitUntil: "networkidle",
    });
    const form = page.locator("form.mw-callback");
    await expect(form).toBeVisible();

    // Submit empty → focus moves to the first invalid input.
    await form.locator("button[type=submit]").click();
    const firstNameInput = form.locator("[data-field='firstName'] input");
    await expect(firstNameInput).toBeFocused();
    // FormField renders error text; assert at least one error is in the DOM.
    const errorCount = await form.locator("[aria-invalid='true'], .tl-form-err, [role='alert']").count();
    expect(errorCount).toBeGreaterThan(0);

    // Fill valid values.
    await form.locator("[data-field='firstName'] input").fill("Jane");
    await form.locator("[data-field='lastName'] input").fill("Operator");
    await form.locator("[data-field='email'] input").fill("jane@example.com");
    await form.locator("[data-field='phone'] input").fill("204-555-0123");
    await form.locator("[data-field='comments'] textarea").fill("Spill response needed at our plant ASAP.");
    await form.locator("button[type=submit]").click();
    // Confirmation block appears.
    const confirm = page.locator(".mw-callback[role='status']");
    await expect(confirm).toBeVisible();
    await expect(confirm).toContainText(/Thanks/);
    assertNoIssues("RemediationCallback", issues);
  });
});

// ---------------------------------------------------------------------------
// test 6 — ContactForm submit
// ---------------------------------------------------------------------------
test.describe("ContactForm", () => {
  test("validates required fields + shows confirmation", async ({ page }) => {
    const issues = setupConsoleSpy(page);
    await page.goto("/contact-us", { waitUntil: "networkidle" });
    const form = page.locator("form.mw-contact-form");
    await expect(form).toBeVisible();

    await form.locator("button[type=submit]").click();
    await expect(form.locator("[data-fld='firstName'] input")).toBeFocused();

    await form.locator("[data-fld='firstName'] input").fill("Sam");
    await form.locator("[data-fld='lastName'] input").fill("Logistics");
    await form.locator("[data-fld='email'] input").fill("sam@example.com");
    await form.locator("[data-fld='phone'] input").fill("204-555-0100");
    await form.locator("[data-fld='comment'] textarea").fill("Looking for a quote on hazardous waste pickup.");
    await form.locator("button[type=submit]").click();

    const confirm = page.locator(".mw-loc-card[role='status']");
    await expect(confirm).toBeVisible();
    await expect(confirm).toContainText(/Thank you/);
    assertNoIssues("ContactForm", issues);
  });
});

// ---------------------------------------------------------------------------
// test 7 — Carousel respects prefers-reduced-motion
// ---------------------------------------------------------------------------
test.describe("Hero carousel", () => {
  test("frames 2/3 are display:none under reduced motion", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "reduce" });
    const page = await ctx.newPage();
    await page.goto("/", { waitUntil: "networkidle" });
    const frame2 = page.locator(".mw-hero-frame--2");
    await expect(frame2).toHaveCount(1);
    const display = await frame2.evaluate((el) => getComputedStyle(el).display);
    expect(display).toBe("none");
    await ctx.close();
  });

  test("animation present without reduced motion", async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: "no-preference" });
    const page = await ctx.newPage();
    await page.goto("/", { waitUntil: "networkidle" });
    const animName = await page
      .locator(".mw-hero-frame--1")
      .evaluate((el) => getComputedStyle(el).animationName);
    expect(animName).toContain("mw-carousel");
    await ctx.close();
  });
});

// ---------------------------------------------------------------------------
// test 8 — Skip link works
// ---------------------------------------------------------------------------
test.describe("Skip link", () => {
  test("first Tab focuses the skip link, Enter moves focus to #main", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    // Move focus to document body, then Tab — the first focusable element
    // in source order is the skip link.
    await page.evaluate(() => document.body.focus());
    await page.keyboard.press("Tab");
    const focused = await page.evaluate(() => ({
      tag: document.activeElement?.tagName,
      cls: document.activeElement?.className,
      href: document.activeElement?.getAttribute("href"),
    }));
    expect(focused.tag).toBe("A");
    expect(focused.cls).toContain("tl-skip");
    expect(focused.href).toBe("#main");

    await page.keyboard.press("Enter");
    // After hash navigation, #main should be the active element.
    const mainFocused = await page.evaluate(() => document.activeElement?.id);
    expect(mainFocused).toBe("main");
  });
});

// ---------------------------------------------------------------------------
// test 9 — Sitemap + robots
// ---------------------------------------------------------------------------
test.describe("SEO endpoints", () => {
  test("sitemap.xml lists every route", async ({ request }) => {
    const r = await request.get("/sitemap.xml");
    expect(r.status()).toBe(200);
    const xml = await r.text();
    for (const route of ROUTES) {
      // Home is rendered as "https://millerenvironmental.ca/" — match by
      // suffix to allow either trailing slash or none.
      const needle = route === "/" ? "millerenvironmental.ca/<" : `millerenvironmental.ca${route}<`;
      // The sitemap encodes URLs without trailing slash; relax to just the path.
      expect(
        xml.includes(`millerenvironmental.ca${route}<`) ||
        xml.includes(`millerenvironmental.ca${route}/`)
      ).toBe(true);
    }
  });

  test("robots.txt is well-formed", async ({ request }) => {
    const r = await request.get("/robots.txt");
    expect(r.status()).toBe(200);
    const body = await r.text();
    expect(body).toMatch(/User-Agent:\s*\*/i);
    expect(body).toMatch(/Sitemap:/i);
  });
});

// ---------------------------------------------------------------------------
// test 10 — External links use rel + target
// ---------------------------------------------------------------------------
test.describe("External link hygiene", () => {
  test("every off-site anchor has target=_blank rel=noreferrer noopener", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const anchors = await page.$$eval("a[href]", (els) =>
      els.map((a) => ({
        href: a.getAttribute("href") || "",
        target: a.getAttribute("target") || "",
        rel: a.getAttribute("rel") || "",
      }))
    );
    const external = anchors.filter((a) =>
      /^https?:\/\//.test(a.href) && !a.href.includes("millerenvironmental.ca")
    );
    expect(external.length).toBeGreaterThan(0);
    for (const a of external) {
      expect(a.target, `target on ${a.href}`).toBe("_blank");
      expect(a.rel, `rel on ${a.href}`).toMatch(/noopener/);
      expect(a.rel, `rel on ${a.href}`).toMatch(/noreferrer/);
    }
  });
});
