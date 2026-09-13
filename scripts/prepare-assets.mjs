import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

// Raster exports are committed alongside their editable SVG sources. Copy them
// into the public build; never silently replace newer branding with embedded data.
const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const publicDir = resolve(rootDir, 'public');
mkdirSync(publicDir, { recursive: true });
for (const [name, width, height] of [['favicon-32.png', 32, 32], ['og-image.png', 1200, 630]]) {
  const source = resolve(rootDir, name);
  const bytes = readFileSync(source);
  if (bytes.toString('hex', 0, 8) !== '89504e470d0a1a0a' || bytes.readUInt32BE(16) !== width || bytes.readUInt32BE(20) !== height) {
    throw new Error(`Brand export ${name} must be a ${width} × ${height} PNG.`);
  }
  copyFileSync(source, resolve(publicDir, name));
}
