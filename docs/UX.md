# CoverKit · decisiones de UX

Las cuatro variantes comparten una jerarquía visual consistente y fueron refinadas originalmente en un laboratorio HTML.

- **Minimal:** foco en portada y título; metadatos opcionales, apropiado para explorar catálogos.
- **Standard:** idioma y contador sobre la portada cuando hay espacio, valoración discreta y última publicación fuera de la imagen.
- **Detailed:** portada lateral, autor o estudio sin prefijos y lista independiente de últimas publicaciones. El idioma se coloca junto al título para evitar colisiones con el contador de la portada.
- **Compact:** fila densa para búsqueda o feeds; idioma junto al título, unidad y fecha en metadatos.

## Reglas transversales

- Un `book` con `count.unit = 'pages'` nunca se presentará como capítulos.
- Si `latestEntries` falta, no se inventan capítulos o episodios. Detailed puede usar `description` como alternativa.
- Fondo y texto de Detailed/Compact cambian juntos con `theme`.
- Las banderas se dibujan como SVG, no como emojis que puedan convertirse en letras en algunos navegadores.
- La región es explícita y no se infiere del idioma.
- Los botones/links de portada, creador y publicaciones son acciones separadas.
- Las portadas de la galería son ilustraciones SVG ficticias y originales.


## Pantalla de laboratorio (v0.4.0)

El modo **Componente** debe dar protagonismo únicamente a la tarjeta. La navegación global vive en la cabecera; el canvas muestra un selector de variantes sobre la tarjeta; el panel de personalización se abre como popover sobre el mismo canvas y se cierra pulsando fuera, con Escape o con su botón de cierre. Evitamos descripciones, ejemplos de código y tablas de medidas dentro de este lienzo.

**Galería** compara exactamente seis elementos por variante en una sola fila horizontal (con scroll si hace falta); **Guía** documenta ejemplo de uso, anatomía, medidas y API. Las portadas ficticias se mantienen en Galería. En Componente se utiliza Orbit of Ash por defecto con un selector opcional para sustituir la imagen por un placeholder neutro.

### Regresión de tipografía

No utilizar `font: inherit` como reset genérico en los botones internos de `.ck-card`, porque sobrescribe `font-weight` de `.ck-title` y otras clases. Utilizar `font-family: inherit` y preservar `font-weight: 820` en los títulos de las cuatro variantes.

### Cambios globales v0.4

- La interfaz empieza en tema **claro**; el usuario puede cambiar a oscuro desde el navbar y conservar su elección localmente.
- La galería no estira las cards cuando quedan menos tras filtrar: cada variante mantiene un ancho máximo estable.
- Las páginas públicas se prerenderizan y enlazan entre sí para que la guía sea legible incluso sin ejecutar JavaScript.
