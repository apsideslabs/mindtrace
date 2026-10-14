/**
 * Build-time Open Graph card.
 *
 * MindTrace is a single-page app with one URL, so there is exactly one
 * social card to make — and it is the first thing anyone sees when the
 * link is shared. It is therefore rendered from the same design system
 * as the in-app share cards rather than dropped in as a stock banner:
 * paper ground, film grain, accent spotlight, orbital arcs, Fraunces
 * and Inter.
 *
 * Pipeline: cardDesigns.ts (the exact SVG the share cards use) is
 * bundled with esbuild, rendered to SVG, and rasterised by resvg.
 * resvg is what makes this possible without a browser, and because it
 * implements feTurbulence and feColorMatrix the card keeps its grain
 * instead of flattening to a plain gradient.
 *
 * Fonts: resvg cannot decompress woff2, and the in-app card embeds its
 * fonts as woff2 data URIs. So the SVG is built with no @font-face and
 * resvg is handed static, subsetted TTFs from scripts/og/fonts instead.
 * Those are build-time only — they are never shipped to the browser.
 *
 * Output is JPEG, not PNG. The grain is per-pixel noise, which is
 * exactly what PNG cannot compress: the same card is 1028 KB as PNG and
 * 124 KB as JPEG at q92, with no visible difference at the size a link
 * preview is actually shown. Every platform accepts JPEG for og:image.
 */
import { build } from 'esbuild';
import { Resvg } from '@resvg/resvg-js';
import { PNG } from 'pngjs';
import jpeg from 'jpeg-js';
import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

const WIDE = { key: 'wide', label: 'Wide', note: 'Link preview · 1.91:1', w: 1200, h: 630 };
const PAPER = {
  key: 'light',
  label: 'Paper',
  bg: '#fbfaf7',
  bg2: '#ffffff',
  ink: '#14120f',
  soft: '#403b34',
  muted: '#6f6a5f',
  line: '#e7e1d6',
  rule: '#d6cec0',
};

/**
 * The card's words. Kept here rather than read from the app because the
 * app's content module uses Vite's import.meta.glob and cannot be
 * imported by plain Node. If these numbers change, update them here —
 * they are the same figures quoted in index.html's meta description.
 */
const CONTENT = {
  eyebrow: 'A Reading Library',
  title: 'MindTrace',
  body: 'Psychology, relationships and human behaviour — 262 entries across 14 modules, with a 980-fact sourced research library.',
  source: 'Understand people. Understand yourself.',
  accent: '#b23a2a',
};

const OUT_DIR = join(root, 'public', 'og');
const OUT_FILE = join(OUT_DIR, 'mindtrace-og.jpg');
const BUNDLE = join(root, 'node_modules', '.cache', 'mindtrace-og', 'cardDesigns.mjs');

async function loadCardBuilder() {
  mkdirSync(dirname(BUNDLE), { recursive: true });
  await build({
    entryPoints: [join(root, 'src', 'share', 'cardDesigns.ts')],
    bundle: true,
    format: 'esm',
    outfile: BUNDLE,
    logLevel: 'warning',
  });
  const mod = await import(pathToFileURL(BUNDLE).href);
  return mod.buildCardSvg;
}

async function main() {
  const buildCardSvg = await loadCardBuilder();

  // No font CSS: resvg supplies the fonts by family name.
  const svg = buildCardSvg('index', WIDE, PAPER, CONTENT, '');

  const fontFiles = ['fraunces-600.ttf', 'inter-400.ttf', 'inter-600.ttf'].map((f) =>
    join(here, 'og', 'fonts', f),
  );

  const resvg = new Resvg(svg, {
    font: { fontFiles, loadSystemFonts: false, defaultFontFamily: 'Inter' },
    fitTo: { mode: 'width', value: WIDE.w },
  });
  const png = resvg.render().asPng();

  // PNG -> raw RGBA -> JPEG.
  const rgba = PNG.sync.read(Buffer.from(png));
  const out = jpeg.encode({ data: rgba.data, width: rgba.width, height: rgba.height }, 92).data;

  mkdirSync(OUT_DIR, { recursive: true });
  writeFileSync(OUT_FILE, out);
  console.log(`og: wrote public/og/mindtrace-og.jpg — ${WIDE.w}×${WIDE.h}, ${(out.length / 1024).toFixed(0)} KB`);
}

main().catch((err) => {
  console.error('og: generation failed —', err && err.message ? err.message : err);
  process.exit(1);
});
