// Image-coverage tests: every <img> + every background-image URL on
// every route must resolve to a 2xx asset (no broken paths). Also
// verifies the static asset inventory under /miller/, /certs/,
// /licences/, and the OG image are all reachable from the dev server.
//
// Run after the smoke suite so that fixes for asset path bugs land
// before final commit.

import fs from "node:fs";
import path from "node:path";
import { test, expect } from "@playwright/test";

// Resolve project root from the cwd Playwright runs from (the miller-web
// workspace root — that's where `playwright.config.js` lives).
const PROJECT_ROOT = process.cwd();
const PUBLIC_DIR = path.resolve(PROJECT_ROOT, "public");

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

// ---------------------------------------------------------------------------
// test 11 — every <img> and background-image on every route loads
// ---------------------------------------------------------------------------
test.describe("images load on every route", () => {
  for (const route of ROUTES) {
    test(`images on ${route} all return 2xx`, async ({ page, request }) => {
      const imageStatuses = [];
      page.on("response", (resp) => {
        const req = resp.request();
        if (req.resourceType() === "image" && resp.status() >= 400) {
          imageStatuses.push({ url: req.url(), status: resp.status() });
        }
      });
      await page.goto(route, { waitUntil: "networkidle" });

      // <img> elements — all must have loaded (naturalWidth > 0).
      const imgs = await page.$$eval("img", (els) =>
        els.map((el) => ({
          src: el.currentSrc || el.src,
          alt: el.getAttribute("alt"),
          complete: el.complete,
          naturalWidth: el.naturalWidth,
        }))
      );
      const broken = imgs.filter(
        (i) => !i.src || (i.complete && i.naturalWidth === 0)
      );
      expect(broken, `broken <img> on ${route}: ${JSON.stringify(broken)}`).toEqual([]);
      for (const i of imgs) {
        expect(i.alt, `missing alt on ${route} for ${i.src}`).not.toBeNull();
      }

      // background-image URLs — collect unique URLs and HEAD each one
      // through Playwright's request fixture (uses same context cookies).
      const bgUrls = await page.$$eval("*", (els) => {
        const out = new Set();
        for (const el of els) {
          const bg = getComputedStyle(el).backgroundImage;
          if (!bg || bg === "none") continue;
          const matches = bg.match(/url\(["']?([^"')]+)["']?\)/g) || [];
          for (const m of matches) {
            const u = m.replace(/url\(["']?/, "").replace(/["']?\)$/, "");
            if (!u.startsWith("data:")) out.add(u);
          }
        }
        return Array.from(out);
      });
      for (const url of bgUrls) {
        // Resolve relative URLs against the page.
        const full = url.startsWith("http") ? url : new URL(url, page.url()).toString();
        const resp = await request.head(full).catch(() => null);
        if (!resp) continue; // network fail — already counted via page response
        expect(resp.status(), `background-image ${full} on ${route}`).toBeLessThan(400);
      }

      // Any <img>-resourceType response that came back 4xx/5xx during
      // navigation also fails the test.
      expect(
        imageStatuses,
        `image responses with status>=400 on ${route}: ${JSON.stringify(imageStatuses)}`
      ).toEqual([]);
    });
  }
});

// ---------------------------------------------------------------------------
// test 12 — every code-referenced /miller/* /certs/* /licences/* asset
// is on disk AND reachable via the dev server
// ---------------------------------------------------------------------------
test.describe("static asset inventory", () => {
  // Build the inventory at test time by walking the codebase.
  const codeRoot = PROJECT_ROOT;
  const EXT_RE = /\.(jsx?|mjs|css)$/;
  const ASSET_RE = /["'`](\/(?:miller|certs|licences)\/[^"'`)]+|\/og\.(?:png|webp|jpg))["'`]/g;

  function walk(dir, acc = []) {
    if (!fs.existsSync(dir)) return acc;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      if (entry.name === "node_modules" || entry.name === ".next" || entry.name === "test-results") continue;
      const fp = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(fp, acc);
      else if (EXT_RE.test(entry.name)) acc.push(fp);
    }
    return acc;
  }

  function collectAssetRefs() {
    const refs = new Set();
    for (const file of walk(codeRoot)) {
      const text = fs.readFileSync(file, "utf8");
      let m;
      ASSET_RE.lastIndex = 0;
      while ((m = ASSET_RE.exec(text))) {
        const ref = m[1];
        // Skip directory references (`/miller/foo/`) and any path that
        // doesn't look like a real file (no extension after the last
        // slash). Those appear in comments / template strings.
        if (ref.endsWith("/")) continue;
        const tail = ref.split("/").pop();
        if (!tail.includes(".")) continue;
        refs.add(ref);
      }
    }
    return Array.from(refs).sort();
  }

  const REFS = collectAssetRefs();

  test("inventory is non-empty (sanity)", () => {
    expect(REFS.length).toBeGreaterThan(20);
  });

  test("every referenced asset exists on disk", () => {
    const missing = [];
    for (const ref of REFS) {
      const fp = path.join(PUBLIC_DIR, ref);
      if (!fs.existsSync(fp)) missing.push(ref);
    }
    expect(missing, `missing on disk: ${JSON.stringify(missing)}`).toEqual([]);
  });

  test("every referenced asset is served 200 by the dev server", async ({ request }) => {
    const failed = [];
    for (const ref of REFS) {
      const r = await request.head(ref).catch(() => null);
      if (!r || r.status() >= 400) failed.push({ ref, status: r?.status() });
    }
    expect(failed, `not served 2xx: ${JSON.stringify(failed)}`).toEqual([]);
  });
});
