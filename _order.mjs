import { chromium } from 'playwright-core';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const e = [];
p.on('pageerror', x => e.push(x.message));
await p.goto('http://localhost:3001/', { waitUntil: 'networkidle' });
// report DOM order of the relevant sections
const order = await p.evaluate(() => {
  const map = [
    ['.mw-sec2', 'Who we serve'],
    ['.mw-lifetime-reel, [class*="lifetime-reel"], [class*="reel"]', 'Lifetime reel (3 diamonds)'],
    ['.mw-fac2', 'VBEC'],
  ];
  // get all sections in document order, tag known ones
  const secs = [...document.querySelectorAll('section')];
  const tagged = secs.map(s => {
    const c = s.className || '';
    if (c.includes('mw-sec2')) return 'Who we serve';
    if (c.includes('reel') || c.includes('lifetime')) return 'Lifetime reel (3 diamonds)';
    if (c.includes('mw-fac2')) return 'VBEC';
    if (c.includes('mw-svcs') || c.includes('bento')) return 'Services';
    return null;
  }).filter(Boolean);
  return tagged;
});
console.log('Section order:', JSON.stringify(order));
console.log('pageerrors:', e.length, e.slice(0,2));
await b.close();
