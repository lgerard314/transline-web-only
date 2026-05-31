# transline49-web

Next.js 16 (App Router) marketing site for TransLine49° Environmental Services.

> **Design baseline.** This app has not yet been brought onto the shared baseline (it still renders straight from `@white-owl/brand` with Geist type and the flat layout described below). Any new or converted page must follow `docs/DESIGN-SYSTEM.md` (see §14 for what TL49 specifically needs to adopt) and the page route structure in root `CLAUDE.md` — mirror the Miller home page for marketing pages and the Miller emergency-response page for interior/service pages. Don't extend the legacy flat structure for new work.

## Develop

From the repo root:

```bash
npm install
npm run dev
```

Or directly inside this package:

```bash
cd apps/transline49-web
npm run dev
```

Visit `http://localhost:3000`.

## Routes

| URL                       | File                                           |
| ------------------------- | ---------------------------------------------- |
| `/`                       | `app/page.jsx`                                 |
| `/services`               | `app/services/page.jsx`                        |
| `/cross-border-process`   | `app/cross-border-process/page.jsx`            |
| `/about`                  | `app/about/page.jsx`                           |
| `/contact`                | `app/contact/page.jsx`                         |

## Layout

```
app/
  layout.jsx          Root layout: fonts, globals.css, TopNav, footer, tweaks provider
  page.jsx            Home
  <route>/page.jsx    Other routes
  globals.css         Design system (palette, density, typography variables)
components/
  *.jsx               Shared UI: BorderMap, PageHero, ServiceCard, FAQ, etc.
  tweaks/             Floating dev tweaks panel (palette / typography / density)
lib/
  photos.js           Unsplash photo registry (TL_PHOTOS)
  nav.js              Navigation items + URL map
public/
  logo.png            Logomark
  uploads/            Static raster uploads from the original site
```
