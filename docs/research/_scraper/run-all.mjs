import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { crawlSite } from './crawl.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_ROOT = path.resolve(__dirname, '..'); // docs/research

const SITES = [
  { name: 'millerwaste', startUrl: 'https://millerwaste.ca/', primaryHost: 'millerwaste.ca',
    allowedHosts: ['millerwaste.ca', 'www.millerwaste.ca', 'residential-recycling-bins.millerwaste.ca'] },
  { name: 'millerenvironmental', startUrl: 'https://www.millerenvironmental.ca/', primaryHost: 'millerenvironmental.ca',
    allowedHosts: ['millerenvironmental.ca', 'www.millerenvironmental.ca'] },
  { name: 'millercompost', startUrl: 'https://millercompost.ca/', primaryHost: 'millercompost.ca',
    allowedHosts: ['millercompost.ca', 'www.millercompost.ca'] },
  { name: 'millertransit', startUrl: 'https://millertransit.ca/', primaryHost: 'millertransit.ca',
    allowedHosts: ['millertransit.ca', 'www.millertransit.ca'] },
  { name: 'transline49', startUrl: 'https://transline49.com/', primaryHost: 'transline49.com',
    allowedHosts: ['transline49.com', 'www.transline49.com'] },
];

// Allow running a subset: `node run-all.mjs millercompost transline49`
const only = process.argv.slice(2);
const targets = only.length ? SITES.filter((s) => only.includes(s.name)) : SITES;

const results = await Promise.allSettled(
  targets.map((s) => crawlSite({ ...s, outRoot: OUT_ROOT })),
);

console.log('\n=== CRAWL SUMMARY ===');
for (let i = 0; i < targets.length; i++) {
  const r = results[i];
  if (r.status === 'fulfilled') console.log(`${targets[i].name}: ${JSON.stringify(r.value)}`);
  else console.log(`${targets[i].name}: FAILED — ${r.reason?.message || r.reason}`);
}
