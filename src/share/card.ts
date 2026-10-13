import { toPng, toBlob } from 'html-to-image';

/* ------------------------------------------------------------------ *
 * Shareable cards
 *
 * Cards are rendered as real DOM at exact pixel dimensions, then
 * rasterised with html-to-image. All card colours are inline hex (never
 * CSS variables or Tailwind classes) so the captured image matches the
 * preview exactly and cannot be broken by theme tokens.
 * ------------------------------------------------------------------ */

export type CardFormat = 'square' | 'portrait' | 'wide';
export type CardTheme = 'light' | 'sepia' | 'dark';

export interface FormatSpec {
  key: CardFormat;
  label: string;
  note: string;
  w: number;
  h: number;
}

export const CARD_FORMATS: FormatSpec[] = [
  { key: 'square', label: 'Square', note: 'Feed · 1:1', w: 1080, h: 1080 },
  { key: 'portrait', label: 'Portrait', note: 'Stories · 4:5', w: 1080, h: 1350 },
  { key: 'wide', label: 'Wide', note: 'Link preview · 1.91:1', w: 1200, h: 630 },
];

export interface ThemeSpec {
  key: CardTheme;
  label: string;
  bg: string;
  ink: string;
  soft: string;
  muted: string;
  line: string;
}

export const CARD_THEMES: ThemeSpec[] = [
  { key: 'light', label: 'Paper', bg: '#fbfaf7', ink: '#14120f', soft: '#403b34', muted: '#6f6a5f', line: '#e7e1d6' },
  { key: 'sepia', label: 'Sepia', bg: '#f4ecdd', ink: '#2b2418', soft: '#4a4032', muted: '#7a6c58', line: '#e0d3ba' },
  { key: 'dark', label: 'Night', bg: '#14120f', ink: '#fbfaf7', soft: '#ded7ca', muted: '#9a9184', line: '#332f28' },
];

export const formatOf = (k: CardFormat): FormatSpec => CARD_FORMATS.find((f) => f.key === k) ?? CARD_FORMATS[0];
export const themeOf = (k: CardTheme): ThemeSpec => CARD_THEMES.find((t) => t.key === k) ?? CARD_THEMES[0];

export interface CardContent {
  /** Small label above the card body — the theme, collection or module. */
  eyebrow: string;
  /** Optional headline, used by fact and entry cards. */
  title?: string;
  /** The quote, finding summary or key insight. */
  body: string;
  /** Attribution line — author and source, evidence rating, read time. */
  meta?: string;
  /** Accent colour, normally the module or category hue. */
  accent: string;
}

export const slugify = (s: string): string =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 48) || 'card';

/** Rasterise a card node to a PNG data URL. */
export async function cardToPng(node: HTMLElement, theme: ThemeSpec, pixelRatio = 2): Promise<string> {
  return toPng(node, {
    backgroundColor: theme.bg,
    pixelRatio,
    cacheBust: true,
    width: node.offsetWidth,
    height: node.offsetHeight,
  });
}

export function triggerDownload(dataUrl: string, filename: string) {
  const a = document.createElement('a');
  a.download = filename;
  a.href = dataUrl;
  a.click();
}

/** Save the card as a PNG file. Returns true when the download started. */
export async function downloadCard(node: HTMLElement, theme: ThemeSpec, filename: string): Promise<boolean> {
  try {
    const url = await cardToPng(node, theme);
    triggerDownload(url, filename);
    return true;
  } catch {
    return false;
  }
}

/**
 * Share the card as an image file where the platform supports it
 * (mobile), and fall back to a download everywhere else.
 */
export async function shareCard(
  node: HTMLElement,
  theme: ThemeSpec,
  filename: string,
  title: string,
  text: string,
): Promise<'shared' | 'downloaded' | 'failed'> {
  try {
    const blob = await toBlob(node, { backgroundColor: theme.bg, pixelRatio: 2, cacheBust: true });
    if (!blob) throw new Error('no blob');
    const file = new File([blob], filename, { type: 'image/png' });
    const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean };
    if (nav.share && nav.canShare?.({ files: [file] })) {
      await nav.share({ files: [file], title, text });
      return 'shared';
    }
    triggerDownload(URL.createObjectURL(blob), filename);
    return 'downloaded';
  } catch {
    return 'failed';
  }
}
