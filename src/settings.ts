import { useState, useEffect } from 'react';

export type Theme = 'light' | 'sepia' | 'dark';

export interface Settings {
  theme: Theme;
  accent: string;
  /** Reading text size, in px. */
  fontSize: number;
  /** Reading column max width, in rem. */
  pageWidth: number;
  /** Highlight colour (hex). */
  highlight: string;
  /** Underline key lines and highlight key points while reading. */
  emphasis: boolean;
  /** Distraction-free reading: hides the masthead, footer and nav. */
  focusMode: boolean;
}

export const ACCENTS: { name: string; value: string }[] = [
  { name: 'Oxblood', value: '#b23a2a' },
  { name: 'Ink', value: '#14120f' },
  { name: 'Forest', value: '#1f4a3a' },
  { name: 'Indigo', value: '#2f3e8f' },
  { name: 'Amber', value: '#a4712a' },
  { name: 'Plum', value: '#6b2f5b' },
];

export const HIGHLIGHTS: { name: string; value: string }[] = [
  { name: 'Yellow', value: '#ffe680' },
  { name: 'Green', value: '#b8e6c4' },
  { name: 'Blue', value: '#bcdcff' },
  { name: 'Pink', value: '#ffc9de' },
  { name: 'Lilac', value: '#ded0ff' },
];

export const FONT_SIZES: { name: string; value: number }[] = [
  { name: 'S', value: 16 },
  { name: 'M', value: 19 },
  { name: 'L', value: 22 },
  { name: 'XL', value: 25 },
];

export const PAGE_WIDTHS: { name: string; value: number }[] = [
  { name: 'Narrow', value: 36 },
  { name: 'Medium', value: 44 },
  { name: 'Wide', value: 56 },
];

export const THEMES: { name: string; value: Theme }[] = [
  { name: 'Light', value: 'light' },
  { name: 'Sepia', value: 'sepia' },
  { name: 'Dark', value: 'dark' },
];

export const DEFAULT_SETTINGS: Settings = {
  theme: 'light',
  accent: '#b23a2a',
  fontSize: 19,
  pageWidth: 44,
  highlight: '#ffe680',
  emphasis: true,
  focusMode: false,
};

const KEY = 'mindtrace_settings';

/* ---- small hex helpers so the accent can drive its own shades ---- */
function clamp(n: number) { return Math.max(0, Math.min(255, Math.round(n))); }
function parse(hex: string) {
  const h = hex.replace('#', '');
  const f = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [parseInt(f.slice(0, 2), 16), parseInt(f.slice(2, 4), 16), parseInt(f.slice(4, 6), 16)];
}
function toHex(r: number, g: number, b: number) {
  return '#' + [r, g, b].map((v) => clamp(v).toString(16).padStart(2, '0')).join('');
}
/** mix toward black (amt<0) or white (amt>0), amt in -1..1 */
export function mix(hex: string, amt: number) {
  const [r, g, b] = parse(hex);
  const target = amt < 0 ? 0 : 255;
  const t = Math.abs(amt);
  return toHex(r + (target - r) * t, g + (target - g) * t, b + (target - b) * t);
}

function load(): Settings {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
  } catch {
    /* ignore */
  }
  return DEFAULT_SETTINGS;
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(settings));
    } catch {
      /* ignore */
    }
    const r = document.documentElement;
    r.dataset.theme = settings.theme;
    r.style.setProperty('--color-accent', settings.accent);
    r.style.setProperty('--color-accent-deep', mix(settings.accent, -0.22));
    r.style.setProperty('--color-accent-soft', mix(settings.accent, 0.86));
    r.style.setProperty('--reading-size', `${settings.fontSize}px`);
    r.style.setProperty('--reading-width', `${settings.pageWidth}rem`);
    r.style.setProperty('--hl', settings.highlight);
  }, [settings]);

  const update = (patch: Partial<Settings>) => setSettings((prev) => ({ ...prev, ...patch }));
  const reset = () => setSettings(DEFAULT_SETTINGS);

  return { settings, update, reset };
}
