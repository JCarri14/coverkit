# CoverKit visual system

## Goals
- **Content first:** covers and titles have primary visual hierarchy, controls remain secondary.
- **Progressive detail:** Minimal → Standard → Detailed → Compact serves distinct information-density contexts.
- **Explicit media units:** books have pages, TV series episodes, manga chapters, comics issues; do not hard-code units in the UI.
- **Accessibility:** maintain focus indicators, readable badges over cover artwork, and correct light/dark contrast.

## Tokens
The component defines overridable semantic CSS custom properties under `.ck-card` (with explicit dark and light palettes):

| Token | Meaning |
|---|---|
| `--ck-bg` | Card surface (Detailed / Compact) |
| `--ck-text` | Primary text |
| `--ck-sub` | Secondary text |
| `--ck-muted` | Low-priority metadata |
| `--ck-line` | Borders and dividers |
| `--ck-raised` | Chapter-row surfaces |
| `--ck-soft` | Soft badge surface |
| `--ck-primary` | Brand/focus/action accent |
| `--ck-new-*` | New-release badge background/text/border |
| `--ck-rate-*` | Rating surface/text/border |
| `--ck-cover-badge`, `--ck-cover-fg` | Cover overlays |
| `--ck-radius` | Cover radius, default 14px |
| `--ck-badge-offset` | Corner padding for overlays, default 8px |
| `--ck-cover-ratio` | Cover ratio, default 3/4 |

Override them using `className` with a CSS selector more specific than `.ck-card`; keep theme changes and WCAG contrast in mind. For example:

```css
.my-media-card.ck-card { --ck-radius: 18px; --ck-badge-offset: 10px; }
```

## Suggested dimensions
- Minimal / Standard: 156–200px in the public gallery, not stretched to fill a single-item row.
- Detailed: 350–390px; Compact: 305–345px; horizontally scrollable rails.
- Badge height on covers: 24px, with an explicit text unit.
- Detailed keeps its language inline with the title and count on the cover to avoid narrow-cover collisions.

## Implementation conventions
- **Package API:** `MediaCard`, `MediaCoverView`, `MediaLanguageBadge`, `MediaEntryList`, and types.
- **Internal modules:** `media-card.icons`, `media-card.language`, `media-card.utils`; keep consumers depending only on exported API.
- **Distribution:** `registry.json` plus the synced files in `registry/`, including CSS and Lucide dependency.
- **Apps:** `apps/web` is the laboratory/reference; `apps/consumer-test` checks the public package boundary.

See [API.md](API.md), [UX.md](UX.md) and [SEO.md](SEO.md).
