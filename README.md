# CoverKit

**Open-source React media cards and a bilingual design-system playground.**

Four composable visual layouts — **Minimal**, **Standard**, **Detailed**, **Compact** — for manga, books, web novels, comics and series. CoverKit is a typed React component collection that can be installed as copy-owned source through a **shadcn-compatible GitHub registry**.

## Features

- **MediaCard** — dependency-light presentation component, labels/counts in English or Spanish, theming, accessible actions and design tokens.
- **AnimatedMediaCard** — optional Motion-powered wrapper with fade-up/scale-in, mount/viewport triggers, replay in the demo and reduced-motion support. The base component does not require Motion.
- **Design studio** — a focused canvas with a variant switcher and floating customization panel.
- **Gallery** — original fictional SVG covers, six examples per variant, responsive sizes and content filters.
- **Docs in English and Spanish** — prerendered routes with canonical URLs and reciprocal `hreflang` metadata.
- **GitHub Pages** — Vite SSR prerender + static hosting; no runtime server.

## Links

- [GitHub repository](https://github.com/JCarri14/coverkit)
- [Live playground (once GitHub Pages is enabled)](https://jcarri14.github.io/coverkit/en/)
- [Documentación en español (once published)](https://jcarri14.github.io/coverkit/es/docs/)

## Local development

Requires **Node 20.19+** and pnpm 10.20.0.

```sh
corepack enable
corepack prepare pnpm@10.20.0 --activate
pnpm install
pnpm check
pnpm dev
```

Commit the generated **`pnpm-lock.yaml`** after the first successful install. A verified lockfile cannot be generated in the artifact environment while the npm registry is unavailable.

`pnpm check` runs workspace, TypeScript, unit, build, registry, design and SEO tests. `pnpm registry:sync` regenerates source-distribution files from the component packages.

## Public API

```tsx
import { MediaCard, mediaCardLocales } from '@coverkit/react';
import type { MediaItem } from '@coverkit/react';

const item: MediaItem = {
  id: 'orbit-of-ash',
  title: 'Orbit of Ash',
  kind: 'manga',
  language: { code: 'es', region: 'ES' },
  count: { value: 94, unit: 'chapters' },
};

<MediaCard item={item} variant="standard" locale="en" />;
<MediaCard item={item} variant="detailed" locale="es" />;
```

`MediaCard.locale` controls **interface labels and count formatting**, while `item.language` controls the **language badge of the content**. They are intentionally independent. Presets and localized formatting are available via `mediaCardLocales` and `formatMediaCount`.

Optional animation:

```tsx
import { AnimatedMediaCard } from '@coverkit/animated';

<AnimatedMediaCard item={item} variant="standard"
  animation="fade-up" trigger="in-view" duration={0.35} />;
```

This is a separate package and separate registry item. It forwards all `MediaCard` props and does not take over navigation callbacks.

## shadcn registry

For the public repository [`JCarri14/coverkit`](https://github.com/JCarri14/coverkit):

```sh
pnpm dlx shadcn@latest add JCarri14/coverkit/media-card
pnpm dlx shadcn@latest add JCarri14/coverkit/animated-media-card
```

Both items include their own required source files; the animated variant additionally installs `motion`. Run `pnpm registry:check` before pushing. The registry homepage already points to `https://github.com/JCarri14/coverkit`.

## Project structure

```text
apps/web                       Bilingual React/Vite studio, gallery and docs
apps/consumer-test             Separate consumer / smoke test
packages/media-card            Base React component, locales and design tokens
packages/animated-media-card   Optional Motion wrapper
registry/                      Generated shadcn source files
registry.json                  Two independently installable registry items
scripts/                       Prerendering and validation
.github/workflows/             CI and GitHub Pages deployment
docs/                          API, i18n, animation, SEO and publishing guides
```

## Static routes

The build creates:

- `/en/`, `/en/gallery/`, `/en/docs/`, `/en/components/media-card/`
- `/es/`, `/es/gallery/`, `/es/docs/`, `/es/components/media-card/`

The root redirects/links to English as the default. All eight pages contain server-rendered content without requiring JavaScript. SEO annotations are emitted at build time, and canonical URLs are configured automatically by the Pages workflow. See [SEO](docs/SEO.md) and [Publishing](docs/PUBLISHING.md).

## Documentation

[API](docs/API.md) · [I18N](docs/I18N.md) · [Animations](docs/ANIMATIONS.md) · [Design System](docs/DESIGN-SYSTEM.md) · [UX](docs/UX.md) · [Publishing](docs/PUBLISHING.md) · [Contributing](CONTRIBUTING.md)

## License

MIT for CoverKit code and original demonstration SVG artwork. Third-party packages retain their respective licenses (see `docs/THIRD-PARTY.md`).
