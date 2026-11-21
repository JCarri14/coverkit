import type { MediaItem, MediaVariant } from '@coverkit/react';

export type Locale = 'en' | 'es';
export const LOCALES: readonly Locale[] = ['en', 'es'];

const en = {
  nav: { component: 'Component', gallery: 'Gallery', docs: 'Guide', aria: 'Main navigation', brand: 'CoverKit component playground', light: 'Switch to light theme', dark: 'Switch to dark theme', language: 'Interface language' },
  variants: {
    minimal: { label: 'Minimal', description: 'Cover and title without distractions.', use: 'Visual discovery' },
    standard: { label: 'Standard', description: 'Essential information without competing with the artwork.', use: 'Catalogues and results' },
    detailed: { label: 'Detailed', description: 'Creators and recent releases in a horizontal layout.', use: 'Updates and libraries' },
    compact: { label: 'Compact', description: 'A dense summary for quick scanning.', use: 'Search results and feeds' },
  },
  studio: {
    main: 'Component studio', customize: 'Customize', close: 'Close settings', appearance: 'Appearance', cover: 'Preview cover', illustration: 'Artwork', mockup: 'Mockup', coverHint: 'The illustration is from the same fictional item used in the gallery.',
    language: 'Content language', showLanguage: 'Show language', languageStyle: 'Language display', flag: 'Flag', placement: 'Placement', onCover: 'On cover', beforeTitle: 'Before title', placementHint: 'Detailed and Compact always show the language beside the title.',
    metadata: 'Metadata', showCount: 'Content count', showRating: 'Rating', showRecent: 'Recent releases', showCreators: 'Creator / studio', scenario: 'Test case',
    advanced: 'More options', density: 'Density', comfortable: 'Comfortable', compact: 'Compact', flagBackground: 'Flag background', newBadge: 'New badge', status: 'Status', progress: 'Progress', reset: 'Reset settings',
    animation: 'Animation', animationType: 'Entrance effect', none: 'None', fade: 'Fade up', scale: 'Scale in', trigger: 'When to animate', mount: 'On mount', viewport: 'On view', duration: 'Duration', replay: 'Replay animation', animationHint: 'Optional Motion wrapper. MediaCard itself has no animation dependency.',
  },
  scenarios: {
    normal: 'Manga · standard', long: 'Book · long title', many: 'Web novel · 308 chapters', short: 'Series · single episode', book: 'Book · 420 pages', series: 'Series · 18 episodes', comic: 'Comic · 24 issues', webnovel: 'Web novel · 48 chapters', noRating: 'No rating', empty: 'No cover or metadata',
  },
  gallery: {
    overline: 'EXAMPLE LIBRARY', title: 'Gallery', lead: 'Six examples per variant, using original fictional covers.', filterVariants: 'Filter variants', content: 'Content', all: 'All', allKinds: 'All types', none: 'No examples for this filter.', examples: 'Examples of', kinds: { manga: 'Manga', manhwa: 'Manhwa', manhua: 'Manhua', webtoon: 'Webtoon', 'web-novel': 'Web novel', novel: 'Novel', book: 'Book', comic: 'Comic', series: 'Series', other: 'Media' },
  },
  guide: {
    overline: 'DOCUMENTATION', title: 'Usage guide', lead: 'One API, four layouts for manga, books, web novels, comics and series.',
    example: 'Usage example', exampleLead: 'Typed React components with copy-owned code, without a remote API.', copied: 'Copied', copy: 'Copy code', copyError: 'Select the code and copy it manually',
    anatomy: 'Anatomy and sizing', anatomyLead: 'Design decisions and reference measurements for each layout.', anatomyVariant: 'Elements', measurements: 'Reference measurements', cover: 'Cover', radius: 'Corner radius', badgeHeight: 'Badge height', spacing: 'Spacing', titleSize: 'Title text', measurementNote: 'Starting points only; change them using CSS custom properties.',
    technical: 'Technical reference', technicalLead: 'Installation, data contract and public configuration.', installation: 'Local setup', installationDetail: 'Once published, you can also install it from the shadcn GitHub registry.', contract: 'Data contract', contractDetail: 'Explicit units: chapters, pages, episodes, issues, or custom.', callbacks: 'Callbacks', callbacksDetail: 'Navigation is managed by the consuming application.', tokens: 'Customization', tokensDetail: 'Scoped .ck-card styles, compatible with CSS and Tailwind.', api: 'Public API', further: 'Full details in docs/API.md, docs/ANIMATIONS.md and docs/PUBLISHING.md.', referenceLink: 'View the public MediaCard reference',
    apiEntries: [
      ['variant', 'minimal | standard | detailed | compact', 'Layout'],
      ['theme', 'light | dark | inherit', 'Card appearance'],
      ['locale', 'en | es', 'Labels and count formatting'],
      ['languageDisplay', 'code | flag', 'Exclusive language indicator'],
      ['languagePlacement', 'cover | title', 'Inline on Detailed/Compact'],
      ['count', 'value + unit + label?', 'Total content quantity'],
      ['latestEntries', 'MediaEntry[]', 'Optional recent releases'],
      ['show*', 'boolean', 'Metadata visibility'],
      ['maxRecentEntries', 'number', 'Detailed rows'],
      ['AnimatedMediaCard', 'animation + trigger + duration', 'Optional Motion wrapper'],
    ],
    anatomyItems: {
      minimal: [['Cover', '3:4 image as the main visual.'], ['Title', 'Up to two lines, outside the image.'], ['Metadata', 'Optional and subtle.']],
      standard: [['Language', 'Language code or country flag; no country is inferred from language.'], ['Count', 'Explicit unit: chapters, pages or episodes.'], ['Rating', 'Own contrast-safe overlay.'], ['Latest release', 'Outside the cover to simplify scanning.']],
      detailed: [['Cover', 'Narrow crop with a top count badge.'], ['Creator', 'Clickable author or studio name.'], ['Rating', 'Readable in light and dark themes.'], ['Releases', 'Individual rows; omitted when unavailable.']],
      compact: [['Thumbnail', 'Quick recognition of content.'], ['Language', 'Inline before title; no overlay.'], ['Update', 'Link to latest episode or chapter.'], ['Metadata', 'Secondary supporting information.']],
    },
    animation: 'Optional motion examples', animationLead: 'Use AnimatedMediaCard for subtle mount or scroll-triggered entrances and staggered galleries. The base MediaCard requires no Motion dependency.',
    animationCode: `import { AnimatedMediaCard } from '@coverkit/animated';\n\n<AnimatedMediaCard\n  item={item}\n  variant="standard"\n  locale="en"\n  animation="fade-up"\n  trigger="in-view"\n  duration={0.35}\n  once\n/>`,
  },
  reference: {
    overline: 'REACT COMPONENT · OPEN SOURCE', title: 'MediaCard — adaptable React cover cards',
    lead: 'Four accessible card layouts for manga, web novels, books, comics, webtoons and TV series. Built for catalogues, discovery, reading lists and update feeds.',
    try: 'Try interactive playground', explore: 'Explore 4 variants', what: 'What is MediaCard?', whatText: 'MediaCard is a typed React component with four layouts: Minimal for visual discovery, Standard for information-rich cards, Detailed for recent chapters or episodes, and Compact for dense lists. Works with covers, contributors, language badges, ratings and progress.',
    whatText2: 'Data is never invented: a book can show pages without releases, while a series can display episodes and recently published entries.', start: 'Quick start', startText: 'For copy-owned code, install it from the public GitHub shadcn registry once published. Check the API guide for tokens and customisation.', included: 'Included variants', recommended: 'Recommended for', access: 'Accessibility and customization', accessText: 'Keyboard-focusable actions, theme tokens, placeholders and explicit labels. Compatible with Tailwind and plain CSS.', animation: 'AnimatedMediaCard (optional)', animationText: 'A separate Motion-powered wrapper for fade-up and scale-in entrances. Install only if you want animations; MediaCard remains dependency-light.',
  },
  notices: { entry: 'Demo: open', creator: 'Other works by', demo: 'demo' },
  pageMeta: {
    component: { title: 'CoverKit — React card design studio', description: 'Experiment with accessible React media cards: 4 layouts, bilingual interface, themes and optional motion effects.' },
    gallery: { title: 'React media card examples — CoverKit', description: 'See four React card layouts across manga, books, comics, web novels and series with original artwork.' },
    docs: { title: 'MediaCard API & installation guide — CoverKit', description: 'Copyable React MediaCard and AnimatedMediaCard examples, locales, design tokens and TypeScript API.' },
    reference: { title: 'MediaCard React component — CoverKit', description: 'Four accessible, customizable React cover-card variants for books, manga, comics, web novels and shows.' },
  },
};

const es: typeof en = {
  nav: { component: 'Componente', gallery: 'Galería', docs: 'Guía', aria: 'Navegación principal', brand: 'Laboratorio de componentes CoverKit', light: 'Activar modo claro', dark: 'Activar modo oscuro', language: 'Idioma de la interfaz' },
  variants: {
    minimal: { label: 'Minimal', description: 'Portada y título, sin distracciones.', use: 'Descubrimiento visual' },
    standard: { label: 'Standard', description: 'Información esencial sin competir con la portada.', use: 'Catálogos y resultados' },
    detailed: { label: 'Detailed', description: 'Autoría y publicaciones recientes en formato horizontal.', use: 'Actualizaciones y bibliotecas' },
    compact: { label: 'Compact', description: 'Un resumen denso para escanear de un vistazo.', use: 'Búsquedas y feeds' },
  },
  studio: {
    main: 'Laboratorio de componentes', customize: 'Personalizar', close: 'Cerrar ajustes', appearance: 'Apariencia', cover: 'Portada de muestra', illustration: 'Ilustración', mockup: 'Mockup', coverHint: 'La ilustración es la misma obra ficticia utilizada en la galería.',
    language: 'Idioma del contenido', showLanguage: 'Mostrar idioma', languageStyle: 'Representación del idioma', flag: 'Bandera', placement: 'Posición', onCover: 'Sobre la portada', beforeTitle: 'Antes del título', placementHint: 'Detailed y Compact muestran el idioma junto al título.',
    metadata: 'Metadatos', showCount: 'Cantidad', showRating: 'Valoración', showRecent: 'Publicaciones recientes', showCreators: 'Autor / estudio', scenario: 'Caso de prueba',
    advanced: 'Más opciones', density: 'Densidad', comfortable: 'Cómoda', compact: 'Compacta', flagBackground: 'Fondo de bandera', newBadge: 'Badge «Nuevo»', status: 'Estado', progress: 'Progreso', reset: 'Restaurar ajustes',
    animation: 'Animación', animationType: 'Efecto de entrada', none: 'Ninguna', fade: 'Fade up', scale: 'Scale in', trigger: 'Cuándo animar', mount: 'Al montar', viewport: 'Al aparecer', duration: 'Duración', replay: 'Reproducir animación', animationHint: 'Wrapper opcional con Motion. MediaCard no necesita esta dependencia.',
  },
  scenarios: {
    normal: 'Manga · estándar', long: 'Libro · título largo', many: 'Novela web · 308 capítulos', short: 'Serie · un episodio', book: 'Libro · 420 páginas', series: 'Serie · 18 episodios', comic: 'Cómic · 24 números', webnovel: 'Novela web · 48 capítulos', noRating: 'Sin valoración', empty: 'Sin portada ni metadatos',
  },
  gallery: {
    overline: 'BIBLIOTECA DE EJEMPLOS', title: 'Galería', lead: 'Seis ejemplos por variante con portadas originales de demostración.', filterVariants: 'Filtrar variantes', content: 'Contenido', all: 'Todas', allKinds: 'Todos', none: 'Sin ejemplos para este filtro.', examples: 'Ejemplos de', kinds: { manga: 'Manga', manhwa: 'Manhwa', manhua: 'Manhua', webtoon: 'Webtoon', 'web-novel': 'Novela web', novel: 'Novela', book: 'Libro', comic: 'Cómic', series: 'Serie', other: 'Contenido' },
  },
  guide: {
    overline: 'DOCUMENTACIÓN', title: 'Guía de uso', lead: 'Una API, cuatro presentaciones para manga, libros, novelas web, cómics y series.',
    example: 'Ejemplo de uso', exampleLead: 'Componentes React tipados y código propio, sin API externa.', copied: 'Copiado', copy: 'Copiar código', copyError: 'Selecciona el código para copiarlo',
    anatomy: 'Anatomía y medidas', anatomyLead: 'Decisiones de diseño y especificaciones de cada composición.', anatomyVariant: 'Elementos', measurements: 'Medidas orientativas', cover: 'Portada', radius: 'Radio de esquina', badgeHeight: 'Altura de badges', spacing: 'Separación', titleSize: 'Texto principal', measurementNote: 'Valores orientativos; personalízalos con propiedades CSS.',
    technical: 'Referencia técnica', technicalLead: 'Instalación, contrato de datos y configuración pública.', installation: 'Instalación local', installationDetail: 'Cuando publiques el registro, también podrás instalarlo desde GitHub mediante shadcn.', contract: 'Contrato', contractDetail: 'Unidades explícitas: capítulos, páginas, episodios, números o personalizadas.', callbacks: 'Callbacks', callbacksDetail: 'La navegación pertenece a la aplicación que consume el componente.', tokens: 'Personalización', tokensDetail: 'Estilos .ck-card, compatibles con CSS y Tailwind.', api: 'API principal', further: 'Más detalles en docs/API.md, docs/ANIMATIONS.md y docs/PUBLISHING.md.', referenceLink: 'Ver referencia pública de MediaCard',
    apiEntries: [
      ['variant', 'minimal | standard | detailed | compact', 'Composición'],
      ['theme', 'light | dark | inherit', 'Tema de tarjeta'],
      ['locale', 'en | es', 'Etiquetas y formato de cantidad'],
      ['languageDisplay', 'code | flag', 'Indicador excluyente'],
      ['languagePlacement', 'cover | title', 'Inline en Detailed/Compact'],
      ['count', 'value + unit + label?', 'Cantidad de contenido'],
      ['latestEntries', 'MediaEntry[]', 'Entregas recientes opcionales'],
      ['show*', 'boolean', 'Visibilidad de metadatos'],
      ['maxRecentEntries', 'number', 'Filas de Detailed'],
      ['AnimatedMediaCard', 'animation + trigger + duration', 'Wrapper opcional Motion'],
    ],
    anatomyItems: {
      minimal: [['Portada', 'Imagen protagonista con proporción 3:4.'], ['Título', 'Hasta dos líneas, fuera de la imagen.'], ['Metadatos', 'Opcionales y discretos.']],
      standard: [['Idioma', 'Código o bandera; la región no se infiere del idioma.'], ['Cantidad', 'Unidad explícita: capítulos, páginas o episodios.'], ['Valoración', 'Overlay con contraste propio.'], ['Última publicación', 'Fuera de la portada para escanear mejor.']],
      detailed: [['Portada', 'Recorte estrecho con contador superior.'], ['Creador', 'Nombre de autor o estudio, accionable.'], ['Valoración', 'Badge legible en ambos temas.'], ['Entregas', 'Filas independientes que se omiten si no existen.']],
      compact: [['Miniatura', 'Reconocimiento rápido del contenido.'], ['Idioma', 'Junto al título, sin overlays.'], ['Actualización', 'Acceso al último episodio o capítulo.'], ['Metadatos', 'Información secundaria.']],
    },
    animation: 'Ejemplos de animación opcional', animationLead: 'AnimatedMediaCard permite entradas al montar, en scroll y galerías escalonadas. MediaCard no depende de Motion.',
    animationCode: `import { AnimatedMediaCard } from '@coverkit/animated';\n\n<AnimatedMediaCard\n  item={item}\n  variant="standard"\n  locale="es"\n  animation="fade-up"\n  trigger="in-view"\n  duration={0.35}\n  once\n/>`,
  },
  reference: {
    overline: 'COMPONENTE REACT · OPEN SOURCE', title: 'MediaCard — tarjetas React adaptables',
    lead: 'Cuatro composiciones accesibles para manga, novelas web, libros, cómics, webtoons y series. Pensadas para catálogos, descubrimiento, bibliotecas y novedades.',
    try: 'Probar laboratorio', explore: 'Explorar cuatro variantes', what: '¿Qué es MediaCard?', whatText: 'MediaCard es un componente React tipado con cuatro composiciones: Minimal para descubrimiento visual, Standard para catálogos, Detailed para capítulos o episodios recientes y Compact para listados densos. Compatible con portadas, creadores, idiomas, valoraciones y progreso.',
    whatText2: 'Nunca inventa datos: un libro puede mostrar páginas sin publicaciones recientes y una serie puede mostrar episodios y novedades.', start: 'Primeros pasos', startText: 'Para utilizar código propio, instálalo desde el registro público de GitHub mediante shadcn una vez publicado. Consulta la guía para tokens y personalización.', included: 'Variantes', recommended: 'Ideal para', access: 'Accesibilidad y personalización', accessText: 'Acciones accesibles por teclado, temas claro/oscuro, placeholders y etiquetas explícitas. Compatible con Tailwind y CSS estándar.', animation: 'AnimatedMediaCard (opcional)', animationText: 'Un wrapper independiente basado en Motion para entradas fade-up y scale-in. Solo se instala si necesitas animaciones.',
  },
  notices: { entry: 'Demo: abrir', creator: 'Otras obras de', demo: 'demo' },
  pageMeta: {
    component: { title: 'CoverKit — laboratorio de tarjetas React', description: 'Experimenta con tarjetas React accesibles: cuatro variantes, interfaz bilingüe, temas y animaciones opcionales.' },
    gallery: { title: 'Ejemplos de tarjetas React — CoverKit', description: 'Cuatro variantes de tarjetas React con ejemplos de manga, libros, cómics, novelas web y series.' },
    docs: { title: 'Guía y API de MediaCard — CoverKit', description: 'Ejemplos React, AnimatedMediaCard, idiomas, tokens y API TypeScript.' },
    reference: { title: 'Componente React MediaCard — CoverKit', description: 'Cuatro variantes personalizables para libros, manga, cómics, novelas web y series.' },
  },
};

export const messages: Record<Locale, typeof en> = { en, es };
export type Translation = typeof en;

/** The language of the demo content is independent of the interface locale. */
export function localizeDemoItem(item: MediaItem, locale: Locale): MediaItem {
  if (locale === 'es') return item;
  const date: Record<string,string> = { 'hace 7 h':'7h ago', 'hace 4 días':'4 days ago', 'hace 1 semana':'1 week ago' };
  const summaries: Record<string,string> = {
    'paper-kingdom': 'A cartographer discovers that the maps of her city change every night.',
    'northern-echoes': 'A family mystery in a quiet northern town.',
    'last-cartographer': 'An explorer receives an atlas of a kingdom nobody remembers.',
  };
  return {
    ...item,
    latestEntries: item.latestEntries?.map(entry => ({ ...entry,
      label: entry.label.replace(/^Capítulo /, 'Chapter ').replace(/^Episodio /, 'Episode ').replace(/^N\.º /, 'Issue '),
      publishedLabel: entry.publishedLabel ? date[entry.publishedLabel] ?? entry.publishedLabel : undefined,
    })),
    description: summaries[item.id] ?? item.description,
    progress: item.progress ? { ...item.progress, label: item.count?.unit === 'episodes' ? 'Episodes watched' : item.count?.unit === 'pages' ? 'Pages read' : 'Content read' } : undefined,
    cover: item.cover ? { ...item.cover, alt: `Original illustrated cover of ${item.title}` } : undefined,
  };
}

export function variantCopy(locale: Locale, variant: MediaVariant) { return messages[locale].variants[variant]; }
