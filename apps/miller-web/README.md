# miller-web

Next.js 16 (App Router) marketing site for Miller Environmental. Sister app
to `transline49-web`, consuming the shared `@white-owl/brand` package.

## Develop

From the repo root:

```bash
npm install
npm run dev:miller
```

Visit `http://localhost:3000` (or the next free port).

## Building pages

miller-web is **template-first**: the home page and the redesigned service pages
are composed from the shared `components-v2` template library, fed by content in
`lib/content/`. Before building or changing a page or template, read
the **template guide** in the website-design skill (`C:\Users\logan\.claude\skills\website-design\references\white-owl-templates.md` — `components-v2/README.md` is a stub), browse
the live catalog at **`/template-gallery`**, and use **`npm run template-map`** to
see which pages a template change would affect. Visual baseline: `C:\Users\logan\.claude\skills\website-design\references\white-owl-design-system.md` in the website-design skill (`docs/DESIGN-SYSTEM.md` is a stub).

## Imagery

`public/miller/` contains 83 photos downloaded from the live site on
2026-05-15. See `public/miller/_manifest.md` for the catalogue and
`apps/brand/` for the shared design system that ships the `tl-*` CSS
vocabulary used here.
