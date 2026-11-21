import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode, MouseEvent } from 'react';
import type { MediaItem, MediaKind, MediaCardProps, MediaVariant, LanguageDisplay, MediaDensity, MediaTheme } from '@coverkit/react';
import { MediaCard } from '@coverkit/react';
import { AnimatedMediaCard } from '@coverkit/animated';
import type { MediaEntrance, MediaAnimationTrigger } from '@coverkit/animated';
import { ArrowRight, BookOpen, Check, ChevronDown, Copy, Layers3, RotateCcw, SlidersHorizontal, Sun, Moon, X, Play, Globe } from 'lucide-react';
import { samples, scenarios } from './sample-data';
import { messages, localizeDemoItem } from './i18n';
import type { Locale } from './i18n';
import { hrefFor, parseLocation } from './routing';
import type { ViewMode } from './routing';
import './styles.css';

export type { ViewMode } from './routing';
export { parseLocation } from './routing';

const VARIANTS: MediaVariant[] = ['minimal', 'standard', 'detailed', 'compact'];
const SCENARIOS = ['normal','long','many','short','book','series','comic','webnovel','noRating','empty'] as const;
const DEFAULTS = {
  variant: 'standard' as MediaVariant, theme: 'light' as MediaTheme, density: 'comfortable' as MediaDensity,
  languageDisplay: 'code' as LanguageDisplay, languagePlacement: 'cover' as 'cover' | 'title',
  flagBackground: false, showLanguage: true, showCount: true, showRating: true,
  showLatestEntries: true, showCreators: true, showNewBadge: true, showStatus: false,
  showProgress: false, scenario: 'normal',
};
type Settings = typeof DEFAULTS;
const FEATURED_IDS = ['orbit-of-ash','velvet-eclipse','paper-kingdom','moonlit-signals','glass-ronin','morrow-gate'];

function BtnGroup<T extends string>({ options, value, onChange, className = '', ariaLabel }: {
  options: { value: T; label: string; icon?: ReactNode }[]; value: T;
  onChange: (value: T) => void; className?: string; ariaLabel: string;
}) {
  return <div className={`segmented ${className}`} role="group" aria-label={ariaLabel}>
    {options.map(option => <button key={option.value} type="button" className={value === option.value ? 'is-active' : ''}
      aria-pressed={value === option.value} onClick={() => onChange(option.value)}>{option.icon}{option.label}</button>)}
  </div>;
}
function SettingToggle({ checked, onChange, children }: { checked: boolean; onChange: (checked: boolean) => void; children: ReactNode }) {
  return <label className="setting-toggle"><span>{children}</span><input type="checkbox" checked={checked} onChange={event => onChange(event.target.checked)}/><span className="switch" aria-hidden="true"/></label>;
}
function SpainFlag() {
  return <svg viewBox="0 0 60 40" width="22" height="15" aria-hidden="true" focusable="false"><rect width="60" height="40" fill="#aa151b"/><rect y="10" width="60" height="20" fill="#f1bf00"/></svg>;
}
function SettingSection({ label, children }: { label: string; children: ReactNode }) {
  return <section className="control-section"><h3>{label}</h3>{children}</section>;
}
function codeExample(variant: MediaVariant, settings: Settings, item: MediaItem, locale: Locale, animation: MediaEntrance, trigger: MediaAnimationTrigger, duration: number) {
  const animated = animation !== 'none';
  const props = [`  variant="${variant}"`, '  item={item}', `  locale="${locale}"`, `  theme="${settings.theme}"`];
  if (settings.languageDisplay !== 'code') props.push(`  languageDisplay="${settings.languageDisplay}"`);
  if (settings.languagePlacement !== 'cover') props.push(`  languagePlacement="${settings.languagePlacement}"`);
  if (settings.density !== 'comfortable') props.push(`  density="${settings.density}"`);
  if (settings.flagBackground) props.push('  flagBackground');
  (['showLanguage','showCount','showRating','showLatestEntries','showCreators','showNewBadge'] as const).forEach(key => {
    if (!settings[key]) props.push(`  ${key}={false}`);
  });
  (['showStatus','showProgress'] as const).forEach(key => { if(settings[key]) props.push(`  ${key}`); });
  if (animated) props.push(`  animation="${animation}"`, `  trigger="${trigger}"`, `  duration={${(duration/1000).toFixed(2)}}`);
  props.push('  onOpenMedia={(media) => console.log(media.id)}');
  return `import { ${animated ? 'AnimatedMediaCard' : 'MediaCard'} } from '${animated ? '@coverkit/animated' : '@coverkit/react'}';\nimport type { MediaItem } from '@coverkit/react';\n\nconst item: MediaItem = {\n  id: ${JSON.stringify(item.id)},\n  title: ${JSON.stringify(item.title)},\n  kind: ${JSON.stringify(item.kind)},\n  count: ${item.count ? JSON.stringify(item.count) : 'undefined'},\n};\n\n<${animated ? 'AnimatedMediaCard' : 'MediaCard'}\n${props.join('\n')}\n/>`;
}

/** A demo-only click effect. Public MediaCard callbacks remain consumer-defined. */
function InteractivePreviewCard({ animated, animation, trigger, duration, replayKey = 0, staggerIndex = 0, ...props }: MediaCardProps & {
  animated: boolean; animation: MediaEntrance; trigger: MediaAnimationTrigger; duration: number; replayKey?: number; staggerIndex?: number;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const activeAnimations = useRef<Animation[]>([]);
  useEffect(() => () => { activeAnimations.current.forEach(animation => animation.cancel()); }, []);
  const feedback = () => {
    if (typeof window === 'undefined' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const card = hostRef.current?.querySelector<HTMLElement>('.ck-card');
    if (!card || typeof card.animate !== 'function') return;
    activeAnimations.current.forEach(animation => animation.cancel());
    const press = card.animate([{transform:'scale(1)'},{transform:'scale(.976)',offset:.28},{transform:'scale(1.009)',offset:.67},{transform:'scale(1)'}],{duration:340,easing:'cubic-bezier(.22,.7,.24,1)'});
    const cover = card.querySelector<HTMLElement>('.ck-cover');
    const glow = cover?.animate([{filter:'brightness(1)'},{filter:'brightness(1.095)',offset:.42},{filter:'brightness(1)'}],{duration:340,easing:'ease-out'});
    activeAnimations.current = glow ? [press,glow] : [press];
  };
  const previewProps = { ...props, onOpenMedia: feedback };
  return <div ref={hostRef} className="interactive-card-preview">
    {animated ? <AnimatedMediaCard key={`animated-${replayKey}`} {...previewProps} animation={animation} trigger={trigger} duration={duration/1000} staggerIndex={staggerIndex}/> : <MediaCard {...previewProps}/>}
  </div>;
}

export default function App({ initialMode = 'component', initialLocale = 'en' }: { initialMode?: ViewMode; initialLocale?: Locale }) {
  const [mode,setMode] = useState<ViewMode>(initialMode);
  const [locale,setLocale] = useState<Locale>(initialLocale);
  const [settings,setSettings] = useState<Settings>(DEFAULTS);
  const [customizing,setCustomizing] = useState(false);
  const [studyCoverMode,setStudyCoverMode] = useState<'artwork'|'mockup'>('artwork');
  const [showAdvanced,setShowAdvanced] = useState(false);
  const [galleryFilter,setGalleryFilter] = useState<MediaVariant|'all'>('all');
  const [kindFilter,setKindFilter] = useState<MediaKind|'all'>('all');
  const [animation,setAnimation] = useState<MediaEntrance>('none');
  const [trigger,setTrigger] = useState<MediaAnimationTrigger>('in-view');
  const [duration,setDuration] = useState(350);
  const [replayKey,setReplayKey] = useState(0);
  const [notice,setNotice] = useState<string|null>(null);
  const [copied,setCopied] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const customizeButtonRef = useRef<HTMLButtonElement>(null);
  const noticeTimeout = useRef<ReturnType<typeof setTimeout>|null>(null);
  const copyTimeout = useRef<ReturnType<typeof setTimeout>|null>(null);
  const t = messages[locale];
  const set = <K extends keyof Settings>(key: K, value: Settings[K]) => setSettings(current => ({ ...current, [key]: value }));
  const sample = localizeDemoItem(scenarios[settings.scenario] ?? samples[0],locale);
  const studySample = useMemo(() => studyCoverMode === 'artwork' ? sample : {...sample,cover:undefined},[sample,studyCoverMode]);
  const currentCode = codeExample(settings.variant,settings,sample,locale,animation,trigger,duration);
  const variantOptions = VARIANTS.map(id=>({value:id,label:t.variants[id].label}));

  useEffect(()=>{
    if (!customizing) return;
    const onPointerDown=(event:PointerEvent)=>{if(event.target instanceof Node && !panelRef.current?.contains(event.target) && !customizeButtonRef.current?.contains(event.target))setCustomizing(false);};
    const onKeyDown=(event:KeyboardEvent)=>{if(event.key==='Escape'){setCustomizing(false);customizeButtonRef.current?.focus();}};
    document.addEventListener('pointerdown',onPointerDown);
    document.addEventListener('keydown',onKeyDown);
    return ()=>{document.removeEventListener('pointerdown',onPointerDown);document.removeEventListener('keydown',onKeyDown);};
  },[customizing]);
  useEffect(()=>{
    try{const stored=localStorage.getItem('coverkit-theme');if(stored==='light'||stored==='dark')setSettings(current=>({...current,theme:stored}));}catch{/* Storage is optional. */}
  },[]);
  useEffect(()=>{try{localStorage.setItem('coverkit-theme',settings.theme);}catch{/* Storage is optional. */}},[settings.theme]);
  useEffect(()=>{
    const onPopState=()=>{const current=parseLocation(window.location.pathname);setMode(current.mode);setLocale(current.locale);};
    window.addEventListener('popstate',onPopState);
    return ()=>window.removeEventListener('popstate',onPopState);
  },[]);
  useEffect(()=>{
    document.documentElement.lang=locale;
    document.title=t.pageMeta[mode].title;
    document.querySelector('meta[name="description"]')?.setAttribute('content',t.pageMeta[mode].description);
    const absoluteUrl=(lang:Locale)=>new URL(hrefFor(mode,lang),window.location.origin).href;
    document.querySelector('link[rel="canonical"]')?.setAttribute('href',absoluteUrl(locale));
    for(const lang of ['en','es','x-default'] as const){
      document.querySelector(`link[rel="alternate"][hreflang="${lang}"]`)?.setAttribute('href',absoluteUrl(lang==='x-default'?'en':lang));
    }
    document.querySelector('meta[property="og:url"]')?.setAttribute('content',absoluteUrl(locale));
    document.querySelector('meta[property="og:locale"]')?.setAttribute('content',locale==='es'?'es_ES':'en_US');
  },[locale,mode,t]);
  useEffect(()=>()=>{if(noticeTimeout.current)clearTimeout(noticeTimeout.current);if(copyTimeout.current)clearTimeout(copyTimeout.current);},[]);

  const notify=(text:string)=>{setNotice(text);if(noticeTimeout.current)clearTimeout(noticeTimeout.current);noticeTimeout.current=setTimeout(()=>setNotice(null),2900);};
  const copyCode=async()=>{
    try{await navigator.clipboard.writeText(currentCode);setCopied(true);if(copyTimeout.current)clearTimeout(copyTimeout.current);copyTimeout.current=setTimeout(()=>setCopied(false),1500);}catch{notify(t.guide.copyError);}
  };
  const componentProps:Omit<MediaCardProps,'item'|'variant'>={
    ...settings,locale,
    onOpenEntry:(entry,item)=>notify(`${t.notices.entry} ${item.title} · ${entry.label} (${t.notices.demo})`),
    onOpenCreator:creator=>notify(`${t.notices.creator} ${creator.name} (${t.notices.demo})`),
  };
  const go=(next:ViewMode,nextLocale=locale)=>{
    setMode(next);setLocale(nextLocale);setCustomizing(false);
    if(typeof window!=='undefined'){
      const dest=hrefFor(next,nextLocale);if(window.location.pathname!==dest)window.history.pushState({mode:next,locale:nextLocale},'',dest);
      window.scrollTo({top:0,behavior:'auto'});
    }
  };
  const navigate=(event:MouseEvent<HTMLAnchorElement>,next:ViewMode,nextLocale=locale)=>{
    if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
    event.preventDefault();go(next,nextLocale);
  };
  const featured=FEATURED_IDS.map(id=>samples.find(item=>item.id===id)).filter((item):item is MediaItem=>Boolean(item));
  const filteredItems=(kindFilter==='all'?featured:samples.filter(item=>item.kind===kindFilter)).slice(0,6).map(item=>localizeDemoItem(item,locale));
  const galleryVariants=galleryFilter==='all'?VARIANTS:VARIANTS.filter(id=>id===galleryFilter);
  const tryMedia = (item:MediaItem,variant:MediaVariant,index=0)=><InteractivePreviewCard {...componentProps} item={item} variant={variant} animated={animation!=='none'} animation={animation} trigger={trigger} duration={duration} replayKey={replayKey} staggerIndex={index}/>;
  const themeButton = <button type="button" className="theme-switch" onClick={()=>set('theme',settings.theme==='light'?'dark':'light')} aria-label={settings.theme==='light'?t.nav.dark:t.nav.light} title={settings.theme==='light'?t.nav.dark:t.nav.light}>{settings.theme==='light'?<Moon size={17}/>:<Sun size={17}/>}</button>;

  return <div className="site" data-theme={settings.theme}>
    <div className="site-shell">
      <header className="topbar">
        <a className="brand" href={hrefFor('component',locale)} onClick={event=>navigate(event,'component')} aria-label={t.nav.brand}>
          <span className="brand-mark"><Layers3 size={19}/></span><span className="brand-text"><strong>CoverKit</strong><small>Design System Experiment</small></span>
        </a>
        <div className="nav-actions">
          <nav className="topnav" aria-label={t.nav.aria}>
            <a href={hrefFor('component',locale)} className={mode==='component'?'is-current':''} aria-current={mode==='component'?'page':undefined} onClick={event=>navigate(event,'component')}>{t.nav.component}</a>
            <a href={hrefFor('gallery',locale)} className={mode==='gallery'?'is-current':''} aria-current={mode==='gallery'?'page':undefined} onClick={event=>navigate(event,'gallery')}>{t.nav.gallery}</a>
            <a href={hrefFor('docs',locale)} className={mode==='docs'||mode==='reference'?'is-current':''} aria-current={mode==='docs'||mode==='reference'?'page':undefined} onClick={event=>navigate(event,'docs')}>{t.nav.docs}</a>
          </nav>
          <div className="locale-switch" role="group" aria-label={t.nav.language}>
            <Globe size={14} aria-hidden="true"/>
            {(['en','es'] as const).map(lang=><a key={lang} href={hrefFor(mode,lang)} aria-current={locale===lang?'true':undefined} className={locale===lang?'is-active':''} hrefLang={lang} lang={lang} onClick={event=>navigate(event,mode,lang)}>{lang.toUpperCase()}</a>)}
          </div>
          {themeButton}
        </div>
      </header>

      {mode==='component' && <main className="studio-canvas" aria-label={t.studio.main}>
        <h1 className="visually-hidden">CoverKit MediaCard React component playground</h1>
        <div className="canvas-actions"><button ref={customizeButtonRef} className={`customize-button ${customizing?'is-active':''}`} type="button" aria-expanded={customizing} aria-controls="coverkit-settings" onClick={()=>setCustomizing(value=>!value)}><SlidersHorizontal size={16}/>{t.studio.customize}</button></div>
        <div className="variant-toolbar"><BtnGroup className="variant-select" ariaLabel={t.gallery.filterVariants} value={settings.variant} onChange={value=>set('variant',value)} options={variantOptions}/></div>
        <div className="canvas-center"><div className={`specimen specimen-${settings.variant}`}>{tryMedia(studySample,settings.variant)}</div></div>
        {animation!=='none' && <button className="replay-animation" type="button" onClick={()=>setReplayKey(n=>n+1)}><Play size={13}/>{t.studio.replay}</button>}
        {customizing && <aside id="coverkit-settings" ref={panelRef} className="settings-popover" role="dialog" aria-modal="false" aria-labelledby="settingsHeading">
          <div className="settings-heading"><h2 id="settingsHeading"><SlidersHorizontal size={15}/>{t.studio.customize}</h2><button aria-label={t.studio.close} type="button" onClick={()=>{setCustomizing(false);customizeButtonRef.current?.focus();}}><X size={17}/></button></div>
          <div className="settings-body">
            <SettingSection label={t.studio.appearance}>
              <label className="field-label">{t.studio.cover}</label>
              <BtnGroup value={studyCoverMode} ariaLabel={t.studio.cover} onChange={setStudyCoverMode} options={[{value:'artwork',label:t.studio.illustration},{value:'mockup',label:t.studio.mockup}]}/>
              <small>{t.studio.coverHint}</small>
            </SettingSection>
            <SettingSection label={t.studio.language}>
              <SettingToggle checked={settings.showLanguage} onChange={value=>set('showLanguage',value)}>{t.studio.showLanguage}</SettingToggle>
              <BtnGroup value={settings.languageDisplay} ariaLabel={t.studio.languageStyle} onChange={value=>set('languageDisplay',value)} options={[{value:'code',label:'ES'},{value:'flag',label:t.studio.flag,icon:<SpainFlag/>}]}/>
              <label className="field-label" htmlFor="languagePlace">{t.studio.placement}</label>
              <select id="languagePlace" value={settings.languagePlacement} onChange={event=>set('languagePlacement',event.target.value as 'cover'|'title')}><option value="cover">{t.studio.onCover}</option><option value="title">{t.studio.beforeTitle}</option></select>
              <small>{t.studio.placementHint}</small>
            </SettingSection>
            <SettingSection label={t.studio.metadata}>
              <SettingToggle checked={settings.showCount} onChange={value=>set('showCount',value)}>{t.studio.showCount}</SettingToggle>
              <SettingToggle checked={settings.showRating} onChange={value=>set('showRating',value)}>{t.studio.showRating}</SettingToggle>
              <SettingToggle checked={settings.showLatestEntries} onChange={value=>set('showLatestEntries',value)}>{t.studio.showRecent}</SettingToggle>
              <SettingToggle checked={settings.showCreators} onChange={value=>set('showCreators',value)}>{t.studio.showCreators}</SettingToggle>
            </SettingSection>
            <SettingSection label={t.studio.scenario}>
              <select aria-label={t.studio.scenario} value={settings.scenario} onChange={event=>set('scenario',event.target.value)}>{SCENARIOS.map(s=><option value={s} key={s}>{t.scenarios[s]}</option>)}</select>
            </SettingSection>
            <SettingSection label={t.studio.animation}>
              <label className="field-label">{t.studio.animationType}</label>
              <BtnGroup value={animation} ariaLabel={t.studio.animationType} onChange={setAnimation} options={[{value:'none',label:t.studio.none},{value:'fade-up',label:t.studio.fade},{value:'scale-in',label:t.studio.scale}]}/>
              {animation!=='none' && <><label className="field-label">{t.studio.trigger}</label>
                <BtnGroup value={trigger} ariaLabel={t.studio.trigger} onChange={setTrigger} options={[{value:'mount',label:t.studio.mount},{value:'in-view',label:t.studio.viewport}]}/>
                <label className="field-label" htmlFor="animationDuration">{t.studio.duration} · {duration} ms</label>
                <input id="animationDuration" className="animation-duration" type="range" min="150" max="700" step="50" value={duration} onChange={event=>setDuration(Number(event.target.value))}/></>}
              <small>{t.studio.animationHint}</small>
            </SettingSection>
            <div className="advanced-control"><button type="button" aria-expanded={showAdvanced} onClick={()=>setShowAdvanced(value=>!value)}>{t.studio.advanced}<ChevronDown size={14} className={showAdvanced?'rotate':''}/></button>
              {showAdvanced && <div className="advanced-content"><label className="field-label">{t.studio.density}</label>
                <BtnGroup value={settings.density} ariaLabel={t.studio.density} onChange={value=>set('density',value)} options={[{value:'comfortable',label:t.studio.comfortable},{value:'compact',label:t.studio.compact}]}/>
                <SettingToggle checked={settings.flagBackground} onChange={value=>set('flagBackground',value)}>{t.studio.flagBackground}</SettingToggle>
                <SettingToggle checked={settings.showNewBadge} onChange={value=>set('showNewBadge',value)}>{t.studio.newBadge}</SettingToggle>
                <SettingToggle checked={settings.showStatus} onChange={value=>set('showStatus',value)}>{t.studio.status}</SettingToggle>
                <SettingToggle checked={settings.showProgress} onChange={value=>set('showProgress',value)}>{t.studio.progress}</SettingToggle>
              </div>}
            </div>
            <button className="reset-button" type="button" onClick={()=>{setSettings(DEFAULTS);setStudyCoverMode('artwork');setAnimation('none');setTrigger('in-view');setDuration(350);}}><RotateCcw size={13}/>{t.studio.reset}</button>
          </div>
        </aside>}
      </main>}

      {mode==='gallery' && <main className="content-page gallery-page">
        <div className="page-heading"><div><p className="section-overline">{t.gallery.overline}</p><h1>{t.gallery.title}</h1><p>{t.gallery.lead}</p></div></div>
        <div className="gallery-filters">
          <BtnGroup className="gallery-variant-filter" ariaLabel={t.gallery.filterVariants} value={galleryFilter} onChange={setGalleryFilter} options={[{value:'all' as const,label:t.gallery.all},...variantOptions]}/>
          <label className="gallery-kind-label">{t.gallery.content}<select value={kindFilter} onChange={event=>setKindFilter(event.target.value as MediaKind|'all')}>
            <option value="all">{t.gallery.allKinds}</option>{(['manga','web-novel','book','novel','series','comic','webtoon'] as const).map(kind=><option key={kind} value={kind}>{t.gallery.kinds[kind]}</option>)}
          </select></label>
        </div>
        {galleryVariants.map((variant,index)=><section className="gallery-section" key={variant} aria-labelledby={`gallery-${variant}`}>
          <div className="gallery-section-title"><div><span className="gallery-index">{String(galleryFilter==='all'?index+1:VARIANTS.indexOf(variant)+1).padStart(2,'0')}</span><h2 id={`gallery-${variant}`}>{t.variants[variant].label}</h2></div><p>{t.variants[variant].use}</p></div>
          <div className={`gallery-rail gallery-rail-${variant}`} aria-label={`${t.gallery.examples} ${variant}`}>
            {filteredItems.map((item,i)=><div className="gallery-item" key={`${variant}-${item.id}`}>{tryMedia(item,variant,i)}<span className="gallery-kind">{t.gallery.kinds[item.kind??'other']}</span></div>)}
          </div>{filteredItems.length===0&&<p className="empty-gallery">{t.gallery.none}</p>}
        </section>)}
      </main>}

      {mode==='docs' && <main className="content-page documentation">
        <div className="page-heading"><div><p className="section-overline">{t.guide.overline}</p><h1>{t.guide.title}</h1><p>{t.guide.lead}</p></div></div>
        <section className="guide-section guide-code"><div className="section-heading"><div><h2>{t.guide.example}</h2><p>{t.guide.exampleLead}</p></div>
          <button className="copy-button" type="button" onClick={copyCode}>{copied?<Check size={15}/>:<Copy size={15}/>} {copied?t.guide.copied:t.guide.copy}</button></div>
          <pre><code>{currentCode}</code></pre>
        </section>
        <section className="guide-section"><div className="section-heading"><div><h2>{t.guide.animation}</h2><p>{t.guide.animationLead}</p></div></div><pre className="reference-code">{t.guide.animationCode}</pre></section>
        <section className="guide-section"><div className="section-heading"><div><h2>{t.guide.anatomy}</h2><p>{t.guide.anatomyLead}</p></div></div>
          <BtnGroup className="guide-variants" ariaLabel={t.gallery.filterVariants} value={settings.variant} onChange={value=>set('variant',value)} options={variantOptions}/>
          <div className="guide-two-columns"><div><h3>{t.variants[settings.variant].label} · {t.guide.anatomyVariant}</h3><div className="anatomy-list">{t.guide.anatomyItems[settings.variant].map(([name,detail],index)=><div className="anatomy-row" key={name}><span>{String(index+1).padStart(2,'0')}</span><div><strong>{name}</strong><p>{detail}</p></div></div>)}</div></div>
            <div><h3>{t.guide.measurements}</h3><dl className="measurements">{[[t.guide.cover,'3:4'],[t.guide.radius,'14–15 px'],[t.guide.badgeHeight,'24 px'],[t.guide.spacing,'8–13 px'],[t.guide.titleSize,'12–13 px']].map(([name,value])=><div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}</dl><p className="measure-note">{t.guide.measurementNote}</p></div>
          </div>
        </section>
        <section className="guide-section"><div className="section-heading"><div><h2>{t.guide.technical}</h2><p>{t.guide.technicalLead}</p></div></div>
          <div className="doc-grid"><div><h3>{t.guide.installation}</h3><pre>pnpm install{'\n'}pnpm dev</pre><p>{t.guide.installationDetail}</p></div>
            <div><h3>{t.guide.contract}</h3><pre>{`MediaItem {\n  id, title, kind?, cover?,\n  count?, latestEntries?,\n  language?, creators?, rating?,\n  status?, progress?\n}`}</pre><p>{t.guide.contractDetail}</p></div>
            <div><h3>{t.guide.callbacks}</h3><pre>{`onOpenMedia(item)\nonOpenEntry(entry, item)\nonOpenCreator(creator, item)`}</pre><p>{t.guide.callbacksDetail}</p></div>
            <div><h3>{t.guide.tokens}</h3><pre>{`--ck-radius: 14px;\n--ck-badge-offset: 8px;\n--ck-primary: #b9a5ff;`}</pre><p>{t.guide.tokensDetail}</p></div></div>
          <h3 className="api-heading">{t.guide.api}</h3><div className="api-table">{t.guide.apiEntries.map(([name,type,desc])=><div key={name}><strong>{name}</strong><code>{type}</code><span>{desc}</span></div>)}</div>
          <p className="guide-footnote"><BookOpen size={15}/>{t.guide.further}<a href={hrefFor('reference',locale)} onClick={event=>navigate(event,'reference')}>{t.guide.referenceLink}</a></p>
        </section>
      </main>}

      {mode==='reference' && <main className="content-page documentation media-reference">
        <p className="section-overline">{t.reference.overline}</p><h1>{t.reference.title}</h1><p className="reference-lead">{t.reference.lead}</p>
        <div className="reference-actions"><a href={hrefFor('component',locale)} onClick={event=>navigate(event,'component')}>{t.reference.try}<ArrowRight size={15}/></a><a href={hrefFor('gallery',locale)} onClick={event=>navigate(event,'gallery')}>{t.reference.explore}</a></div>
        <section className="guide-section"><h2>{t.reference.what}</h2><p>{t.reference.whatText}</p><p>{t.reference.whatText2}</p></section>
        <section className="guide-section"><h2>{t.reference.start}</h2><pre className="reference-code">{`import { MediaCard } from '@coverkit/react';\n\n<MediaCard variant="standard" item={item} locale="${locale}" theme="light" />`}</pre><p>{t.reference.startText} <a href={hrefFor('docs',locale)} onClick={event=>navigate(event,'docs')}>{t.nav.docs}</a>.</p></section>
        <section className="guide-section"><h2>{t.reference.animation}</h2><pre className="reference-code">{t.guide.animationCode}</pre><p>{t.reference.animationText}</p></section>
        <section className="guide-section"><h2>{t.reference.included}</h2><div className="reference-variant-grid">{VARIANTS.map(variant=><article key={variant}><h3>{t.variants[variant].label}</h3><p>{t.variants[variant].description} {t.reference.recommended}: {t.variants[variant].use.toLowerCase()}.</p></article>)}</div></section>
        <section className="guide-section"><h2>{t.reference.access}</h2><p>{t.reference.accessText}</p></section>
      </main>}
    </div>
    {notice&&<div className="toast" role="status">{notice}</div>}
  </div>;
}
