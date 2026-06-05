import { createHash } from 'node:crypto';
import { mkdir, writeFile, access } from 'node:fs/promises';
import path from 'node:path';

const IMG_EXT = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif', '.bmp', '.ico'];
const DOC_EXT = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.csv', '.txt'];

export function classifyAsset(url) {
  const ext = path.extname(new URL(url).pathname).toLowerCase();
  if (IMG_EXT.includes(ext)) return { kind: 'image', ext };
  if (DOC_EXT.includes(ext)) return { kind: 'document', ext };
  return { kind: 'image', ext: ext || '' }; // unknown image-ish (CDN without ext) -> treat as image, sniff later
}

function sanitizeName(url) {
  const base = path.basename(new URL(url).pathname) || 'asset';
  return base.replace(/[<>:"/\\|?*]/g, '-').slice(0, 60);
}

// Downloads `url` via the shared Playwright APIRequestContext `req`.
// Dedups by content hash across the whole site (cache Map keyed by url).
// Returns { localPath, kind } relative to siteDir, or null on failure.
export async function downloadAsset(req, url, siteDir, cache) {
  if (cache.has(url)) return cache.get(url);
  let result = null;
  try {
    const resp = await req.get(url, { timeout: 30000 });
    if (!resp.ok()) throw new Error('HTTP ' + resp.status());
    const buf = await resp.body();
    const ctype = (resp.headers()['content-type'] || '').toLowerCase();
    const { kind, ext } = resolveKind(url, ctype);
    const hash = createHash('sha1').update(buf).digest('hex').slice(0, 12);
    const folder = kind === 'document' ? 'documents' : 'photos';
    const fileName = `${hash}__${ensureExt(sanitizeName(url), ext)}`;
    const absDir = path.join(siteDir, folder);
    const absPath = path.join(absDir, fileName);
    const rel = `${folder}/${fileName}`;
    if (!(await exists(absPath))) {
      await mkdir(absDir, { recursive: true });
      await writeFile(absPath, buf);
    }
    result = { localPath: rel, kind, bytes: buf.length };
  } catch (e) {
    result = null;
    // caller logs the failure with the url
  }
  cache.set(url, result);
  return result;
}

function resolveKind(url, ctype) {
  const base = classifyAsset(url);
  if (ctype.includes('pdf')) return { kind: 'document', ext: '.pdf' };
  if (ctype.startsWith('image/')) {
    const ext = '.' + ctype.split('/')[1].split(';')[0].replace('jpeg', 'jpg').replace('svg+xml', 'svg');
    return { kind: 'image', ext: base.ext || ext };
  }
  return base;
}

function ensureExt(name, ext) {
  if (ext && !name.toLowerCase().endsWith(ext)) return name + ext;
  return name;
}

async function exists(p) { try { await access(p); return true; } catch { return false; } }
