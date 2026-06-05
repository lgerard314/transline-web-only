import { writeFile } from 'node:fs/promises';
import path from 'node:path';

// pages: [{ url, folderPath, title }]
// photoUsage: Map(localPath -> { bytes, w, h, pages:Set(folderPath) })
// docUsage:   Map(localPath -> Set(folderPath))
export async function writeSitemap(siteDir, siteName, pages, photoUsage, docUsage, skipped) {
  const lines = [`# ${siteName} — Site Map`, '', `Crawled ${pages.length} pages.`, '', '## Pages', ''];
  const sorted = [...pages].sort((a, b) => a.folderPath.localeCompare(b.folderPath));
  for (const p of sorted) {
    const depth = p.folderPath === 'index' ? 0 : p.folderPath.split('/').length - 1;
    lines.push(`${'  '.repeat(depth)}- [${p.title || p.folderPath}](${p.folderPath}/content.md) — ${p.url}`);
  }
  lines.push('', '## Photos (file → pages using it)', '', '| photo | natural size | bytes | used on pages |', '|---|---|---|---|');
  for (const [local, info] of [...photoUsage.entries()].sort()) {
    const usedOn = [...info.pages].sort().join(', ');
    lines.push(`| ${local} | ${info.w || '?'}×${info.h || '?'} | ${info.bytes ?? '?'} | ${usedOn} |`);
  }
  if (docUsage.size) {
    lines.push('', '## Documents (file → pages using it)', '', '| document | used on pages |', '|---|---|');
    for (const [local, pagesSet] of [...docUsage.entries()].sort()) {
      lines.push(`| ${local} | ${[...pagesSet].sort().join(', ')} |`);
    }
  }
  if (skipped.length) {
    lines.push('', '## Skipped / uncrawled (cap or error)', '');
    for (const s of skipped) lines.push(`- ${s.url} — ${s.reason}`);
  }
  await writeFile(path.join(siteDir, '_sitemap.md'), lines.join('\n') + '\n', 'utf8');
}

export async function writeCrawlLog(siteDir, log) {
  await writeFile(path.join(siteDir, '_crawl-log.json'), JSON.stringify(log, null, 2), 'utf8');
}
