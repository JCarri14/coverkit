import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const expected = new Map([
  ['apps/web', '@coverkit/web'],
  ['apps/consumer-test', '@coverkit/consumer-test'],
  ['packages/media-card', '@coverkit/react'],
  ['packages/animated-media-card', '@coverkit/animated'],
]);
const workspaceYaml = readFileSync(resolve(root, 'pnpm-workspace.yaml'), 'utf8');
const names = new Map();
let failed = false;

for (const [folder, expectedName] of expected) {
  const manifest = resolve(root, folder, 'package.json');
  if (!existsSync(manifest)) {
    console.error(`✗ Missing ${folder}/package.json: check that the whole ZIP was extracted`);
    failed = true;
    continue;
  }
  const pkg = JSON.parse(readFileSync(manifest, 'utf8'));
  if (pkg.name !== expectedName) {
    console.error(`✗ Expected ${expectedName} in ${folder}/package.json, got ${pkg.name}`);
    failed = true;
  } else {
    console.log(`✓ ${pkg.name} (${folder})`);
  }
  if (!workspaceYaml.includes(folder)) {
    console.error(`✗ ${folder} is not listed in pnpm-workspace.yaml`);
    failed = true;
  }
  names.set(pkg.name, { folder, pkg });
}
for (const { folder, pkg } of names.values()) {
  for (const section of ['dependencies', 'devDependencies', 'optionalDependencies']) {
    for (const [name, version] of Object.entries(pkg[section] || {})) {
      if (typeof version === 'string' && version.startsWith('workspace:') && !names.has(name)) {
        console.error(`✗ ${folder} references ${name}@${version} but no workspace package declares it`);
        failed = true;
      }
    }
  }
}
if (failed) process.exit(1);
console.log('Workspace manifests and local dependency names are consistent.');
