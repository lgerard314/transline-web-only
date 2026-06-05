import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { normalizeUrl, isInScope, urlToFolderPath } from './lib/urls.mjs';
import { pickLargest } from './lib/images.mjs';
import { downloadAsset } from './lib/assets.mjs';
import { extractBlocksFn, blocksToMarkdown } from './lib/annotate.mjs';
import { writeSitemap, writeCrawlLog } from './lib/sitemap.mjs';

const DEFAULT_MAX_PAGES = 300;
const PAGE_CONCURRENCY = 3;
const DELAY_MS = 600;
const DOC_RE = /\.(pdf|docx?|xlsx?|pptx?|csv|txt)(\?|$)/i;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function crawlSite(config) {
  const { name, startUrl, primaryHost, allowedHosts, outRoot } = config;
  const MAX_PAGES = config.maxPages ?? DEFAULT_MAX_PAGES;
  const siteDir = path.join(outRoot, name);
  await mkdir(siteDir, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 2200 },
    deviceScaleFactor: 2,
    userAgent: 'Mozilla/5.0 (research archival crawler; contact lgerard@gosolto.com)',
  });
  // Speed: block heavy bytes during render. We read srcset/currentSrc from DOM and
  // download chosen assets out-of-band via the API request context.
  await context.route('**/*', (route) => {
    const t = route.request().resourceType();
    if (t === 'image' || t === 'media' || t === 'font') return route.abort();
    return route.continue();
  });
  const req = context.request;

  const queue = [normalizeUrl(startUrl)];
  const seen = new Set(queue);
  const pages = [];
  const skipped = [];
  const externalLinks = new Set();
  const assetCache = new Map();           // url -> {localPath,kind,bytes} | null
  const photoUsage = new Map();           // localPath -> {bytes,w,h,pages:Set}
  const docUsage = new Map();             // localPath -> Set(pages)
  const log = { site: name, startUrl, started: new Date().toISOString(), errors: [] };

  async function processOne(url) {
    const folderPath = urlToFolderPath(url, primaryHost, allowedHosts);
    const pageDir = path.join(siteDir, folderPath);
    const page = await context.newPage();
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      // trigger lazy content
      await autoScroll(page);
      await page.waitForTimeout(500);

      const finalUrl = normalizeUrl(page.url());
      const data = await page.evaluate(extractBlocksFn());
      const inspected = await page.content();

      // collect links for the frontier
      const hrefs = await page.$$eval('a[href]', (as) => as.map((a) => a.href));
      for (const h of hrefs) {
        if (isInScope(h, allowedHosts)) {
          if (DOC_RE.test(h)) continue; // documents are downloaded below, not crawled as pages
          const n = normalizeUrl(h);
          if (!seen.has(n)) {
            if (seen.size >= MAX_PAGES) { skipped.push({ url: n, reason: 'cap(300) reached' }); }
            else { seen.add(n); queue.push(n); }
          }
        } else if (/^https?:/.test(h)) {
          externalLinks.add(h);
        }
      }

      // download images + bg images + documents referenced by this page
      const imgIndex = new Map();
      let k = 0;
      for (const b of data.blocks) {
        if (b.type === 'img' || b.type === 'bgimg') {
          const chosen = b.type === 'img' ? pickLargest(b.srcset, b.src) : b.src;
          if (!chosen || chosen.startsWith('data:')) continue;
          const abs = absolutize(chosen, finalUrl);
          if (!abs) continue;
          const asset = await downloadAsset(req, abs, siteDir, assetCache);
          b.__key = 'k' + k++;
          if (asset) {
            imgIndex.set(b.__key, asset.localPath);
            const rec = photoUsage.get(asset.localPath) || { bytes: asset.bytes, w: b.w, h: b.h, pages: new Set() };
            rec.pages.add(folderPath);
            if ((b.w || 0) > (rec.w || 0)) { rec.w = b.w; rec.h = b.h; }
            photoUsage.set(asset.localPath, rec);
          } else {
            log.errors.push({ url: abs, on: folderPath, reason: 'asset download failed' });
          }
        }
      }
      // documents linked via <a>
      for (const h of hrefs) {
        if (!isInScope(h, allowedHosts)) continue;
        if (DOC_RE.test(h)) {
          const asset = await downloadAsset(req, h, siteDir, assetCache);
          if (asset && asset.kind === 'document') {
            const set = docUsage.get(asset.localPath) || new Set();
            set.add(folderPath); docUsage.set(asset.localPath, set);
          }
        }
      }

      const md = blocksToMarkdown(finalUrl, data, imgIndex);
      await mkdir(pageDir, { recursive: true });
      await writeFile(path.join(pageDir, 'content.md'), md, 'utf8');
      await writeFile(path.join(pageDir, 'inspected.html'), inspected, 'utf8');
      pages.push({ url: finalUrl, folderPath, title: data.title });
      process.stdout.write(`[${name}] (${pages.length}) ${folderPath}\n`);
    } catch (e) {
      skipped.push({ url, reason: 'error: ' + e.message });
      log.errors.push({ url, reason: e.message });
    } finally {
      await page.close();
    }
  }

  // worker pool draining the queue
  async function worker() {
    while (queue.length) {
      if (pages.length >= MAX_PAGES) break;
      const url = queue.shift();
      if (url === undefined) { await sleep(DELAY_MS); continue; }
      await processOne(url);
      await sleep(DELAY_MS);
    }
  }
  await Promise.all(Array.from({ length: PAGE_CONCURRENCY }, () => worker()));

  // drain any remaining queued URLs into skipped (cap case)
  for (const u of queue) skipped.push({ url: u, reason: 'cap(300) — not crawled' });

  log.finished = new Date().toISOString();
  log.pagesCrawled = pages.length;
  log.skipped = skipped;
  log.externalLinks = [...externalLinks].sort();

  await writeSitemap(siteDir, name, pages, photoUsage, docUsage, skipped);
  await writeCrawlLog(siteDir, log);
  await browser.close();
  return { name, pages: pages.length, photos: photoUsage.size, docs: docUsage.size, skipped: skipped.length };
}

function absolutize(src, base) { try { return new URL(src, base).toString(); } catch { return null; } }

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let total = 0; const step = 800;
      const timer = setInterval(() => {
        window.scrollBy(0, step); total += step;
        if (total >= document.body.scrollHeight + 2000) { clearInterval(timer); window.scrollTo(0, 0); resolve(); }
      }, 100);
    });
  });
}
