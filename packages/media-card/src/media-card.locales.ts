import type { MediaCardLabels, MediaCount } from './media-card.types';

/** Localisation of the component UI, not the language of the media itself. */
export type MediaCardLocale = 'en' | 'es';

export interface MediaCardLocalePreset {
  labels: MediaCardLabels;
  countUnits: Readonly<Record<string, string>>;
}

export const mediaCardLocales: Readonly<Record<MediaCardLocale, MediaCardLocalePreset>> = {
  en: {
    labels: {
      new: 'New', ongoing: 'Ongoing', completed: 'Completed', hiatus: 'On hiatus', cancelled: 'Cancelled',
      open: 'Open', openCreator: 'See works by', language: 'Language', rating: 'Rating', progress: 'Progress',
      of: 'of', coverAlt: 'Cover of',
    },
    countUnits: { chapters: 'ch.', pages: 'pages', episodes: 'eps.', issues: 'issues', volumes: 'vols.', entries: 'entries' },
  },
  es: {
    labels: {
      new: 'Nuevo', ongoing: 'En curso', completed: 'Finalizado', hiatus: 'En pausa', cancelled: 'Cancelado',
      open: 'Abrir', openCreator: 'Ver obras de', language: 'Idioma', rating: 'Valoración', progress: 'Progreso',
      of: 'de', coverAlt: 'Portada de',
    },
    countUnits: { chapters: 'caps.', pages: 'págs.', episodes: 'epis.', issues: 'núms.', volumes: 'vols.', entries: 'entradas' },
  },
};

/** `count.label` always wins; unknown units are shown exactly as supplied. */
export function formatMediaCount(count: MediaCount, locale: MediaCardLocale = 'en'): string {
  if (count.label) return count.label;
  const units = mediaCardLocales[locale].countUnits;
  return `${count.value.toLocaleString(locale === 'es' ? 'es-ES' : 'en-US')} ${units[count.unit] ?? count.unit}`;
}
