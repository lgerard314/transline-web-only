# @white-owl/brand

Shared design system for White Owl-built sites (TransLine49°, Miller
Environmental). Source-shipped — no build step. Consumers transpile via
their `next.config.mjs` `transpilePackages` entry.

Layer: feature/shared. Apps depend on this package; this package depends on
no other internal package.

## Exports

- `@white-owl/brand/styles/globals.css` — design tokens (`[data-palette]`,
  `[data-brand]`), base typography, component selectors prefixed `tl-*`
  (historical — see §1.2 + §12 of the miller-web design spec; do NOT rename).
- `@white-owl/brand/components` — generic primitives: `ParallelRule`,
  `Marquee`, `SectionHead`, `FAQ`, `TrustBar`, `Icon`, `HeroPhoto`,
  `PageHero`, `ServiceCard`, `ScrollReveal`, `FormField`.
- `@white-owl/brand/tweaks` — dev-only design-tweak panel. Import-site
  gate on `NODE_ENV !== "production"` to keep the production bundle at
  zero bytes.

## Notes

- Intra-package imports use relative paths only. `@/` aliases inside the
  package resolve to the consumer's root and break.
- `peerDependencies` (not `dependencies`) for `next`/`react`/`react-dom`
  to avoid two React copies on the workspace install.
