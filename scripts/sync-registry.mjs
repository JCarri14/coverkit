#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const coreFiles=['media-card.tsx','media-card.types.ts','media-card.css','media-card.icons.tsx','media-card.language.tsx','media-card.locales.ts','media-card.utils.ts'];
const check=process.argv.includes('--check');
let stale=false;
for(const file of coreFiles){
  const original=readFileSync(resolve(root,'packages/media-card/src',file),'utf8');
  const target=resolve(root,'registry',file);
  if(check){if(!existsSync(target)||readFileSync(target,'utf8')!==original)stale=true;}
  else writeFileSync(target,original);
}
// The registry installs owned source files rather than a workspace package.
// Resolve @coverkit/react imports to its sibling registry files.
const animationSource=readFileSync(resolve(root,'packages/animated-media-card/src/animated-media-card.tsx'),'utf8');
const animatedForRegistry=animationSource
  .replace("import { MediaCard } from '@coverkit/react';", "import { MediaCard } from './media-card';")
  .replace("import type { MediaCardProps } from '@coverkit/react';", "import type { MediaCardProps } from './media-card.types';");
const animatedTarget=resolve(root,'registry/animated-media-card.tsx');
if(check){if(!existsSync(animatedTarget)||readFileSync(animatedTarget,'utf8')!==animatedForRegistry)stale=true;}
else writeFileSync(animatedTarget,animatedForRegistry);
if(check&&stale){console.error('Registry is out of sync. Run pnpm registry:sync');process.exitCode=1;}
else console.log(check?'Registry synchronized.':'Registry updated from package sources.');
