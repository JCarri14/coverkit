import type { MediaLanguage, LanguageDisplay } from './media-card.types';

function CountryFlag({ region }: { region: string }) {
  const shared = { className: 'ck-flag-svg', viewBox: '0 0 60 40', role: 'img' as const, 'aria-hidden': true as const };
  switch (region.toUpperCase()) {
    case 'ES': return <svg {...shared}><rect width="60" height="40" fill="#aa151b"/><rect y="10" width="60" height="20" fill="#f1bf00"/><rect x="17" y="15" width="8" height="11" rx="1" fill="#f5eee0" stroke="#aa151b"/></svg>;
    case 'GB': return <svg {...shared}><rect width="60" height="40" fill="#012169"/><path d="M-8-5 68 45M68-5-8 45" stroke="#fff" strokeWidth="12"/><path d="M-8-5 68 45M68-5-8 45" stroke="#c8102e" strokeWidth="4"/><path d="M30 0v40M0 20h60" stroke="#fff" strokeWidth="13"/><path d="M30 0v40M0 20h60" stroke="#c8102e" strokeWidth="6"/></svg>;
    case 'US': return <svg {...shared}><rect width="60" height="40" fill="#fff"/>{Array.from({ length: 7 }, (_, i) => <rect key={i} y={i * 6} width="60" height="3" fill="#b22234"/>)}<rect width="25" height="22" fill="#3c3b6e"/><g fill="white">{[5,12,19].flatMap(x => [5,11,17].map(y => <circle key={`${x}-${y}`} cx={x} cy={y} r="1"/>))}</g></svg>;
    case 'JP': return <svg {...shared}><rect width="60" height="40" fill="#fff"/><circle cx="30" cy="20" r="12" fill="#bc002d"/></svg>;
    case 'KR': return <svg {...shared}><rect width="60" height="40" fill="#fff"/><path d="M17 20a13 13 0 0 1 26 0c0 8-13 12-13 0s-13-8-13 0" fill="#cd2e3a"/><path d="M43 20a13 13 0 0 1-26 0c0-8 13-12 13 0s13 8 13 0" fill="#0047a0"/></svg>;
    case 'FR': return <svg {...shared}><rect width="20" height="40" fill="#002395"/><rect x="20" width="20" height="40" fill="#fff"/><rect x="40" width="20" height="40" fill="#ed2939"/></svg>;
    default: return null;
  }
}
const SUPPORTED_REGIONS = new Set(['ES', 'GB', 'US', 'JP', 'KR', 'FR']);
export function MediaLanguageBadge({ language, display = 'code', onCover = false, flagBackground = false, label = 'Language' }: {
  language: MediaLanguage; display?: LanguageDisplay; onCover?: boolean; flagBackground?: boolean; label?: string;
}) {
  const region = language.region?.toUpperCase();
  const flag = display === 'flag' && region != null && SUPPORTED_REGIONS.has(region);
  return <span className={`ck-language ${onCover ? 'ck-language--cover' : 'ck-language--inline'} ${flag ? 'ck-language--flag' : ''} ${flag && flagBackground ? 'ck-language--flag-bg' : ''}`}
    title={language.label ?? `${label}: ${language.code.toUpperCase()}${region ? ` (${region})` : ''}`} aria-label={language.label ?? `${label} ${language.code.toUpperCase()}`}>
    {flag ? <CountryFlag region={region!} /> : language.code.toUpperCase()}
  </span>;
}
