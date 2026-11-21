import type { CSSProperties, ReactNode } from 'react';
import type { MediaCardLocale } from './media-card.locales';

/** CoverKit media cards are presentation-only: omitted data is never inferred. */
export type MediaKind = 'manga' | 'manhwa' | 'manhua' | 'webtoon' | 'web-novel' | 'novel' | 'book' | 'comic' | 'series' | 'other';
export type MediaStatus = 'ongoing' | 'completed' | 'hiatus' | 'cancelled';
export type MediaVariant = 'minimal' | 'standard' | 'detailed' | 'compact';
export type MediaTheme = 'light' | 'dark' | 'inherit';
export type MediaDensity = 'comfortable' | 'compact';
export type LanguageDisplay = 'code' | 'flag';
export type LanguagePlacement = 'cover' | 'title';
export type MediaCountUnit = 'chapters' | 'pages' | 'episodes' | 'issues' | 'volumes' | 'entries' | (string & {});

export interface MediaCreator {
  id: string;
  name: string;
  role?: 'author' | 'artist' | 'studio' | 'director' | 'publisher' | 'other';
  href?: string;
}
export interface MediaLanguage {
  /** BCP 47, e.g. es, en, ja, es-MX. */
  code: string;
  /** ISO 3166-1 alpha-2. Optional; flags are never guessed from language. */
  region?: string;
  label?: string;
}
export interface MediaEntry {
  id: string;
  /** Fully formatted text. e.g. "Capítulo 42", "S02 E06", "N.º 4". */
  label: string;
  number?: number;
  href?: string;
  publishedLabel?: string;
  isNew?: boolean;
}
export interface MediaCount {
  value: number;
  unit: MediaCountUnit;
  /** Optional display override, e.g. "420 páginas" or "T2 · 8 ep.". */
  label?: string;
}
export interface MediaRating { value: number; max?: number; votes?: number }
export interface MediaCover {
  src?: string;
  alt?: string;
  objectPosition?: string;
}
export interface MediaItem {
  id: string;
  title: string;
  href?: string;
  kind?: MediaKind;
  cover?: MediaCover;
  language?: MediaLanguage;
  creators?: MediaCreator[];
  /** Pages for books, episodes for shows, chapters for manga/web novels, etc. */
  count?: MediaCount;
  /** Ordered newest to oldest by the caller. Empty for media without releases. */
  latestEntries?: MediaEntry[];
  /** Optional short text, useful for books with no recent entries. */
  description?: string;
  rating?: MediaRating;
  status?: MediaStatus;
  views?: number;
  /** Generic progress: chapters read, pages read, episodes watched, etc. */
  progress?: { current: number; total?: number; label?: string };
}
export interface MediaCardLabels {
  new: string;
  ongoing: string;
  completed: string;
  hiatus: string;
  cancelled: string;
  open: string;
  openCreator: string;
  language: string;
  rating: string;
  progress: string;
  /** Accessibility conjunction in entry/rating labels (optional for backwards compatibility). */
  of?: string;
  /** Cover image alt prefix. */
  coverAlt?: string;
}
export interface MediaCardProps {
  item: MediaItem;
  variant?: MediaVariant;
  theme?: MediaTheme;
  density?: MediaDensity;
  /** UI label language; independent of item.language (content language). Defaults to English. */
  locale?: MediaCardLocale;
  languageDisplay?: LanguageDisplay;
  languagePlacement?: LanguagePlacement;
  flagBackground?: boolean;
  showLanguage?: boolean;
  showCount?: boolean;
  showRating?: boolean;
  showLatestEntries?: boolean;
  showCreators?: boolean;
  showStatus?: boolean;
  showProgress?: boolean;
  showNewBadge?: boolean;
  maxRecentEntries?: number;
  /** Optional override for the locale-aware unit formatter. */
  countFormatter?: (count: MediaCount) => string;
  labels?: Partial<MediaCardLabels>;
  coverAspectRatio?: CSSProperties['aspectRatio'];
  style?: CSSProperties;
  className?: string;
  coverFallback?: ReactNode;
  onOpenMedia?: (item: MediaItem) => void;
  onOpenEntry?: (entry: MediaEntry, item: MediaItem) => void;
  onOpenCreator?: (creator: MediaCreator, item: MediaItem) => void;
}
