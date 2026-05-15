# transline49-web

Next.js 15 (App Router) marketing site for TransLine49° Environmental Services.

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
