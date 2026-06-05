const TRACKING_PREFIXES = ['utm_', 'fbclid', 'gclid', 'mc_', '_ga'];

export function normalizeUrl(raw) {
  const u = new URL(raw);
  u.hash = '';
  u.hostname = u.hostname.toLowerCase();
  for (const key of [...u.searchParams.keys()]) {
    if (TRACKING_PREFIXES.some((p) => key.toLowerCase().startsWith(p))) u.searchParams.delete(key);
  }
  let s = u.toString();
  // drop trailing slash on path (but keep root "/" -> origin)
  s = s.replace(/\/(\?|$)/, '$1');
  if (s.endsWith('/')) s = s.slice(0, -1);
  return s;
}

export function isInScope(raw, allowedHosts) {
  let u;
  try { u = new URL(raw); } catch { return false; }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return false;
  return allowedHosts.includes(u.hostname.toLowerCase());
}

// primaryHost = the site's root host (e.g. millerwaste.ca). Subdomains in allowedHosts
// that differ from primaryHost get a leading folder segment of the subdomain label.
export function urlToFolderPath(raw, primaryHost, allowedHosts) {
  const u = new URL(raw);
  const host = u.hostname.toLowerCase().replace(/^www\./, '');
  const primary = primaryHost.replace(/^www\./, '');
  let path = u.pathname.replace(/^\/+|\/+$/g, '');
  let prefix = '';
  if (host !== primary && host.endsWith('.' + primary)) {
    prefix = host.slice(0, -('.' + primary).length); // e.g. residential-recycling-bins
  }
  const segs = [prefix, ...path.split('/')].filter(Boolean).map(sanitizeSeg);
  if (segs.length === 0) return 'index';
  return segs.join('/');
}

function sanitizeSeg(s) {
  return decodeURIComponent(s).replace(/[<>:"/\\|?*]/g, '-').slice(0, 80) || 'index';
}
