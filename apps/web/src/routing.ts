import type { Locale } from './i18n';

export type ViewMode = 'component' | 'gallery' | 'docs' | 'reference';

/** Keep the GitHub Pages project subpath intact. */
export function hrefFor(view: ViewMode, locale: Locale): string {
  const base = import.meta.env.BASE_URL;
  const rest = view === 'component' ? '' : view === 'reference' ? 'components/media-card/' : `${view}/`;
  return `${base}${locale}/${rest}`;
}

export function parseLocation(pathname: string): { locale: Locale; mode: ViewMode } {
  const base = import.meta.env.BASE_URL;
  const route = pathname.startsWith(base) ? pathname.slice(base.length) : pathname.replace(/^\/+/, '');
  const parts = route.split('/').filter(Boolean);
  const locale: Locale = parts[0] === 'es' ? 'es' : 'en';
  const rest = parts[0] === 'es' || parts[0] === 'en' ? parts.slice(1) : parts;
  if (rest[0] === 'gallery') return { locale, mode: 'gallery' };
  if (rest[0] === 'docs') return { locale, mode: 'docs' };
  if (rest[0] === 'components' && rest[1] === 'media-card') return { locale, mode: 'reference' };
  return { locale, mode: 'component' };
}
