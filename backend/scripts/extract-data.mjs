// Reads the frontend's static data file (../data/products.ts), strips the
// TypeScript-only bits, and writes plain JSON the Prisma seed consumes.
// This keeps the backend decoupled from the Next.js path aliases.
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SOURCE = resolve(__dirname, '../../data/products.ts');
const OUT_DIR = resolve(__dirname, '../prisma/data');

async function main() {
  let src = await readFile(SOURCE, 'utf8');

  // Drop the `import { Product } from '@/store/useStore';` line and the
  // `: Product[]` type annotation so the remainder is valid ESM JavaScript.
  src = src
    .replace(/^\s*import\s+.*?from\s+['"].*?['"];?\s*$/gm, '')
    .replace(/:\s*Product\[\]/g, '');

  const tmpFile = join(tmpdir(), `luxecart-data-${Date.now()}.mjs`);
  await writeFile(tmpFile, src, 'utf8');

  try {
    const mod = await import(pathToFileURL(tmpFile).href);
    await mkdir(OUT_DIR, { recursive: true });

    const products = mod.products ?? [];
    const categories = mod.categories ?? [];

    await writeFile(join(OUT_DIR, 'products.json'), JSON.stringify(products, null, 2));
    await writeFile(join(OUT_DIR, 'categories.json'), JSON.stringify(categories, null, 2));

    console.log(`✓ Extracted ${products.length} products and ${categories.length} categories to prisma/data/`);
  } finally {
    await rm(tmpFile, { force: true });
  }
}

main().catch((err) => {
  console.error('Extraction failed:', err);
  process.exit(1);
});
