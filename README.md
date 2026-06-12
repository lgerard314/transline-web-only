# TransLine49° monorepo

npm-workspaces monorepo for two brand sites that share one design package.

```
apps/
  brand/             @white-owl/brand — shared design system (tokens, tl-* primitives, layout shell, shared components)
  miller-web/        Miller Environmental — Next.js 16 (App Router) marketing site
  transline49-web/   TransLine49° — Next.js 16 (App Router) marketing site
```

## Design system — read before any UI work

The locked design/style baseline for **both** apps lives in the website-design skill at `.claude/skills/website-design/references\white-owl-design-system.md` (`docs/DESIGN-SYSTEM.md` is now a stub pointing there), and root `CLAUDE.md` carries the auto-loaded non-negotiables + page route structure. There are two finished reference pages every new/converted page must match: the **Miller home page** (overall language + marketing sections, plus the finished header/footer) and the **Miller emergency-response page** (`/industrial-services/emergency-response` — the interior/service-page reference). Read the skill canon before building or redesigning anything.

## Develop

```bash
npm install
npm run dev          # TransLine49 on http://localhost:3000
npm run dev:miller   # Miller on http://localhost:3001
```

## Build

```bash
npm run build
npm start
```
