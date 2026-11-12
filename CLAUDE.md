# Virtual Physics Lab (hub)

Static hub that unifies four simulation repos (mecanica-labs, parametricResonance, AtomicSimulation, photoelectric-sim)
under one site: choose a laboratory, then an experiment. Stack: Vite + vanilla TypeScript + Vitest, no runtime dependencies.

## Commands
`npm test`, `npm run build` (hub only), `npm run assemble [-- --base <dir>] [-- --skip-source-build]` (whole site into `dist/`).

## Conventions
- `src/labs.ts` is the single place for labs and experiments. Pages, build inputs and the assembly plan derive from it.
  Keep it erasable TypeScript (Node imports it directly in `scripts/assemble.mjs`).
- Real static pages, no router: `/index.html` (hand-written), `/<lab>/index.html` (virtual inputs generated in `vite.config.ts`
  from `scripts/pages.ts`). Card links are relative, end with a slash and carry `?lang=` (`src/links.ts`).
- A mecanica-labs experiment links back to `../index.html`, which must stay the hub's lab page `/mechanics/`.
- Hub files go to `dist/hub-assets/` (never `assets/` or `favicon.svg` at a lab root: mecanica-labs owns those). The assembly refuses to overwrite.
- `assemble` sets `<meta name="vlabs-home">` to `../` in the copied index.html of the single-experiment sources (pure `setHomeMeta` in `scripts/plan.ts`).
- Path mapping is a pure function (`scripts/plan.ts`, tested). Do not modify the source repos from here.
- UI: calm, Apple-like, one accent colour, tokens only (`src/styles/tokens.css`, copied from mecanica-labs). 360 px, touch targets >= 44 px,
  light/dark/auto, keyboard focus visible, skip link. No external network requests (no CDN fonts).
- English default, Spanish second: `?lang=` first, then `vlabs:lang`, then `en`. All user-facing text is `{ en, es }`. Storage keys start with `vlabs:`.
- Make no claim of affiliation with any university or equipment maker.
- Code, comments, commits and docs in English. MIT code, CC BY 4.0 content.
