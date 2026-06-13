import { chromium } from "playwright";
const OUT = ".claude/skills/website-design/scripts/eval/fixtures/broken-integration-seam.png";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto("http://localhost:3001/", { waitUntil: "networkidle" });
await p.addStyleTag({ content: `nextjs-portal{display:none!important}` });

// Recolor a KNOWN cream-field section to on-palette dark walnut → a dark slab interrupting the
// page's continuous cream field. On-palette (#3B2418 = --c-navy) so it's a CONTINUITY defect,
// not a palette violation. FAIL LOUD if :3001 isn't miller-web (.mw-roster2 is miller-only).
const y = await p.evaluate(() => {
  const el = document.querySelector(".mw-roster2");
  if (!el) throw new Error("`.mw-roster2` not found — :3001 must be serving miller-web (npm run dev:miller)");
  const sec = el.closest("section") || el.parentElement;
  sec.style.setProperty("background", "#3B2418", "important");
  sec.style.setProperty("background-image", "none", "important");
  const r = sec.getBoundingClientRect();
  return window.scrollY + r.top;            // top edge of the recolored section
});
// Show ~220px of the (cream) section above so the cream→dark break is in-frame.
await p.evaluate((yy) => window.scrollTo(0, Math.max(0, yy - 220)), y);
await p.waitForTimeout(500);
await p.screenshot({ path: OUT });
await b.close();
console.log("wrote", OUT);
