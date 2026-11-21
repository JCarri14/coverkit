# Contributing to CoverKit

Thank you for improving CoverKit! Small changes that preserve the low-complexity architecture are welcome.

1. Install dependencies using pnpm 10.20.0 and Node 22.
2. Branch from `main` and keep changes focused.
3. Edit `packages/media-card/src` for reusable components, `apps/web` for demo/doc changes.
4. Run `pnpm registry:sync` after changing package source files; commit the synced registry.
5. Run `pnpm check` and review the gallery in both themes and narrow viewport sizes.
6. Do not introduce unlicensed media artwork or silently assume book counts are chapters.
7. Describe accessibility and API changes in the pull request; add relevant tests.

The source of truth is `packages/media-card`, not `registry/`.

See [AGENTS.md](AGENTS.md), [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md), and [docs/PUBLISHING.md](docs/PUBLISHING.md).
