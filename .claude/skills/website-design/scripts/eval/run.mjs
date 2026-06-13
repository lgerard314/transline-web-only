import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const AGENT = ".claude/agents/design-auditor.md";
// Env seam so the D5 rubber-stamp regression can point at a stub WITHOUT the runner
// regenerating over it. Default: rebuild the system prompt from the agent file.
const SYS = process.env.EVAL_SYSPROMPT || ".scratch/eval/sysprompt.txt";
mkdirSync(".scratch/eval", { recursive: true });
if (!process.env.EVAL_SYSPROMPT) {
  // CRLF-safe frontmatter strip (this repo is CRLF — a `---\n` pattern won't match `---\r\n`).
  const body = readFileSync(AGENT, "utf8").replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
  if (/name:\s*design-auditor/.test(body)) throw new Error("frontmatter not stripped — fix the regex");
  writeFileSync(SYS, body);
}

// Both paths are repo-root-relative — the runner is invoked from repo root and the
// claude subprocess inherits that cwd, so the Read tool resolves from repo root.
const APPROVED = ".claude/skills/website-design/references/approved/home/desktop";
const CASES = [
  { name: "good",   shot: ".claude/skills/website-design/scripts/eval/fixtures/good-hero.png",       good: true },
  { name: "broken", shot: ".claude/skills/website-design/scripts/eval/fixtures/broken-numerals.png", good: false, mustMention: /numeral|\b0[123]\b|forbidden/i },
  // scope: integration — judge a fanned-out page as ONE object (ordered section shots + the
  // continuity map the integration pass is given in production, per the agent contract).
  { name: "good-integration", integration: true, good: true,
    map: "These are consecutive APPROVED sections; the page intentionally alternates dark anchor sections with cream sections, so tonal transitions BETWEEN sections are BY DESIGN. Judge only genuine breaks — a single section's own field broken, jarring seam rhythm, a broken motion handoff, or clumped pacing.",
    shots: [`${APPROVED}/05-lifetime-settled.png`, `${APPROVED}/06-vbec-settled.png`, `${APPROVED}/07-history-rest.png`] },
  { name: "broken-integration", integration: true, good: false,
    mustMention: /seam|continu|color|boundary|between|field|interrupt|slab|band|cream/i,
    map: "The ISO-certifications band and the services section immediately below it share the page's continuous CREAM field; that field MUST read unbroken across the seam between them.",
    shots: [".claude/skills/website-design/scripts/eval/fixtures/broken-integration-seam.png"] },
];

let failed = 0;
for (const c of CASES) {
  const prompt = c.integration
    ? `Read these ordered shots from a walk of a Miller home page IN ORDER: ${c.shots.join(", ")}. scope: integration. Continuity map: ${c.map} self-probe confirmed: yes (caller already walked these). Judge ACROSS boundaries: seams, color continuity (a field the map says is continuous MUST read unbroken — a break there is a blocker), motion handoffs, whole-page pacing. Return verdict + boundary-keyed findings.`
    : `Read ${c.shot} and audit it. scope: full-section. self-probe confirmed: yes (caller already reviewed this shot). Section intent: a Miller home marketing section. Return verdict + findings.`;
  let out = "";
  try {
    // --allowedTools MUST include Skill — the agent's mandatory first action invokes the
    // website-design skill; without it the agent refuses to judge (no canon loaded) and the
    // eval fails for the wrong reason. (Variadic: pass tools as separate argv tokens.)
    out = execFileSync("claude", ["-p", prompt,
      "--append-system-prompt-file", SYS,
      "--allowedTools", "Read", "Skill", "Grep", "Glob",
      "--output-format", "json"], { encoding: "utf8", timeout: 180000 });
  } catch (e) { out = String(e.stdout || "") + String(e.message || ""); }
  const hasBlocker = /blocker/i.test(out);
  let pass;
  if (c.good) {
    // Spec §3b: GOOD passes on PASS, OR ISSUES with ZERO blockers (a lone nit must not fail it).
    pass = /PASS/i.test(out) || (/ISSUES/i.test(out) && !hasBlocker);
  } else {
    pass = /ISSUES/i.test(out) && hasBlocker && c.mustMention.test(out);
  }
  if (!pass) failed++;
  console.log(`[${c.name}] blocker=${hasBlocker} => ${pass ? "PASS" : "FAIL"}`);
}
process.exit(failed ? 1 : 0);
