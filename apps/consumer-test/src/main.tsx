import { createRoot } from 'react-dom/client';
import { MediaCard } from '@coverkit/react';
import { AnimatedMediaCard } from '@coverkit/animated';
import type { MediaItem } from '@coverkit/react';
const item: MediaItem = { id:'smoke',kind:'series',title:'Consumer smoke test',language:{code:'es',region:'ES'},count:{value:6,unit:'episodes'},latestEntries:[{id:'e6',label:'T1 · E06'}],creators:[{id:'a',name:'Example Creator'}] };
createRoot(document.getElementById('root')!).render(<main style={{maxWidth:440,margin:'60px auto'}}><h1>Independent consumer test</h1><MediaCard item={item} variant="detailed" theme="dark" locale="en"/><div style={{marginTop:30}}><AnimatedMediaCard item={item} variant="compact" animation="fade-up" trigger="mount" locale="es"/></div></main>);
