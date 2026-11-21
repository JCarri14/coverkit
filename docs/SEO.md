# SEO and discovery

CoverKit ships eight prerendered language-specific pages (4 per locale), which are indexable without client-side JavaScript. The root path links/redirects to `/en/` and is marked `noindex,follow` to avoid duplicate English content.

- Each page has its own `title`, meta description, canonical, Open Graph, Twitter and `SoftwareSourceCode` JSON-LD.
- Each page lists the `en`, `es`, and `x-default` alternate routes with reciprocal `hreflang` links.
- `sitemap.xml` includes both languages when `COVERKIT_SITE_URL` is configured.
- URL paths work with subpath hosting such as `https://jcarri14.github.io/coverkit/`.
- The registry, docs, examples and metadata remain helpful even to tools that don't execute React.

Configure both environment variables on deployment:

```bash
VITE_BASE_PATH=/coverkit/
COVERKIT_SITE_URL=https://jcarri14.github.io/coverkit/
```

`COVERKIT_GITHUB_REPO=JCarri14/coverkit` adds the source repository to JSON-LD. These are configured automatically in the Pages workflow. Neither `hreflang` nor an `llms.txt` file guarantees AI search visibility: substantive documentation, crawlable HTML and a real source repository matter more.
