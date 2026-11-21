## 0.4.4 — Microinteracción del playground

- Sustituido el modal de la ficha por un feedback visual breve al pulsar portada o título, tanto en Componente como en Galería.
- Compatible con teclado y `prefers-reduced-motion`; no se incorporan animaciones al paquete distribuible.
- Las acciones de capítulos y creadores mantienen sus callbacks independientes.

# Changelog

## 0.4.3 — Cross-platform validation scripts

- Fix `registry:check` on Windows by using `path.relative()` and normalizing separators before matching paths declared in `registry.json`.
- Fix `design:check` root-directory resolution using `fileURLToPath()` instead of URL `.pathname`, which produces incorrect drive-letter paths on Windows.
- No changes to the MediaCard components or UI.


## 0.4.2 — TypeScript setup fix

- Remove unused `Code2` and `Grid2X2` imports from `apps/web/src/App.tsx`.
- Add `@types/node` to `apps/web` development dependencies and `node` to `apps/web/tsconfig.json` `types` so `process.env.VITE_BASE_PATH` in the Vite config is typed.
- Keep the package versions consistent.

After extracting, run `pnpm install` and `pnpm check`. CI should run the full suite before publication.

## 0.5.0 — 2026-11-21

- `/en/` and `/es/` site routes, fully translated playground and documentation, server-rendered HTML, canonical URLs and reciprocal hreflang metadata.
- `MediaCard locale="en" | "es"` with exported presets `mediaCardLocales` and locale-aware `formatMediaCount` (English default).
- Optional `@coverkit/animated` package with entrance and viewport effects powered by Motion, reduced-motion handling and visible SSR.
- Self-contained `animated-media-card` registry item; the base `media-card` registry item still has no Motion dependency.
- Animation controls and replay in the playground; new installation, accessibility and SEO docs.
