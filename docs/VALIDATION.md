# v0.5.0 validation and release checklist

## Verified during artifact creation

- All four workspace manifests resolve their `workspace:*` dependencies and pnpm-workspace paths.
- Registry source synchronization succeeds; both installable items include all their local imports.
- CSS design invariants and studio/variant controls pass the static UI checker.
- TypeScript/TSX files parse without syntax errors using the TypeScript compiler's transpile stage.
- EN/ES dictionary keys and GitHub Pages subpath route resolution are checked.
- An **integration fixture** verified `scripts/prerender.mjs` and `scripts/check-prerender.mjs` for eight locale-specific HTML outputs, reciprocal hreflang, sitemap and root redirect. The fixture is not part of the ZIP and is not a substitute for real React SSR.

## Pending: requires npm registry access

Run in the extracted folder on a machine with Node 20.19+, pnpm 10.20 and internet access:

```sh
pnpm install
pnpm check
```

`pnpm check` runs the **real** TypeScript checker, Vitest (base + animated), Vite site and consumer builds, registry checks, design checks and prerender output checks. Review any failures before tagging or publishing. Commit the generated `pnpm-lock.yaml` and rerun `pnpm install --frozen-lockfile`.

## Before public release

- Confirm `registry.json` is configured for `JCarri14/coverkit` (already configured) and verify the public repository exists.
- Set GitHub Pages → Source to **GitHub Actions** and push to `main`.
- Check `/en/` and `/es/` pages in a browser and through View Source.
- Install `media-card` and `animated-media-card` from the public registry into a fresh consumer project to test file targets and dependency installation.
- Check contrast, keyboard navigation, reduced motion and mobile layouts on real devices.
