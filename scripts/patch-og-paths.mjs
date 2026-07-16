import fs from 'node:fs';
import path from 'node:path';

const handlerPath = path.join('.open-next', 'server-functions', 'default', 'handler.mjs');
const content = fs.readFileSync(handlerPath, 'utf8');

const replacements = [
  [/C:\/code\/nameverse\/\.open-next\/server-functions\/default\/node_modules\/next\/dist\/compiled\/@vercel\/og\/resvg\.wasm\?module/g, './node_modules/next/dist/compiled/@vercel/og/resvg.wasm?module'],
  [/C:\/code\/nameverse\/\.open-next\/server-functions\/default\/node_modules\/next\/dist\/compiled\/@vercel\/og\/yoga\.wasm\?module/g, './node_modules/next/dist/compiled/@vercel/og/yoga.wasm?module'],
  [/C:\/code\/nameverse\/\.open-next\/server-functions\/default\/node_modules\/next\/dist\/compiled\/@vercel\/og\/Geist-Regular\.ttf\.bin/g, './node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf.bin'],
  [/C:\/code\/nameverse\/\.open-next\/server-functions\/default\/\.next\/server\/chunks\/ssr\/code\\nameverse\.open-nextserver-functionsdefault\\node_modules\\nextdistcompiled@vercelog\\resvg\.wasm/g, './node_modules/next/dist/compiled/@vercel/og/resvg.wasm'],
  [/C:\/code\/nameverse\/\.open-next\/server-functions\/default\/\.next\/server\/chunks\/code\\nameverse\.open-nextserver-functionsdefault\\node_modules\\nextdistcompiled@vercelog\\resvg\.wasm/g, './node_modules/next/dist/compiled/@vercel/og/resvg.wasm'],
  [/C:\/code\/nameverse\/\.open-next\/server-functions\/default\/\.next\/server\/chunks\/ssr\/code\\nameverse\.open-nextserver-functionsdefault\\node_modules\\nextdistcompiled@vercelogyoga\.wasm/g, './node_modules/next/dist/compiled/@vercel/og/yoga.wasm'],
  [/C:\/code\/nameverse\/\.open-next\/server-functions\/default\/\.next\/server\/chunks\/code\\nameverse\.open-nextserver-functionsdefault\\node_modules\\nextdistcompiled@vercelogyoga\.wasm/g, './node_modules/next/dist/compiled/@vercel/og/yoga.wasm'],
];

let patched = false;
for (const [from, to] of replacements) {
  const next = content.replace(from, to);
  if (next !== content) {
    patched = true;
  }
  content = next;
}

if (patched) {
  fs.writeFileSync(handlerPath, content);
  console.log('Patched Windows-specific OG paths in .open-next/server-functions/default/handler.mjs');
} else {
  console.log('No OG path patches needed');
}
