/// <reference types="vite/client" />
import {
  buildCardSvg,
  DesignContent,
  DesignFormat,
  DesignKey,
  DesignTheme,
} from './cardDesigns';

import frauncesUrl from '../assets/fonts/fraunces-latin.woff2?url';
import interUrl from '../assets/fonts/inter-latin.woff2?url';

/* ------------------------------------------------------------------ *
 * Card formats, themes and rasterisation.
 *
 * The fonts are self-hosted and embedded into the SVG as data URIs, so
 * a card renders identically everywhere — in the preview, in the saved
 * PNG, and with no network request. That is why the design can rely on
 * Fraunces rather than falling back to Georgia.
 * ------------------------------------------------------------------ */

export type CardFormat = DesignFormat['key'];
export type CardTheme = DesignTheme['key'];
export { DESIGNS } from './cardDesigns';
export type { DesignKey, DesignContent } from './cardDesigns';

export const CARD_FORMATS: DesignFormat[] = [
  { key: 'square', label: 'Square', note: 'Feed · 1:1', w: 1080, h: 1080 },
  { key: 'portrait', label: 'Portrait', note: 'Stories · 4:5', w: 1080, h: 1350 },
  { key: 'wide', label: 'Wide', note: 'Link preview · 1.91:1', w: 1200, h: 630 },
];

export const CARD_THEMES: DesignTheme[] = [
  { key: 'light', label: 'Paper', bg: '#fbfaf7', bg2: '#ffffff', ink: '#14120f', soft: '#403b34', muted: '#6f6a5f', line: '#e7e1d6', rule: '#d6cec0' },
  { key: 'sepia', label: 'Sepia', bg: '#f4ecdd', bg2: '#faf3e6', ink: '#2b2418', soft: '#4a4032', muted: '#7a6c58', line: '#e0d3ba', rule: '#cdbb98' },
  { key: 'dark', label: 'Night', bg: '#14120f', bg2: '#201d18', ink: '#fbfaf7', soft: '#ded7ca', muted: '#9a9184', line: '#332f28', rule: '#443e34' },
];

export const formatOf = (k: CardFormat): DesignFormat => CARD_FORMATS.find((f) => f.key === k) ?? CARD_FORMATS[0];
export const themeOf = (k: CardTheme): DesignTheme => CARD_THEMES.find((t) => t.key === k) ?? CARD_THEMES[0];

export const slugify = (s: string): string =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'card';

/* ---------------------------------------------------------------- fonts */

let fontCssCache: Promise<string> | null = null;

async function toBase64(url: string): Promise<string> {
  const res = await fetch(url);
  const bytes = new Uint8Array(await res.arrayBuffer());
  let bin = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    bin += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
  }
  return btoa(bin);
}

/** @font-face rules with the fonts inlined, so the SVG is self-contained. */
export function loadFontCss(): Promise<string> {
  if (!fontCssCache) {
    fontCssCache = (async () => {
      try {
        const [fraunces, inter] = await Promise.all([toBase64(frauncesUrl), toBase64(interUrl)]);
        return (
          `@font-face{font-family:'Fraunces';font-style:normal;font-weight:400 700;` +
          `src:url(data:font/woff2;base64,${fraunces}) format('woff2');}` +
          `@font-face{font-family:'Inter';font-style:normal;font-weight:400 700;` +
          `src:url(data:font/woff2;base64,${inter}) format('woff2');}`
        );
      } catch {
        return '';
      }
    })();
  }
  return fontCssCache;
}

/** Build the finished SVG markup for a card, fonts included. */
export async function buildCard(
  design: DesignKey,
  format: DesignFormat,
  theme: DesignTheme,
  content: DesignContent,
): Promise<string> {
  return buildCardSvg(design, format, theme, content, await loadFontCss());
}

/* ---------------------------------------------------------------- export */

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('svg load failed'));
    img.src = url;
  });
}

export async function svgToBlob(svg: string, format: DesignFormat, theme: DesignTheme, scale = 2): Promise<Blob> {
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
  try {
    const img = await loadImage(url);
    const canvas = document.createElement('canvas');
    canvas.width = format.w * scale;
    canvas.height = format.h * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('no 2d context');
    ctx.fillStyle = theme.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), 'image/png'),
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

function triggerDownload(href: string, filename: string) {
  const a = document.createElement('a');
  a.download = filename;
  a.href = href;
  a.click();
}

/** Save the card as a PNG. */
export async function downloadCard(svg: string, format: DesignFormat, theme: DesignTheme, filename: string): Promise<boolean> {
  try {
    const blob = await svgToBlob(svg, format, theme);
    const url = URL.createObjectURL(blob);
    triggerDownload(url, filename);
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
    return true;
  } catch {
    return false;
  }
}

/** Save the card as a true SVG file — the source, not a raster. */
export function downloadSvg(svg: string, filename: string): boolean {
  try {
    const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml;charset=utf-8' }));
    triggerDownload(url, filename);
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
    return true;
  } catch {
    return false;
  }
}

/** Share the PNG where the platform allows files, else fall back to a download. */
export async function shareCard(
  svg: string,
  format: DesignFormat,
  theme: DesignTheme,
  filename: string,
  title: string,
  text: string,
): Promise<'shared' | 'downloaded' | 'failed'> {
  try {
    const blob = await svgToBlob(svg, format, theme);
    const file = new File([blob], filename, { type: 'image/png' });
    const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
    if (nav.share && nav.canShare?.({ files: [file] })) {
      await nav.share({ files: [file], title, text });
      return 'shared';
    }
    const url = URL.createObjectURL(blob);
    triggerDownload(url, filename);
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
    return 'downloaded';
  } catch {
    return 'failed';
  }
}
