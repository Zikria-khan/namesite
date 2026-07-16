import fs from 'node:fs';
import path from 'node:path';

const ogDir = path.join('node_modules', 'next', 'dist', 'compiled', '@vercel', 'og');
const targets = [
  {
    dest: path.join('.open-next', 'server-functions', 'default', '.next', 'server', 'chunks', 'ssr', 'code\\nameverse.open-nextserver-functionsdefault\\node_modules\\nextdistcompiled@vercelog\\resvg.wasm'),
    src: path.join(ogDir, 'resvg.wasm'),
  },
  {
    dest: path.join('.open-next', 'server-functions', 'default', '.next', 'server', 'chunks', 'code\\nameverse.open-nextserver-functionsdefault\\node_modules\\nextdistcompiled@vercelog\\resvg.wasm'),
    src: path.join(ogDir, 'resvg.wasm'),
  },
  {
    dest: path.join('.open-next', 'server-functions', 'default', '.next', 'server', 'chunks', 'ssr', 'code\\nameverse.open-nextserver-functionsdefault\\node_modules\\nextdistcompiled@vercelogyoga.wasm'),
    src: path.join(ogDir, 'yoga.wasm'),
  },
  {
    dest: path.join('.open-next', 'server-functions', 'default', '.next', 'server', 'chunks', 'code\\nameverse.open-nextserver-functionsdefault\\node_modules\\nextdistcompiled@vercelogyoga.wasm'),
    src: path.join(ogDir, 'yoga.wasm'),
  },
  {
    dest: path.join('.open-next', 'server-functions', 'default', 'node_modules', 'next', 'dist', 'compiled', '@vercel', 'og', 'Geist-Regular.ttf.bin'),
    src: path.join(ogDir, 'Geist-Regular.ttf'),
  },
];

let copied = false;
for (const target of targets) {
  if (fs.existsSync(target.dest)) {
    continue;
  }
  fs.mkdirSync(path.dirname(target.dest), { recursive: true });
  fs.copyFileSync(target.src, target.dest);
  copied = true;
}

if (copied) {
  console.log('Copied OG WASM/font assets to mangled Windows paths in .open-next');
} else {
  console.log('OG assets already present at mangled paths');
}
