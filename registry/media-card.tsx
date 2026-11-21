import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import type { MediaItem, MediaCardProps, MediaEntry, MediaCount, MediaCardLabels, LanguageDisplay, MediaVariant } from './media-card.types';
import { Icon } from './media-card.icons';
import { MediaLanguageBadge } from './media-card.language';
import { mediaCardLocales, formatMediaCount } from './media-card.locales';
import type { MediaCardLocale } from './media-card.locales';
import './media-card.css';

export { MediaLanguageBadge } from './media-card.language';
export { formatMediaCount } from './media-card.locales';

function Action({ href, onClick, className, children, label }: { href?: string; onClick?: () => void; className: string; children: ReactNode; label: string }) {
  if (onClick) return <button type="button" className={className} onClick={onClick} aria-label={label}>{children}</button>;
  if (href) return <a className={className} href={href} aria-label={label}>{children}</a>;
  return <span className={className} aria-label={label}>{children}</span>;
}
export function MediaCoverView({ item, variant = 'standard', languageDisplay = 'code', languagePlacement = 'cover', flagBackground = false,
  showLanguage = true, showCount = true, showRating = true, coverFallback, coverAspectRatio, onOpenMedia, labels = {}, countFormatter, locale = 'en' }: {
  item: MediaItem; variant?: MediaVariant; languageDisplay?: LanguageDisplay; languagePlacement?: 'cover' | 'title'; flagBackground?: boolean;
  showLanguage?: boolean; showCount?: boolean; showRating?: boolean; coverFallback?: ReactNode; coverAspectRatio?: CSSProperties['aspectRatio']; onOpenMedia?: MediaCardProps['onOpenMedia']; labels?: Partial<MediaCardLabels>; countFormatter?: (count: MediaCount) => string; locale?: MediaCardLocale;
}) {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(item.cover?.src) && item.cover?.src !== failedSrc;
  const countOnCover = showCount && item.count != null && Number.isFinite(item.count.value) && variant !== 'compact';
  const langOnCover = showLanguage && item.language && languagePlacement === 'cover' && (variant === 'minimal' || variant === 'standard');
  const ratingOnCover = showRating && item.rating && Number.isFinite(item.rating.value) && variant === 'standard';
  const l = { ...mediaCardLocales[locale].labels, ...labels };
  const formatCount = countFormatter ?? ((count: MediaCount) => formatMediaCount(count, locale));
  return <Action href={item.href} onClick={onOpenMedia ? () => onOpenMedia(item) : undefined} className="ck-cover-action" label={`${l.open} ${item.title}`}>
    <span className={`ck-cover ck-cover--${variant}`} style={coverAspectRatio ? { aspectRatio: coverAspectRatio } : undefined}>
      {showImage ? <img key={item.cover!.src} src={item.cover!.src} alt={item.cover?.alt ?? `${l.coverAlt ?? mediaCardLocales[locale].labels.coverAlt} ${item.title}`} style={{ objectPosition: item.cover?.objectPosition }} onError={() => setFailedSrc(item.cover?.src ?? null)} loading="lazy" /> : <span className="ck-image-fallback">{coverFallback ?? <Icon name="image" size={34} />}</span>}
      {langOnCover && <span className="ck-overlay ck-overlay--top-left"><MediaLanguageBadge language={item.language!} display={languageDisplay} onCover flagBackground={flagBackground} label={l.language} /></span>}
      {countOnCover && <span className="ck-overlay ck-overlay--top-right"><span className="ck-count"><Icon name={item.count!.unit === 'episodes' ? 'play' : item.count!.unit === 'pages' ? 'file' : 'book'} />{formatCount(item.count!)}</span></span>}
      {ratingOnCover && <span className="ck-overlay ck-overlay--bottom-left"><span className="ck-cover-rating"><Icon name="star" />{item.rating!.value.toFixed(1)}</span></span>}
    </span>
  </Action>;
}
export function MediaEntryList({ entries, item, max = 3, showNewBadge = true, onOpenEntry, labels = {}, locale = 'en' }: {
  item: MediaItem; entries: MediaEntry[]; max?: number; showNewBadge?: boolean; onOpenEntry?: MediaCardProps['onOpenEntry']; labels?: Partial<MediaCardLabels>; locale?: MediaCardLocale;
}) {
  const l = { ...mediaCardLocales[locale].labels, ...labels };
  return <div className="ck-chapter-list">{entries.slice(0, Math.max(0, max)).map(entry =>
    <Action key={entry.id} href={entry.href} onClick={onOpenEntry ? () => onOpenEntry(entry, item) : undefined} className="ck-chapter" label={`${l.open} ${entry.label} ${l.of ?? mediaCardLocales[locale].labels.of} ${item.title}`}>
      <span className="ck-chapter-name">{entry.label}</span>
      <span className="ck-chapter-right">{showNewBadge && entry.isNew ? <span className="ck-new">{l.new}</span> : (entry.publishedLabel && <span className="ck-date">{entry.publishedLabel}</span>)}</span>
    </Action>
  )}</div>;
}
function MetaStatus({ item, labels }: { item: MediaItem; labels: MediaCardLabels }) {
  return item.status ? <span className="ck-status"><span className={`ck-status-dot ck-status-dot--${item.status}`} />{labels[item.status]}</span> : null;
}
function Progress({ item, labels }: { item: MediaItem; labels: MediaCardLabels }) {
  if (!item.progress) return null;
  const total = item.progress.total ?? item.count?.value;
  if (!total || total <= 0 || !Number.isFinite(total)) return null;
  const current = Math.max(0, Math.min(total, item.progress.current));
  return <div className="ck-progress" role="progressbar" aria-label={item.progress.label ?? labels.progress} aria-valuemin={0} aria-valuemax={total} aria-valuenow={current} title={`${current} / ${total}`}><span style={{ width: `${current / total * 100}%` }} /></div>;
}
function Rating({ item, labels }: { item: MediaItem; labels: MediaCardLabels }) {
  if (!item.rating || !Number.isFinite(item.rating.value)) return null;
  return <span className="ck-rating" aria-label={`${labels.rating} ${item.rating.value} ${labels.of ?? 'of'} ${item.rating.max ?? 10}`}><Icon name="star" />{item.rating.value.toFixed(1)}</span>;
}
function Creator({ item, labels, onOpenCreator }: { item: MediaItem; labels: MediaCardLabels; onOpenCreator?: MediaCardProps['onOpenCreator'] }) {
  const creator = item.creators?.[0];
  if (!creator) return null;
  return <Action className="ck-creator" href={creator.href} onClick={onOpenCreator ? () => onOpenCreator(creator, item) : undefined} label={`${labels.openCreator} ${creator.name}`}>{creator.name}</Action>;
}
export function MediaCard({ item, variant = 'standard', theme = 'inherit', density = 'comfortable', languageDisplay = 'code',
  languagePlacement = 'cover', flagBackground = false, showLanguage = true, showCount = true, showRating = true,
  showLatestEntries = true, showCreators = true, showStatus = false, showProgress = false, showNewBadge = true,
  maxRecentEntries = 3, coverAspectRatio, coverFallback, onOpenMedia, onOpenEntry, onOpenCreator, labels = {}, countFormatter, locale = 'en', className = '', style,
}: MediaCardProps) {
  const l = { ...mediaCardLocales[locale].labels, ...labels };
  const formatCount = countFormatter ?? ((count: MediaCount) => formatMediaCount(count, locale));
  const compact = variant === 'compact', detailed = variant === 'detailed';
  const inlineLanguage = compact || detailed || languagePlacement === 'title';
  const language = showLanguage && inlineLanguage && item.language ? <MediaLanguageBadge language={item.language} display={languageDisplay} flagBackground={flagBackground} label={l.language} /> : null;
  const title = <div className="ck-heading"><div className="ck-title-row">{language}<Action className="ck-title" href={item.href} onClick={onOpenMedia ? () => onOpenMedia(item) : undefined} label={`${l.open} ${item.title}`}>{item.title}</Action></div>{detailed && showCreators && <Creator item={item} labels={l} onOpenCreator={onOpenCreator} />}</div>;
  const recent = item.latestEntries ?? [];
  const latest = recent[0];
  const cover = <MediaCoverView item={item} variant={variant} languageDisplay={languageDisplay} languagePlacement={languagePlacement} flagBackground={flagBackground}
    showLanguage={showLanguage} showCount={showCount} showRating={showRating} coverAspectRatio={coverAspectRatio} coverFallback={coverFallback} onOpenMedia={onOpenMedia} labels={labels} countFormatter={formatCount} locale={locale} />;
  const status = showStatus ? <MetaStatus item={item} labels={l} /> : null;
  const progress = showProgress ? <Progress item={item} labels={l} /> : null;
  return <article className={`ck-card ck-card--${variant} ${className}`.trim()} data-ck-theme={theme} data-ck-density={density} data-ck-kind={item.kind} style={style}>
    {variant === 'minimal' && <>{cover}<div className="ck-caption">{title}{status}{progress}</div></>}
    {variant === 'standard' && <>{cover}<div className="ck-caption">{title}{showLatestEntries && latest && <div className="ck-summary"><span className="ck-summary-primary">{latest.label}</span>{latest.publishedLabel && <span className="ck-muted">{latest.publishedLabel}</span>}{showNewBadge && latest.isNew && <span className="ck-new">{l.new}</span>}</div>}{status}{progress}</div></>}
    {detailed && <><div className="ck-detail-cover">{cover}</div><div className="ck-detail-body"><div>{title}<div className="ck-detail-meta">{showRating && <Rating item={item} labels={l} />}{status}</div>{progress}</div>{showLatestEntries && recent.length > 0 ? <MediaEntryList item={item} entries={recent} max={maxRecentEntries} showNewBadge={showNewBadge} onOpenEntry={onOpenEntry} labels={labels} locale={locale} /> : item.description ? <p className="ck-description">{item.description}</p> : null}</div></>}
    {compact && <><div className="ck-compact-cover">{cover}</div><div className="ck-compact-body">{title}<div className="ck-compact-meta">{showLatestEntries && latest && <Action className="ck-latest-link" href={latest.href} onClick={onOpenEntry ? () => onOpenEntry(latest, item) : undefined} label={`${l.open} ${latest.label}`}>{latest.label}</Action>}{showLatestEntries && showNewBadge && latest?.isNew && <span className="ck-new">{l.new}</span>}{status}</div><div className="ck-compact-bottom">{showLatestEntries && latest?.publishedLabel && <span>{latest.publishedLabel}</span>}{showCount && item.count && <span>{formatCount(item.count)}</span>}{showRating && item.rating && Number.isFinite(item.rating.value) && <span>★ {item.rating.value.toFixed(1)}</span>}</div>{progress}</div></>}
  </article>;
}
