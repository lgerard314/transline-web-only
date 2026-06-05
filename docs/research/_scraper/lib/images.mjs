// Parse an HTML srcset attribute into candidates. Width descriptor "800w" -> w:800,
// density descriptor "2x" -> d:2. Missing descriptor defaults to d:1.
export function parseSrcset(srcset) {
  if (!srcset || !srcset.trim()) return [];
  return srcset.split(',').map((part) => {
    const [url, desc] = part.trim().split(/\s+/, 2);
    const out = { url, w: 0, d: 1 };
    if (desc && desc.endsWith('w')) out.w = parseInt(desc, 10) || 0;
    else if (desc && desc.endsWith('x')) out.d = parseFloat(desc) || 1;
    return out;
  }).filter((c) => c.url);
}

// Choose the largest candidate URL. Width wins over density; if neither srcset
// candidate beats it, fall back to the element's src/currentSrc.
export function pickLargest(srcset, fallbackSrc) {
  const cands = parseSrcset(srcset);
  if (cands.length === 0) return fallbackSrc;
  const byWidth = cands.filter((c) => c.w > 0).sort((a, b) => b.w - a.w);
  if (byWidth.length) return byWidth[0].url;
  const byDensity = cands.slice().sort((a, b) => b.d - a.d);
  return byDensity[0].url || fallbackSrc;
}
