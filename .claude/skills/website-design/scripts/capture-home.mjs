/**
 * capture-home.mjs — canonical, agent-free capture harness for the approved home-page reference screenshots.
 *
 * Usage:
 *   node .claude/skills/website-design/scripts/capture-home.mjs --class all
 *   node .claude/skills/website-design/scripts/capture-home.mjs --class phone --section 06 --out .scratch/harness-build/out
 *
 * Args:
 *   --class   desktop | phone | tablet-portrait | tablet-landscape | all   (default all)
 *   --section NN prefix (e.g. 06) | all                                    (default all)
 *   --out     output root (default: the approved/home tree). Files land in <out>/<class>/<file>.
 *
 * Behavior (consolidated from the proven scratch scripts — see manifest header):
 *   - Uses the RUNNING shared dev server on :3001. Never starts/stops/restarts anything.
 *   - Fresh chromium.launch() per class; classes run sequentially in one process; browser closed after each.
 *   - Stepped REAL scrolls per the manifest walk strategy; never scrollIntoView through pinned runways.
 *   - Viewport screenshots only (single sanctioned exception: desktop roster full-section element shot).
 *   - Each shot converges on its poseCondition with bounded retries; image-decode waits are RACED against a
 *     hard timeout (img.decode() hangs forever on lazy below-fold images — vbec-numeral-fix finding).
 *   - Failed poses are saved as <name>.FAILED.png — a good shot in the out tree is never overwritten by a failure.
 *   - Writes <out>/capture-report-<class>.json per class + merged <out>/capture-report.json; exits nonzero on any failure.
 */

import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BASE_URL, CLASSES, MANIFEST, PROBES } from './capture-home-manifest.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_OUT = path.resolve(__dirname, '..', 'references', 'approved', 'home');

// ── args ────────────────────────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const argVal = (name, dflt) => {
  const i = argv.indexOf(name);
  return i !== -1 && argv[i + 1] != null ? argv[i + 1] : dflt;
};
const clsArg = argVal('--class', 'all');
const sectionArg = argVal('--section', 'all');
const outRoot = path.resolve(argVal('--out', DEFAULT_OUT));

const classList = clsArg === 'all' ? Object.keys(CLASSES) : [clsArg];
for (const c of classList) {
  if (!CLASSES[c]) { console.error(`Unknown --class "${c}". Valid: ${Object.keys(CLASSES).join(', ')}, all`); process.exit(2); }
}

const log = (...a) => console.log('[capture-home]', ...a);

// ── scroll helpers ──────────────────────────────────────────────────────────────────────────────
const getScrollY = (page) => page.evaluate(() => window.scrollY);
const scrollToY = (page, y) => page.evaluate((t) => window.scrollTo({ top: t, behavior: 'instant' }), Math.max(0, Math.round(y)));
const scrollBy = async (page, dy, wait) => { await page.evaluate((d) => window.scrollBy(0, d), dy); await page.waitForTimeout(wait); };

// Stepped real scrolls (~500px / 350ms) going DOWN so reveals/lazy-load/pin choreography run honestly.
// Going UP jumps directly (the proven scripts treat backward as safe outside careers, which is forward-only).
async function stepScrollTo(page, targetY, stepSize = 500, waitMs = 350) {
  const target = Math.max(0, Math.round(targetY));
  let y = await getScrollY(page);
  if (target <= y) { await scrollToY(page, target); await page.waitForTimeout(waitMs); return; }
  while (y < target - 1) {
    y = Math.min(y + stepSize, target);
    await scrollToY(page, y);
    await page.waitForTimeout(waitMs);
  }
}

// ── image wait: poll viewport imgs, then decode with a hard timeout race ───────────────────────
async function waitImages(page, scopeSel, pollMs = 4000, decodeCapMs = 3000) {
  const t0 = Date.now();
  let unloaded = [];
  while (Date.now() - t0 < pollMs) {
    unloaded = await page.evaluate((scope) => {
      const root = scope ? document.querySelector(scope) : document;
      if (!root) return [];
      return Array.from(root.querySelectorAll('img'))
        .filter((img) => { const r = img.getBoundingClientRect(); return r.top < window.innerHeight && r.bottom > 0 && r.left < window.innerWidth && r.right > 0 && img.naturalWidth === 0; })
        .map((img) => (img.currentSrc || img.src || '(no src)').slice(-60));
    }, scopeSel || null);
    if (unloaded.length === 0) break;
    await page.waitForTimeout(200);
  }
  const decodeResult = await page.evaluate(async ({ scope, cap }) => {
    const timeout = (ms) => new Promise((r) => setTimeout(r, ms, 'timeout'));
    const root = scope ? document.querySelector(scope) : document;
    if (!root) return 'no-scope';
    const imgs = Array.from(root.querySelectorAll('img')).filter((img) => { const r = img.getBoundingClientRect(); return r.top < window.innerHeight && r.bottom > 0 && r.left < window.innerWidth && r.right > 0; });
    // img.decode() can stay pending forever on lazy below-fold images — race a hard cap.
    return Promise.race([Promise.all(imgs.map((i) => (i.decode ? i.decode().catch(() => {}) : 0))).then(() => 'decoded'), timeout(cap)]);
  }, { scope: scopeSel || null, cap: decodeCapMs });
  return { waitedMs: Date.now() - t0, unloadedInViewport: unloaded.length, unloaded: unloaded.slice(0, 5), decodeResult };
}

const hideDevPortal = (page) => page.addStyleTag({ content: 'nextjs-portal{display:none!important}' }).catch(() => {});

const probeState = (page, key, args) => page.evaluate(PROBES[key], args ?? null);

// ── walk strategy executors ─────────────────────────────────────────────────────────────────────
async function execWalk(page, shot, ctx) {
  const w = shot.walk;
  switch (w.strategy) {
    case 'top': {
      await scrollToY(page, 0);
      await page.waitForTimeout(500);
      return;
    }
    case 'band': {
      for (let i = 0; i < 4; i++) {
        const m = await probeState(page, 'section', w.selector);
        if (m.missing) throw new Error(`band walk: missing ${w.selector}`);
        const center = m.absTop + m.height / 2 - ctx.VH / 2;
        const target = Math.max(0, Math.min(center, m.absTop - (w.minTop ?? 120)));
        if (Math.abs(target - m.scrollY) <= 6) return;
        await stepScrollTo(page, target);
      }
      return;
    }
    case 'sectionTarget': {
      if (w.through) {
        const m0 = await probeState(page, 'section', w.selector);
        if (m0.missing) throw new Error(`sectionTarget walk: missing ${w.selector}`);
        await stepScrollTo(page, Math.max(0, m0.absTop + m0.height - ctx.VH / 2));
      }
      for (let i = 0; i < 4; i++) {
        const m = await probeState(page, 'section', w.selector);
        if (m.missing) throw new Error(`sectionTarget walk: missing ${w.selector}`);
        const target = Math.max(0, Math.round(w.target(m, ctx)));
        if (Math.abs(target - m.scrollY) <= 6) return;
        await stepScrollTo(page, target);
      }
      return;
    }
    case 'converge': {
      const maxSteps = w.maxSteps ?? 60;
      const wait = w.stepWait ?? 300;
      for (let i = 0; i < maxSteps; i++) {
        const s = await probeState(page, w.probe, w.probeArgs ?? shot.probeArgs);
        if (w.done(s, ctx)) return;
        let d = w.step(s, ctx);
        if (!d) return; // stuck or arrived-but-not-posed: settle + poseCondition decide
        if (w.forwardOnly && d < 0) return;
        await scrollBy(page, Math.round(d), wait);
      }
      return; // out of steps — poseCondition will flag if the pose was missed
    }
    case 'hoverRow': {
      for (let i = 0; i < 3; i++) {
        const r = await page.evaluate(({ sel, idx }) => {
          const el = document.querySelectorAll(sel)[idx];
          if (!el) return null;
          const b = el.getBoundingClientRect();
          return { scrollY: window.scrollY, top: b.top, h: b.height };
        }, { sel: w.rowSelector, idx: w.index });
        if (!r) throw new Error(`hoverRow walk: missing ${w.rowSelector}[${w.index}]`);
        const target = Math.max(0, r.scrollY + r.top + r.h / 2 - ctx.VH / 2);
        if (Math.abs(target - r.scrollY) <= 6) break;
        await stepScrollTo(page, target);
      }
      await page.locator(w.rowSelector).nth(w.index).hover({ force: true });
      return;
    }
    case 'finalCta': {
      const docH = await page.evaluate(() => document.documentElement.scrollHeight);
      await stepScrollTo(page, Math.max(0, docH - ctx.VH));
      const s = await probeState(page, 'finalCta');
      if (s.missing) throw new Error('finalCta walk: missing .mw-final');
      let target = s.headAbsTop != null ? s.headAbsTop - (w.headlineTop ?? 100) : s.absTop;
      if (s.headAbsTop != null && s.socialsAbsBottom != null && s.socialsAbsBottom - target > ctx.VH - 10) {
        const span = s.socialsAbsBottom - s.headAbsTop;
        const pad = Math.max(20, Math.floor((ctx.VH - span) / 2));
        target = s.headAbsTop - pad;
      }
      await stepScrollTo(page, Math.max(0, Math.min(target, docH - ctx.VH)));
      return;
    }
    default:
      throw new Error(`Unknown walk strategy: ${w.strategy}`);
  }
}

// ── per-class run ───────────────────────────────────────────────────────────────────────────────
async function runClass(cls) {
  const cfg = CLASSES[cls];
  const ctx = { VW: cfg.width, VH: cfg.height, cls };
  const shots = MANIFEST[cls].filter((s) => sectionArg === 'all' || s.section === sectionArg);
  const outDir = path.join(outRoot, cls);
  fs.mkdirSync(outDir, { recursive: true });

  const report = { class: cls, viewport: cfg, baseUrl: BASE_URL, sectionFilter: sectionArg, startedAt: new Date().toISOString(), shots: [], pageErrors: [] };
  const t0 = Date.now();
  log(`=== class ${cls} (${cfg.width}x${cfg.height} dpr${cfg.dpr}${cfg.touch ? ' touch' : ' fine-pointer'}) — ${shots.length} shot(s) -> ${outDir}`);

  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({
      viewport: { width: cfg.width, height: cfg.height },
      deviceScaleFactor: cfg.dpr,
      ...(cfg.touch ? { isMobile: true, hasTouch: true } : {}),
    });
    const page = await context.newPage();
    page.on('pageerror', (e) => report.pageErrors.push(String(e).slice(0, 200)));

    try {
      await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 60000 });
    } catch (e) {
      throw new Error(`Could not load ${BASE_URL} — is the shared dev server running on :3001? (${e.message})`);
    }
    await hideDevPortal(page);
    await page.waitForTimeout(3000); // load-reveal settle
    await hideDevPortal(page);       // re-inject after hydration
    await scrollToY(page, 0);
    await page.waitForTimeout(500);

    for (const shot of shots) {
      const s0 = Date.now();
      const entry = { file: shot.file, section: shot.section, pose: shot.pose };
      try {
        await execWalk(page, shot, ctx);
        await hideDevPortal(page);
        entry.imageWait = await waitImages(page, shot.imageScope);
        await page.waitForTimeout(shot.settleMs ?? 400);
        const state = await probeState(page, shot.probe, shot.probeArgs);
        entry.scrollY = state.scrollY;
        entry.probe = state;
        entry.poseConverged = !state.missing && (!shot.poseCondition || !!shot.poseCondition(state, ctx));
      } catch (e) {
        entry.error = String(e && e.message || e).slice(0, 300);
        entry.poseConverged = false;
      }
      const fileName = entry.poseConverged ? shot.file : shot.file.replace(/\.png$/i, '.FAILED.png');
      const outPath = path.join(outDir, fileName);
      // Screenshot with one retry — a busy dev-server main thread (HMR from parallel agents) can stall the first attempt.
      let shotErr = null;
      for (let attempt = 0; attempt < 2; attempt++) {
        try {
          if (shot.capture === 'element') {
            await page.locator(shot.captureSelector).first().screenshot({ path: outPath, timeout: 25000 });
          } else {
            await page.screenshot({ path: outPath, fullPage: false, timeout: 25000 });
          }
          shotErr = null;
          entry.savedAs = fileName;
          entry.bytes = fs.statSync(outPath).size;
          break;
        } catch (e) {
          shotErr = e;
          await page.waitForTimeout(1500);
        }
      }
      if (shotErr) {
        entry.error = (entry.error ? entry.error + ' | ' : '') + 'screenshot: ' + String(shotErr && shotErr.message || shotErr).slice(0, 200);
        entry.poseConverged = false;
      }
      entry.ms = Date.now() - s0;
      report.shots.push(entry);
      log(`  ${entry.poseConverged ? 'OK    ' : 'FAILED'} ${shot.file}  scrollY=${entry.scrollY ?? '?'}  ${entry.ms}ms${entry.error ? '  err=' + entry.error : ''}`);
    }
  } finally {
    await browser.close();
  }

  report.durationMs = Date.now() - t0;
  report.failures = report.shots.filter((s) => !s.poseConverged).length;
  fs.mkdirSync(outRoot, { recursive: true });
  fs.writeFileSync(path.join(outRoot, `capture-report-${cls}.json`), JSON.stringify(report, null, 2));
  log(`=== class ${cls} done: ${report.shots.length - report.failures}/${report.shots.length} converged in ${(report.durationMs / 1000).toFixed(1)}s`);
  return report;
}

// ── main ────────────────────────────────────────────────────────────────────────────────────────
const all = [];
for (const cls of classList) {
  all.push(await runClass(cls)); // sequential by design — parallelism comes from backgrounding the process
}
const merged = { args: { class: clsArg, section: sectionArg, out: outRoot }, finishedAt: new Date().toISOString(), classes: all };
fs.writeFileSync(path.join(outRoot, 'capture-report.json'), JSON.stringify(merged, null, 2));

const totalFail = all.reduce((n, r) => n + r.failures, 0);
const totalShots = all.reduce((n, r) => n + r.shots.length, 0);
log(`ALL DONE: ${totalShots - totalFail}/${totalShots} shots converged. Report: ${path.join(outRoot, 'capture-report.json')}`);
if (totalFail > 0) {
  log(`${totalFail} shot(s) FAILED their pose condition (saved with .FAILED.png suffix).`);
  process.exit(1);
}
