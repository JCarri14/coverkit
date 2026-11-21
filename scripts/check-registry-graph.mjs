#!/usr/bin/env node
import {readFileSync,existsSync} from 'node:fs';
import {join,resolve,dirname,extname,relative as relativePath,sep} from 'node:path';
const root=resolve(import.meta.dirname,'..');
const manifest=JSON.parse(readFileSync(join(root,'registry.json'),'utf8'));
const items=manifest.items||[];
for(const item of items){
  if(item.name==='media-card'&&!item.dependencies?.includes('lucide-react'))throw new Error('MediaCard must declare lucide-react');
  if(item.name==='animated-media-card'&&!item.dependencies?.includes('motion'))throw new Error('AnimatedMediaCard must declare motion');
  const declared=new Set(item.files.map(file=>file.path));
  for(const file of item.files){
    const filePath=join(root,file.path);
    if(!existsSync(filePath))throw new Error(`Missing registry file: ${file.path}`);
    if(!file.target?.startsWith('@ui/'))throw new Error(`Unexpected registry target: ${file.target}`);
    if(!['.ts','.tsx'].includes(extname(filePath)))continue;
    const source=readFileSync(filePath,'utf8');
    for(const match of source.matchAll(/(?:from\s+|import\s*)['"](\.\/[^'"]+)['"]/g)){
      const relative=match[1],dep=resolve(dirname(filePath),relative);
      const found=[dep,`${dep}.ts`,`${dep}.tsx`,`${dep}.css`].find(existsSync);
      if(!found)throw new Error(`${file.path}: missing import ${relative}`);
      const pathInRepo=relativePath(root,found).split(sep).join('/');
      if(!declared.has(pathInRepo))throw new Error(`${item.name}: undeclared import ${pathInRepo}`);
    }
  }
  console.log(`${item.name}: ${item.files.length} files and imports verified`);
}
if(items.length!==2)throw new Error(`Expected MediaCard and AnimatedMediaCard; got ${items.length}`);
