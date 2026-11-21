# Contributor and coding-agent instructions

This document helps human contributors and coding agents work safely in the **CoverKit** repository. It is not an SEO ranking mechanism.

## Rules
- Keep `packages/media-card/src/` as the single source of truth for the reusable React code.
- Never edit `registry/` by hand. Run `pnpm registry:sync` after changes, then `pnpm registry:check`.
- UI playground lives in `apps/web`; avoid importing demo data into the component package.
- Ensure the four variants (`minimal`, `standard`, `detailed`, `compact`) remain usable with *missing optional properties*.
- `count.unit` is explicit: do not assume every medium has chapters or that language implies a national flag.
- Keep all external assets license-safe. Demo art is original local SVG in `apps/web/public/covers`.
- Maintain keyboard navigation, readable contrast in both themes, visible focus rings and semantic labels.
- For new route content, ensure `scripts/prerender.mjs` supplies a title, description and canonical path.
- Registry installations must not require private workspace packages. Depend only on React and declared registry dependencies.

## Commands
```sh
pnpm install
pnpm dev
pnpm check
pnpm registry:sync
```

## Release prerequisites
After the first real dependency installation, **commit the generated `pnpm-lock.yaml`**. CI uses frozen installation when it exists. Local static checks cannot replace successful `pnpm check` and a real install of the published GitHub registry.

## v0.5 component boundaries

- Base `@coverkit/react` must not import `motion`. Keep animation in `packages/animated-media-card` and the optional `animated-media-card` registry item.
- UI locale (`MediaCard.locale`) is independent of `item.language`. English and Spanish labels live in `media-card.locales.ts`.
- Web translations live in `apps/web/src/i18n`; every public route has both `/en/` and `/es/` SSR output.
- Always run `pnpm registry:sync` when modifying source files. Do not edit `registry/` by hand.
