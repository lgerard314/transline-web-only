// playwright-audit.mjs — visual + functional audit of the TransLine49° site
// Usage: node .aws/playwright-audit.mjs [base-url] [out-dir]
import { chromium } from 'playwright';
import fs from 'node:fs/promises';
import path from 'node:path';

const BASE = process.argv[2] || 'http://127.0.0.1:4937/';
const OUT  = process.argv[3] || '.aws/screens';

// Pages are SPA-routed via clicking nav items. Use page ids that map to TopNav.
const PAGES = [
  { id: 'home',     navLabel: 'Home' },
  { id: 'services', navLabel: 'Services' },
  { id: 'process',  navLabel: 'Cross-Border Process' },
  { id: 'about',    navLabel: 'About' },
  { id: 'contact',  navLabel: 'Contact' },
];

const VIEWPORTS = [
  { name: 'mobile-390',  width: 390,  height: 844  },
  { name: 'tablet-768',  width: 768,  height: 1024 },
  { name: 'desktop-1280',width: 1280, height: 800  },
  { name: 'wide-1920',   width: 1920, height: 1080 },
];

await fs.mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
const report = { base: BASE, runs: [] };

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  const consoleMsgs = [];
  page.on('console', (m) => consoleMsgs.push({ type: m.type(), text: m.text() }));
  page.on('pageerror', (err) => consoleMsgs.push({ type: 'pageerror', text: String(err) }));

  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 15000 });
  await page.waitForSelector('.tl-shell', { timeout: 10000 });

  for (const pg of PAGES) {
    if (pg.id !== 'home') {
      // click the nav link by visible label
      const link = page.locator('.tl-nav-list a', { hasText: pg.navLabel });
      const count = await link.count();
      if (count > 0) {
        await link.first().click();
      } else {
        // mobile may have a hamburger; try opening it first
        const burger = page.locator('[data-tl-menu-btn]');
        if (await burger.count()) {
          await burger.first().click();
          await page.waitForTimeout(150);
          await page.locator('[data-tl-mobile-nav] a', { hasText: pg.navLabel }).first().click();
        }
      }
      await page.waitForTimeout(400);
    }
    // measure scroll height + horizontal overflow
    const measured = await page.evaluate(() => {
      const root = document.querySelector('.tl-shell');
      const scroller = document.querySelector('.tl-shell')?.parentElement;
      const h = (root?.scrollHeight || document.body.scrollHeight) | 0;
      const w = document.documentElement.scrollWidth | 0;
      const vw = window.innerWidth | 0;
      return { h, w, vw, hasHorizontalScroll: w > vw + 1 };
    });
    const file = `${pg.id}-${vp.name}.png`;
    await page.screenshot({ path: path.join(OUT, file), fullPage: true });
    report.runs.push({
      page: pg.id, viewport: vp.name, w: vp.width, h: vp.height,
      shotPath: file, measured, consoleEvents: [...consoleMsgs],
    });
    consoleMsgs.length = 0;
  }
  await ctx.close();
}

await browser.close();
await fs.writeFile(path.join(OUT, 'report.json'), JSON.stringify(report, null, 2));

// Print a terse digest
const digest = report.runs.map((r) => {
  const errs = r.consoleEvents.filter((e) => e.type === 'error' || e.type === 'pageerror').length;
  const overflow = r.measured.hasHorizontalScroll ? '  HORIZ_OVERFLOW' : '';
  return `${r.page.padEnd(9)} ${r.viewport.padEnd(14)} h=${String(r.measured.h).padEnd(5)} w=${r.measured.w}/${r.measured.vw} errs=${errs}${overflow}`;
}).join('\n');
console.log(digest);
