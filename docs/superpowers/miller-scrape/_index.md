# Miller Environmental — site scrape index

Scraped 2026-05-15 from https://www.millerenvironmental.ca for the rebuild
in `apps/miller-web/`. Each file captures one page verbatim where possible.

## Files

| # | File | URL |
| - | ---- | --- |
| 00 | [00-homepage.md](00-homepage.md) | `/` |
| 01 | [01-services-landing.md](01-services-landing.md) | `/industrial-services/` |
| 02 | [02-svc-customer-waste-collection.md](02-svc-customer-waste-collection.md) | `/industrial-services/customer-waste-collection/` |
| 03 | [03-svc-emergency-response.md](03-svc-emergency-response.md) | `/industrial-services/emergency-response/` |
| 04 | [04-svc-environmental-remediation.md](04-svc-environmental-remediation.md) | `/industrial-services/environmental-remediation-services/` |
| 05 | [05-svc-industrial-cleaning.md](05-svc-industrial-cleaning.md) | `/industrial-services/industrial-cleaning/` |
| 06 | [06-svc-industrial-waste-treatment.md](06-svc-industrial-waste-treatment.md) | `/industrial-services/industrial-waste-treatment/` |
| 07 | [07-svc-project-management.md](07-svc-project-management.md) | `/industrial-services/project-management/` |
| 08 | [08-svc-research-development.md](08-svc-research-development.md) | `/industrial-services/research-development/` |
| 09 | [09-svc-specialty-recycling.md](09-svc-specialty-recycling.md) | `/industrial-services/specialty-recycling/` |
| 10 | [10-svc-stewardship.md](10-svc-stewardship.md) | `/industrial-services/stewardship/` |
| 11 | [11-svc-vacuum-truck.md](11-svc-vacuum-truck.md) | `/industrial-services/vacuum-truck/` |
| 12 | [12-process-inorganic-oxidizers.md](12-process-inorganic-oxidizers.md) | `/processes/disposal-of-inorganic-oxidizers/` |
| 13 | [13-about.md](13-about.md) | `/about-us/` |
| 14 | [14-about-health-safety.md](14-about-health-safety.md) | `/about-us/health-safety/` |
| 15 | [15-about-licencing.md](15-about-licencing.md) | `/about-us/licencing-information/` |
| 16 | [16-about-professional-affiliations.md](16-about-professional-affiliations.md) | `/about-us/professional-affiliations/` |
| 17 | [17-about-quality-assurance.md](17-about-quality-assurance.md) | `/about-us/quality-assurance/` |
| 18 | [18-about-vision-mission-values.md](18-about-vision-mission-values.md) | `/about-us/vision-mission-and-core-values/` |
| 19 | [19-location-treatment-facility.md](19-location-treatment-facility.md) | `/treatment-facility/` |
| 20 | [20-location-winnipeg-service-centre.md](20-location-winnipeg-service-centre.md) | `/winnipeg-service-centre/` |
| 21 | [21-case-studies-index.md](21-case-studies-index.md) | `/case-studies/` |
| 22 | [22-careers.md](22-careers.md) | `/careers/` |
| 23 | [23-careers-benefits-rewards.md](23-careers-benefits-rewards.md) | `/careers/benefits-rewards/` |
| 24 | [24-careers-working-at-miller.md](24-careers-working-at-miller.md) | `/careers/working-at-miller/` |
| 25 | [25-contact.md](25-contact.md) | `/contact-us/` |
| 26 | [26-case-brandon-power.md](26-case-brandon-power.md) | `/case-studies/brandon-power-facility/` |
| 27 | [27-case-grain-elevator.md](27-case-grain-elevator.md) | `/case-studies/grain-elevator-remediation-project/` |
| 28 | [28-case-hwy16-diesel.md](28-case-hwy16-diesel.md) | `/case-studies/highway-16-diesel-spill-response-remediation/` |
| 29 | [29-case-steinbach-fire.md](29-case-steinbach-fire.md) | `/case-studies/steinbach-strip-mall-fire-recovery-restoration-project/` |
| 30 | [30-careers-plant-manager.md](30-careers-plant-manager.md) | `/careers/plant-manager/` |
| 31 | [31-careers-enterprise-automation-manager.md](31-careers-enterprise-automation-manager.md) | `/careers/enterprise-automation-manager/` |

**All 32 published content URLs now scraped.** The 4 case-study detail pages
and 2 job postings, originally deferred to stub routes, are now real content.
The rebuild can ship them as full pages from day one — see updated phase 03/04
allocation in `miller-web-phase-*.md`.

## Imagery

All site images were downloaded to `apps/miller-web/public/miller/` —
83 files, 11 MB, organized into 9 category subdirs (logo / hero / services /
facility / affiliations / certs / case-studies / careers / oxidizers).
A per-file manifest lives at `apps/miller-web/public/miller/_manifest.md`.

The Miller logomark — the live site's actual mark — is at
`apps/miller-web/public/miller/logo/miller-logomark.webp`. The placeholder
`apps/miller-web/public/logo.png` mentioned in the spec is no longer needed;
the real mark ships from phase 01.

## Brand notes (cross-cut)
- Phones: **(204) 925-9600** general · **(204) 957-6327** 24/7 spill response
- Email: `inquiries@millerenvironmental.mb.ca` · sales: `sales@millerenvironmental.mb.ca` · HR: `hr@millerenvironmental.mb.ca`
- Address (HQ): 1803 Hekla Ave, Winnipeg, MB R2R 0K3
- Address (VBEC): Hwy 14 & 75, Saint Jean Baptiste, MB R0G 2B0
- ISO 9001:2015 · ISO 14001:2015 · ISO 45001:2018 · MHCA COR 2023
- "Over 25 years" tenure refrain
- "Cradle-to-grave" tracking refrain
- Affiliated with **TransLine49°** under White Owl Family Office Group (so the rebuild can/should cross-link)
- Vision · Mission · Core Values (Respect · Empowerment & Accountability · Teamwork · Healthy Work Environment)
