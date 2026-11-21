import { mediaCardLocales, formatMediaCount } from './media-card.locales';

/** @deprecated Prefer mediaCardLocales[locale].labels and formatMediaCount(count, locale). */
export const DEFAULT_LABELS = mediaCardLocales.en.labels;
export { formatMediaCount };
