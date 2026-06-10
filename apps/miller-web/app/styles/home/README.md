# Home section CSS

One file per live home section on `/`. Import order in [`app/globals.css`](../../globals.css) preserves the original cascade.

| CSS file | Template |
|----------|----------|
| `_shared.css` | Cross-section photo grade + parallax helpers |
| `facility.css` | [`MediaSplit01`](../../../components-v2/06_sections/splits/media-split-01.jsx) (base layout) |
| `history.css` | [`TimelineSplit01`](../../../components-v2/06_sections/splits/timeline-split-01.jsx) |
| `affiliates.css` | [`RotatingBanner01`](../../../components-v2/06_sections/banners/rotating-banner-01.jsx) |
| `final-cta.css` | [`MultiColumnCta01`](../../../components-v2/06_sections/callouts/multi-column-cta-01.jsx) |
| `hero.css` | [`MonumentHero01`](../../../components-v2/06_sections/heroes/monument-hero-01.jsx) |
| `certs.css` | [`TallStaticBanner01`](../../../components-v2/06_sections/banners/tall-static-banner-01.jsx) |
| `sectors.css` | [`SectorDiamonds04`](../../../components-v2/06_sections/grids/sector-diamonds-04.jsx) |
| `careers.css` | [`ZoomCollage01`](../../../components-v2/06_sections/callouts/zoom-collage-01.jsx) |
| `facility-pin.css` | [`MediaSplit01`](../../../components-v2/06_sections/splits/media-split-01.jsx) (pinned scroll) |
| `services.css` | [`RosterCollage02`](../../../components-v2/06_sections/grids/roster-collage-02.jsx) |
| `lifetime.css` | [`LifetimeReel01`](../../../components-v2/06_sections/statements/lifetime-reel-01.jsx) |

Retired home variants (bento, roster v1, creed, scale, arc gallery) live in [`app/template-gallery/home-legacy.css`](../../template-gallery/home-legacy.css) — loaded only on dev gallery routes.

Iterate on a single section in isolation: [`/home-lab`](../../home-lab).
