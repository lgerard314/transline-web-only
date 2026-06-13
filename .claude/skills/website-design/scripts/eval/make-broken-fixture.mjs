import { chromium } from "playwright";
const OUT = ".claude/skills/website-design/scripts/eval/fixtures/broken-numerals.png";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:3001/", { waitUntil: "networkidle" });
await p.addStyleTag({ content: `nextjs-portal{display:none!important}` });
// Inject a flagrant banned device: bare 01/02/03 eyebrow-register numerals leading stacked rows.
// FAIL LOUD if :3001 isn't miller-web — `.mw-roster2` is miller-only; the monorepo default
// `npm run dev` serves TL49, miller is `npm run dev:miller`. A silent fallback would generate
// the fixture against the wrong site and quietly invalidate the eval's provenance.
await p.evaluate(() => {
  const host = document.querySelector(".mw-roster2");
  if (!host) throw new Error("`.mw-roster2` not found — :3001 must be serving miller-web (npm run dev:miller)");
  const box = document.createElement("div");
  box.id = "eval-broken-box";
  box.style.cssText = "position:relative;padding:56px 64px;background:#FBF8F2;font-family:monospace;line-height:2.2;";
  box.innerHTML = `
    <p style="font:600 16px monospace;letter-spacing:.18em;color:#A85A2C;margin:0;">01 &nbsp; INDUSTRIAL WASTE</p>
    <p style="font:600 16px monospace;letter-spacing:.18em;color:#A85A2C;margin:0;">02 &nbsp; EMERGENCY RESPONSE</p>
    <p style="font:600 16px monospace;letter-spacing:.18em;color:#A85A2C;margin:0;">03 &nbsp; CUSTOMER COLLECTION</p>`;
  host.prepend(box);
});
// Scroll the injected numerals to viewport center — a top-of-page shot misses them (they live in .mw-roster2, below the fold).
await p.evaluate(() => document.getElementById("eval-broken-box").scrollIntoView({ block: "center" }));
await p.waitForTimeout(400);
await p.screenshot({ path: OUT });
await b.close();
console.log("wrote", OUT);
