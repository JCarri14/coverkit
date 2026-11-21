import type { MediaItem, MediaKind, MediaEntry, MediaCountUnit } from '@coverkit/react';

/** Entirely fictional works and original local SVG artwork, with deliberately mixed media types. */
type SampleSpec = {
  id: string; title: string; creator: string; kind: MediaKind; unit: MediaCountUnit;
  total: number; rating: number | null; status: MediaItem['status']; code: string; region: string;
  entryPrefix?: 'Capítulo' | 'Episodio' | 'Número'; description?: string;
};
const source: SampleSpec[] = [
  { id:'orbit-of-ash', title:'Orbit of Ash', creator:'Mira Vale', kind:'manga', unit:'chapters', total:94, rating:8.6, status:'ongoing', code:'es', region:'ES', entryPrefix:'Capítulo' },
  { id:'velvet-eclipse', title:'Velvet Eclipse', creator:'Studio Nocturne', kind:'web-novel', unit:'chapters', total:48, rating:9.2, status:'ongoing', code:'en', region:'GB', entryPrefix:'Capítulo' },
  { id:'neon-orchard', title:'Neon Orchard', creator:'Aki Sora', kind:'manga', unit:'chapters', total:17, rating:8.3, status:'ongoing', code:'ja', region:'JP', entryPrefix:'Capítulo' },
  { id:'glass-ronin', title:'The Glass Ronin', creator:'K. Hase', kind:'comic', unit:'issues', total:24, rating:8.8, status:'completed', code:'en', region:'US', entryPrefix:'Número' },
  { id:'moonlit-signals', title:'Moonlit Signals', creator:'Hana Seo', kind:'series', unit:'episodes', total:18, rating:9.0, status:'ongoing', code:'ko', region:'KR', entryPrefix:'Episodio' },
  { id:'crimson-harbor', title:'Crimson Harbor', creator:'Atelier Forge', kind:'web-novel', unit:'chapters', total:308, rating:8.1, status:'ongoing', code:'es', region:'ES', entryPrefix:'Capítulo' },
  { id:'paper-kingdom', title:'Paper Kingdom', creator:'P. Liang', kind:'book', unit:'pages', total:420, rating:8.5, status:'completed', code:'en', region:'GB', description:'Una cartógrafa descubre que los mapas de su ciudad cambian cada noche.' },
  { id:'tide-of-starlight', title:'Tide of Starlight', creator:'Oren Blue', kind:'series', unit:'episodes', total:14, rating:9.4, status:'ongoing', code:'fr', region:'FR', entryPrefix:'Episodio' },
  { id:'northern-echoes', title:'Northern Echoes', creator:'Harper Moss', kind:'novel', unit:'pages', total:336, rating:8.7, status:'completed', code:'en', region:'US', description:'Una historia de secretos familiares ambientada en un pequeño pueblo del norte.' },
  { id:'bloom-circuit', title:'Bloom Circuit', creator:'Lina Koa', kind:'manga', unit:'chapters', total:9, rating:7.9, status:'ongoing', code:'es', region:'ES', entryPrefix:'Capítulo' },
  { id:'morrow-gate', title:'Morrow Gate', creator:'R. Kido', kind:'webtoon', unit:'chapters', total:145, rating:8.9, status:'ongoing', code:'ja', region:'JP', entryPrefix:'Capítulo' },
  { id:'last-cartographer', title:'The Last Cartographer of a Forgotten Kingdom', creator:'Studio Tides', kind:'book', unit:'pages', total:510, rating:null, status:'completed', code:'es', region:'ES', description:'Una exploradora recibe un atlas de un reino que nadie recuerda.' },
];
function entryLabel(s: SampleSpec, n: number): string {
  if(s.kind==='series') return `T${n > 10 ? '2' : '1'} · E${String(n > 10 ? n-10 : n).padStart(2,'0')}`;
  if(s.kind==='comic') return `N.º ${n}`;
  return `${s.entryPrefix ?? 'Capítulo'} ${n}`;
}
export const samples: MediaItem[] = source.map((s, idx) => {
  const entries: MediaEntry[] | undefined = s.entryPrefix
    ? Array.from({length: Math.min(3,s.total)},(_,i)=>({
        id:`${s.id}-${s.total-i}`,label:entryLabel(s,s.total-i),number:s.total-i,
        publishedLabel:i===0?'hace 7 h':i===1?'hace 4 días':'hace 1 semana',isNew:i===0&&idx%3===0,
      })) : undefined;
  return {
    id:s.id,title:s.title,kind:s.kind,cover:{src:`${import.meta.env.BASE_URL}covers/${s.id}.svg`,alt:`Portada ilustrada original de ${s.title}`},
    language:{code:s.code,region:s.region},
    creators:[{id:s.creator.toLowerCase().replaceAll(' ','-'),name:s.creator,role:s.creator.startsWith('Studio')||s.creator.startsWith('Atelier')?'studio':'author'}],
    status:s.status,rating:s.rating===null?undefined:{value:s.rating,max:10,votes:idx*123+90},
    count:{value:s.total,unit:s.unit},latestEntries:entries,description:s.description,
    progress:{current:Math.max(0,s.total-5),total:s.total,label:s.unit==='episodes'?'Episodios vistos':s.unit==='pages'?'Páginas leídas':'Contenido leído'},
  };
});
export const scenarios: Record<string,MediaItem> = {
  normal:samples[0],
  long:samples[11],
  many:samples[5],
  short:{...samples[4],count:{value:1,unit:'episodes'},latestEntries:[{id:'one',label:'T1 · E01',isNew:true,publishedLabel:'hoy'}]},
  book:samples[6],
  series:samples[4],
  comic:samples[3],
  webnovel:samples[1],
  noRating:samples[11],
  empty:{...samples[2],id:'no-cover',cover:undefined,rating:undefined,count:undefined,latestEntries:undefined,creators:undefined},
};
export const KIND_LABELS: Partial<Record<MediaKind,string>> = {
  manga:'Manga',manhwa:'Manhwa',manhua:'Manhua',webtoon:'Webtoon', 'web-novel':'Novela web',novel:'Novela',book:'Libro',comic:'Cómic',series:'Serie',other:'Otro',
};
