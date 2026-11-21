# CoverKit · API pública de MediaCard

## Contrato de datos

```ts
interface MediaItem {
  id: string;
  title: string;
  href?: string;
  kind?: 'manga' | 'manhwa' | 'manhua' | 'webtoon' | 'web-novel' | 'novel' | 'book' | 'comic' | 'series' | 'other';
  cover?: { src?: string; alt?: string; objectPosition?: string };
  language?: { code: string; region?: string; label?: string };
  creators?: { id: string; name: string; role?: 'author' | 'artist' | 'studio' | 'director' | 'publisher' | 'other'; href?: string }[];
  count?: { value: number; unit: string; label?: string };
  latestEntries?: { id: string; label: string; number?: number; href?: string; publishedLabel?: string; isNew?: boolean }[];
  description?: string;
  rating?: { value: number; max?: number; votes?: number };
  status?: 'ongoing' | 'completed' | 'hiatus' | 'cancelled';
  views?: number;
  progress?: { current: number; total?: number; label?: string };
}
```

Los tipos concretos (`MediaItem`, `MediaCount`, `MediaEntry`, etc.) están exportados por `@coverkit/react`.

### Semántica

- `count` describe **el volumen total disponible**, expresado en una unidad explícita. Valores conocidos: `chapters`, `pages`, `episodes`, `issues`, `volumes`, `entries`.
- `count.label` permite personalizar la visualización, sin cambiar el valor numérico ni la unidad.
- `latestEntries` ya viene ordenado por el consumidor; el primer elemento se trata como última publicación. Puede no existir para libros y novelas cerradas.
- `publishedLabel` es una etiqueta preformateada; CoverKit no calcula fechas ni zonas horarias.
- `description` puede complementar Detailed cuando no hay entregas recientes.
- `creators` admite diferentes roles, pero se muestra el primer nombre sin prefijo (en Detailed).
- `language.code` utiliza BCP 47; `language.region` es opcional y no se deduce automáticamente.
- `progress.current` puede representar capítulos leídos, páginas recorridas o episodios vistos.
- `views`, `kind` y `rating.votes` permanecen disponibles para integraciones; ninguna de las cuatro variantes los muestra automáticamente.

## Ejemplos por medio

```ts
const book: MediaItem = {
  id: 'b1', kind: 'book', title: 'Paper Kingdom',
  count: { value: 420, unit: 'pages' },
  creators: [{ id: 'c1', name: 'P. Liang', role: 'author' }],
};

const show: MediaItem = {
  id: 's1', kind: 'series', title: 'Moonlit Signals',
  count: { value: 18, unit: 'episodes' },
  latestEntries: [{ id: 'e18', label: 'T2 · E08', isNew: true }],
};

const manga: MediaItem = {
  id: 'm1', kind: 'manga', title: 'Orbit of Ash',
  count: { value: 94, unit: 'chapters' },
  latestEntries: [{ id: 'c94', label: 'Capítulo 94' }],
};
```

## `MediaCardProps`

| Propiedad | Tipo | Defecto | Uso |
|---|---|---|---|
| `item` | `MediaItem` | obligatoria | Contenido |
| `variant` | `minimal \| standard \| detailed \| compact` | `standard` | Composición |
| `theme` | `light \| dark \| inherit` | `inherit` | Apariencia propia |
| `density` | `comfortable \| compact` | `comfortable` | Espaciado |
| `languageDisplay` | `code \| flag` | `code` | Indicador excluyente |
| `languagePlacement` | `cover \| title` | `cover` | En Detailed/Compact se usa inline para evitar solapamientos |
| `flagBackground` | `boolean` | `false` | Fondo opcional para bandera |
| `showLanguage` | `boolean` | `true` | Visibilidad idioma |
| `showCount` | `boolean` | `true` | Cantidad/volumen |
| `showRating` | `boolean` | `true` | Valoración |
| `showLatestEntries` | `boolean` | `true` | Publicaciones recientes |
| `showCreators` | `boolean` | `true` | Creador en Detailed |
| `showStatus`, `showProgress`, `showNewBadge` | `boolean` | `false`, `false`, `true` | Detalles opcionales |
| `maxRecentEntries` | `number` | `3` | Filas de Detailed |
| `countFormatter` | `(count: MediaCount) => string` | Formato corto por idioma (inglés por defecto) | Personalizar unidades e idioma |
| `labels` | `Partial<MediaCardLabels>` | Inglés | Personalizar cadenas de interfaz |
| `coverAspectRatio` | CSS `aspectRatio` | `3/4` | Proporción portada |
| `coverFallback` | `ReactNode` | Icono neutro | Imagen ausente/error |
| `style`, `className` | CSS/string | — | Extensión visual |
| `onOpenMedia` | `(item) => void` | — | Portada/título |
| `onOpenEntry` | `(entry,item) => void` | — | Publicaciones |
| `onOpenCreator` | `(creator,item) => void` | — | Creador |

Los callbacks prevalecen sobre `href`; sin callback ni URL se renderiza texto estático. No hay controles interactivos anidados.

## Componentes y helpers exportados

- `MediaCard`: cuatro composiciones.
- `MediaCoverView`: portada y overlays.
- `MediaLanguageBadge`: código de idioma o bandera SVG (ES, GB, US, JP, KR, FR; fallback a código).
- `MediaEntryList`: lista con navegación de publicaciones.
- `formatMediaCount`: formato corto del contador usando el `unit` o `label` proporcionado.

## Tokens CSS

```css
.custom-card {
  --ck-radius: 16px;
  --ck-badge-offset: 8px;
  --ck-primary: #b9a5ff;
}
```

El CSS es autocontenido en `.ck-card` y no exige Tailwind. El tema explícito en la prop prevalece sobre el modo heredado del documento.

## Migración desde Manga Card Lab v0.1

| Anterior | CoverKit |
|---|---|
| `MangaCard` | `MediaCard` |
| `manga` / `Manga` | `item` / `MediaItem` |
| `chapters.total` | `count.value` y `count.unit` |
| `chapters.recent` / `chapters.latest` | `latestEntries` (ordenadas) |
| `MangaChapter` | `MediaEntry` |
| `showChapterCount` | `showCount` |
| `showLatestChapter` | `showLatestEntries` |
| `maxRecentChapters` | `maxRecentEntries` |
| `onOpenManga` / `onOpenChapter` | `onOpenMedia` / `onOpenEntry` |
| `--mc-*` / `.mc-*` | `--ck-*` / `.ck-*` |

**Es un cambio de API incompatible.** No hay alias heredados deliberadamente: el proyecto todavía estaba en fase inicial y conviene empezar con un contrato coherente.

## v0.5.0 — UI locale and optional motion

By default, component UI labels and unit abbreviations are **English**. Set `locale="es"` for Spanish, or override `labels` and `countFormatter` for further languages. A media item's own `language` is independent of the component `locale`.

```tsx
import { MediaCard, mediaCardLocales, formatMediaCount } from '@coverkit/react';

<MediaCard item={item} locale="es" labels={{ new: 'Recién publicado' }} />
formatMediaCount({value: 14,unit: 'episodes'}, 'en'); // 14 eps.
mediaCardLocales.es.labels.rating; // Valoración
```

`AnimatedMediaCard` is provided by the **separate** `@coverkit/animated` package. See [ANIMATIONS.md](ANIMATIONS.md). It forwards all base props and adds `animation`, `trigger`, `duration` (seconds), `delay`, `once`, `viewportAmount`, `staggerIndex`, `staggerInterval`, `pressFeedback` and `wrapperClassName`.

> Note: Earlier examples in this document were written with the Spanish defaults from v0.4. In v0.5 English is the default; pass `locale="es"` to retain previous Spanish behavior.
