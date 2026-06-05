import assert from 'node:assert/strict';
import { normalizeUrl, isInScope, urlToFolderPath } from './lib/urls.mjs';
import { parseSrcset, pickLargest } from './lib/images.mjs';

// normalizeUrl: strip fragment, trailing slash, tracking params; lowercase host
assert.equal(normalizeUrl('https://millerwaste.ca/Services/?utm_source=x#top'), 'https://millerwaste.ca/Services');
assert.equal(normalizeUrl('https://MillerWaste.ca'), 'https://millerwaste.ca');
assert.equal(normalizeUrl('https://millerwaste.ca/a/b/'), 'https://millerwaste.ca/a/b');

// isInScope: same registrable domain, allow listed subdomains, reject off-domain + mailto/tel
const allowed = ['millerwaste.ca', 'residential-recycling-bins.millerwaste.ca'];
assert.equal(isInScope('https://millerwaste.ca/x', allowed), true);
assert.equal(isInScope('https://residential-recycling-bins.millerwaste.ca/y', allowed), true);
assert.equal(isInScope('https://facebook.com/millerwaste', allowed), false);
assert.equal(isInScope('mailto:info@millerwaste.ca', allowed), false);
assert.equal(isInScope('tel:+19055551234', allowed), false);

// urlToFolderPath: homepage -> index; nested path mirrored; subdomain prefixed
assert.equal(urlToFolderPath('https://millerwaste.ca/', 'millerwaste.ca', ['millerwaste.ca']), 'index');
assert.equal(urlToFolderPath('https://millerwaste.ca/services/organics', 'millerwaste.ca', ['millerwaste.ca']), 'services/organics');
assert.equal(urlToFolderPath('https://residential-recycling-bins.millerwaste.ca/bins', 'millerwaste.ca', ['millerwaste.ca']), 'residential-recycling-bins/bins');

console.log('urls.mjs selftest OK');

// parseSrcset: returns candidates with width/density descriptors
assert.deepEqual(
  parseSrcset('a-300.jpg 300w, a-800.jpg 800w, a-1600.jpg 1600w'),
  [
    { url: 'a-300.jpg', w: 300, d: 1 },
    { url: 'a-800.jpg', w: 800, d: 1 },
    { url: 'a-1600.jpg', w: 1600, d: 1 },
  ],
);
// pickLargest: prefers highest width; falls back to density; falls back to src
assert.equal(pickLargest('a-300.jpg 1x, a-600.jpg 2x', 'a.jpg'), 'a-600.jpg');
assert.equal(pickLargest('a-300.jpg 300w, a-1600.jpg 1600w', 'a.jpg'), 'a-1600.jpg');
assert.equal(pickLargest('', 'only.jpg'), 'only.jpg');
console.log('images.mjs selftest OK');
