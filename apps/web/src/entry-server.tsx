import { renderToString } from 'react-dom/server';
import App from './App';
import type { ViewMode } from './routing';
import type { Locale } from './i18n';

/** Build-time prerendering; the site stays deployable on static GitHub Pages. */
export function renderPage(mode: ViewMode, locale: Locale): string {
  return renderToString(<App initialMode={mode} initialLocale={locale}/>);
}
