# Miller image manifest

Downloaded 2026-05-15 from the live https://www.millerenvironmental.ca
WordPress media library via HTML grep + curl. Filenames preserved from
source where they were already descriptive; cryptic filenames renamed and
Elementor cache duplicates dropped. 83 files, ~11 MB total.

## Provenance + naming convention

- Source: `https://www.millerenvironmental.ca/wp-content/uploads/YYYY/MM/<file>`.
- One-shot snapshot; if the live site updates an image we won't re-pull.
- File names within this tree are stable; spec / phase plans can hard-code paths.
- All paths in `lib/photos.js` reference `/miller/<dir>/<file>` (served by
  Next.js from `public/`).

## By directory

### `logo/`
| File | Use |
| ---- | --- |
| `miller-logomark.webp` (1.4 MB, 1871×1871) | Header + favicon source. Largest size; Next.js can downsize. |
| `miller-logomark-300.webp` | Pre-downsized 300 px variant if `next/image` isn't used in a slot. |
| `miller-wordmark-hero.webp` | Wordmark used in hero contexts on the live site. |
| `transline49-cross-link.webp` | TL49 mark for the `FamilyOfCompanies` strip. (Phase 05.) |
| `miller-waste-systems-cross-link.webp` | Miller Waste Systems mark for the same strip. |

### `hero/`
Above-the-fold imagery for non-home pages.
| File | Use |
| ---- | --- |
| `about-health-safety.webp` | `/about-us/health-safety/` hero. |
| `about-quality-assurance.webp` + `about-quality-assurance-alt.webp` | `/about-us/quality-assurance/` hero (pick one). |
| `qa-tracking-database.webp` | Quality Assurance "Tracking" section illustration. |
| `safety-ics.webp` | Health & Safety page — Incident Command System block. |
| `trir-stat.webp` | TRIR stat illustration. |

### `services/`
Per-service page headers + Remediation page detail cards + a couple of detail shots.
| File | Use |
| ---- | --- |
| `customer-waste-collection-hero.webp` | service page hero |
| `emergency-response-hero.webp` | service page hero |
| `industrial-waste-treatment-hero.webp` | service page hero (the flagship `capabilities` template) |
| `project-management-hero.webp` + `project-management-detail.webp` | service page hero + detail |
| `research-development-hero.webp` | service page hero |
| `specialty-recycling-hero.webp` | service page hero |
| `stewardship-hero.webp` | service page hero |
| `vacuum-truck-hero.jpg` (Half-Ton-Vac-Trk-VB original) | service page hero |
| `vacuum-truck-new-logo.webp` + `vacuum-truck-new-logo-cache.jpg` | secondary vac-truck imagery |
| `industrial-cleaning-hero.jpeg` (`Picture2` original — only available scaled) | service page hero |
| `remediation-contaminated-soil.webp` | Remediation "What We Do" 6-card grid (1/6) |
| `remediation-hazmat-excavation.webp` | (2/6) |
| `remediation-emergency-spill.webp` | (3/6) |
| `remediation-fire-damaged.webp` | (4/6) |
| `remediation-industrial-site.webp` | (5/6) |
| `remediation-ust.webp` | (6/6) |

### `facility/`
VBEC + Winnipeg Service Centre.
| File | Use |
| ---- | --- |
| `vbec-aerial.webp` | `/treatment-facility/` hero — drone shot of the 64-hectare site. |
| `vbec-building.webp` | Secondary facility shot. |
| `vbec-plaque-day.webp` | The renaming plaque-day photo — surface this on `/about-us/` with the Vaughn Bullough story. |
| `cap-specialty-soil.webp` | Industrial Waste Treatment capability section (Specialty Soil) |
| `cap-inorganic.webp` | (Inorganic Waste Processing) |
| `cap-liquid-organic.webp` | (Liquid Organic Waste Processing) |
| `cap-solid-organic.webp` | (Solid Organic Waste Processing) |
| `cap-special-waste.webp` | (Special Waste Processing) |
| `cap-misc-recycling.webp` | (Misc Processing & Recycling) |
| `cap-special-projects.webp` | (Special Processing Projects — SR&ED) |
| `winnipeg-service-centre.webp` + `winnipeg-service-centre-1.webp` | `/winnipeg-service-centre/` hero (pick the better one). |

### `affiliations/`
The 10 affiliations on `/about-us/professional-affiliations/` — Miller Waste
Systems and TransLine49° marks live in `logo/`; the other 8 are here.
| File | Org |
| ---- | --- |
| `meia.webp` | Manitoba Environmental Industries Association |
| `manitoba-chamber.webp` | Manitoba Chamber of Commerce |
| `cme.webp` | Canadian Manufacturers & Exporters |
| `csam.webp` | Construction Safety Association of Manitoba |
| `code.webp` | Commitment To Opportunity, Diversity & Equity |
| `mta.webp` | Manitoba Trucking Association |
| `winnipeg-chamber.webp` | Winnipeg Chamber of Commerce |
| `owma.webp` | Ontario Waste Management Association |

> The MHCA mark wasn't on the affiliations page — but it's the source of
> the COR 2023 credential and may be added to the cert grid in phase 04.

### `certs/`
| File | Cert |
| ---- | ---- |
| `iso-9001-2015.webp` | ISO 9001:2015 |
| `iso-14001-2015.webp` | ISO 14001:2015 |
| `iso-45001-2018.webp` | ISO 45001:2018 |

(MHCA COR 2023 mark not yet downloaded — the live site uses a sibling
URL pattern; phase 04 picks it up or links to the PDF directly.)

### `case-studies/`
| File | Case |
| ---- | ---- |
| `brandon-power-2.webp` | Brandon Power Facility lime dust — hero |
| `brandon-power-vbec.webp` | Brandon Power — VBEC facility photo used in this case |
| `grain-elevator-arsenic.webp` | Grain Elevator arsenic remediation — hero |
| `hwy-16-diesel-spill.webp` | Highway 16 diesel — hero |
| `hwy-16-diesel-spill-response.webp` | Highway 16 — secondary detail |
| `steinbach-strip-mall-fire.webp` | Steinbach strip mall — hero |
| `steinbach-mall-fire-alt.webp` | Steinbach — secondary (Elementor cache, only available scaled) |

### `careers/`
| File | Use |
| ---- | --- |
| `benefits-rewards.webp` | `/careers/benefits-rewards/` hero |
| `working-at-miller-1.webp` | `/careers/working-at-miller/` hero (probably the primary) |
| `working-at-miller-2.webp` | section illustration |
| `working-at-miller-3.webp` | section illustration |

### `oxidizers/`
The single published Process page.
| File | Use |
| ---- | --- |
| `icon.svg` | Process icon |
| `highlight-2.webp` / `-10.webp` / `-8-2.webp` / `-3-1.webp` | The 4 service highlight cards (live site shape — variation in filenames; choose 4 visually distinct). |

## Selection notes for the build

- **Two QA hero candidates** (`about-quality-assurance.webp` and `…-alt.webp`):
  the alt version was uploaded a day later — likely a brightness/crop tweak.
  Phase 04 picks one; the other can stay in the tree as a fallback.
- **Two winnipeg-service-centre images**: pick the larger/clearer in phase 03.
- **`vacuum-truck-hero.jpg`**: original JPEG (not WebP) because the live
  site only had a `-scaled.jpg` version. Next.js's image pipeline will
  produce WebP on demand if we wire `next/image`.

## Phase 05 additions
- **MHCA COR 2023 mark** (`/miller/certs/mhca-cor-2023.webp`) — converted
  from the `COR®-logo-black-background.pdf` published on the live
  licencing page (the only COR asset Miller publishes).
- **OG image** (`/og.webp`) — fetched from the live site's
  `<meta property="og:image">` on the homepage.
- **ISO PDFs** (`/certs/iso-{9001-2015,14001-2015,45001-2018}.pdf`) and
  **licence PDFs** (`/licences/*.pdf`) — fetched from
  millerenvironmental.ca. Real `sizeKB` written into
  `lib/certs.js` + `lib/content/about-licencing-information.js`.
