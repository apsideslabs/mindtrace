/* ------------------------------------------------------------------ *
 * Card designs
 *
 * Cards are composed as hand-built SVG rather than styled DOM: the
 * layout is exact at every output size, the ornament is real vector
 * geometry, and the same markup both previews and exports.
 *
 * Visual language: an orbital "apsis" motif (the mark is concentric
 * rings around a centre), fine editorial rules, Fraunces for display
 * and Inter for detail, on warm paper.
 *
 * Layout rule: every design computes a content band between its header
 * and footer and centres the block inside it, so a short quote and a
 * long one both sit balanced rather than clinging to the top.
 * ------------------------------------------------------------------ */

export interface DesignTheme {
  key: string;
  label: string;
  bg: string;
  bg2: string;
  ink: string;
  soft: string;
  muted: string;
  line: string;
  rule: string;
}

export interface DesignFormat {
  key: string;
  label: string;
  note: string;
  w: number;
  h: number;
}

export interface DesignContent {
  eyebrow: string;
  title?: string;
  body: string;
  meta?: string;
  source?: string;
  accent: string;
  /** 0-5, drawn as filled orbital rings on the fact design. */
  level?: number;
}

export type DesignKey = 'plate' | 'orbit' | 'index';

const SERIF = "'Fraunces', Georgia, serif";
const SANS = "'Inter', system-ui, sans-serif";

/* ---------------------------------------------------------------- utils */

export const esc = (s: string): string =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

let _ctx: CanvasRenderingContext2D | null = null;
function ctx(): CanvasRenderingContext2D | null {
  if (_ctx) return _ctx;
  if (typeof document === 'undefined') return null;
  _ctx = document.createElement('canvas').getContext('2d');
  return _ctx;
}

/** Width of a string in a given CSS font, measured in the browser. */
export function textWidth(text: string, font: string): number {
  const c = ctx();
  if (!c) return text.length * 0.5 * parseFloat(font.match(/(\d+(?:\.\d+)?)px/)?.[1] ?? '16');
  c.font = font;
  return c.measureText(text).width;
}

/** Greedy word wrap to a pixel width, with an ellipsis if it overruns. */
export function wrap(text: string, font: string, maxWidth: number, maxLines = 99): string[] {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  let consumed = 0;
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (textWidth(next, font) <= maxWidth || !line) {
      line = next;
      consumed += 1;
    } else {
      lines.push(line);
      line = word;
      if (lines.length === maxLines) break;
    }
  }
  if (line && lines.length < maxLines) {
    lines.push(line);
    consumed += 1;
  }
  if (lines.length >= maxLines && consumed < words.length) {
    let last = lines[maxLines - 1];
    while (textWidth(`${last}…`, font) > maxWidth && last.includes(' ')) last = last.slice(0, last.lastIndexOf(' '));
    lines[maxLines - 1] = `${last}…`;
  }
  return lines;
}

/**
 * Largest display size at which the text fills the target share of the
 * band. This is what stops a two-line quote from floating as a small
 * paragraph in the middle of a card: the type scales to the space.
 */
export function fitSize(
  text: string,
  fontAt: (size: number) => string,
  maxWidth: number,
  maxLines: number,
  bandH: number,
  target: number,
  min: number,
  max: number,
  lhFactor: number,
): { size: number; lines: string[] } {
  let best = { size: min, lines: wrap(text, fontAt(min), maxWidth, maxLines) };
  for (let s = max; s >= min; s -= 2) {
    const lines = wrap(text, fontAt(s), maxWidth, maxLines);
    if (lines.length * s * lhFactor <= bandH * target) return { size: s, lines };
    best = { size: s, lines };
  }
  return best;
}

/** Blend one hex colour toward another — used to lift accents off dark grounds. */
export function shift(hex: string, to: string, amt: number): string {
  const parse = (h: string): number[] => {
    const s = h.replace('#', '');
    const n = s.length === 3 ? s.split('').map((c) => c + c).join('') : s;
    return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16));
  };
  const [r1, g1, b1] = parse(hex);
  const [r2, g2, b2] = parse(to);
  const f = (a: number, b: number) => Math.round(a + (b - a) * amt).toString(16).padStart(2, '0');
  return `#${f(r1, r2)}${f(g1, g2)}${f(b1, b2)}`;
}

export function textBlock(lines: string[], x: number, firstBaseline: number, lineHeight: number, attrs: string): string {
  return lines
    .map((l, i) => `<text x="${x}" y="${Math.round(firstBaseline + i * lineHeight)}" ${attrs}>${esc(l)}</text>`)
    .join('');
}

/** The orbital motif: concentric circles around a point. */
export function orbit(
  cx: number,
  cy: number,
  radii: number[],
  colour: string,
  opacities: number[],
  width = 2,
  dash?: string,
): string {
  return radii
    .map(
      (r, i) =>
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${colour}" stroke-opacity="${
          opacities[i] ?? 0.08
        }" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`,
    )
    .join('');
}

export function mark(size: number, accent: string, ink: string, x = 0, y = 0): string {
  const s = size / 64;
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <circle cx="32" cy="32" r="29" fill="none" stroke="${ink}" stroke-opacity="0.22" stroke-width="2.5"/>
    <circle cx="32" cy="32" r="13" fill="none" stroke="${accent}" stroke-width="3"/>
    <circle cx="32" cy="32" r="3.6" fill="${ink}"/>
  </g>`;
}

/** "MindTrace" wordmark with the accent on the second half. */
export function wordmark(x: number, y: number, size: number, accent: string, ink: string, anchor = 'start'): string {
  const a = anchor === 'end' ? ' text-anchor="end"' : anchor === 'middle' ? ' text-anchor="middle"' : '';
  return (
    `<text x="${x}" y="${y}" font-family="${SERIF}" font-size="${size}" font-weight="600" ` +
    `letter-spacing="-0.4" fill="${ink}"${a}>Mind<tspan fill="${accent}">Trace</tspan></text>`
  );
}

const lum = (hex: string): number => {
  const h = hex.replace('#', '');
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const isDark = (t: DesignTheme): boolean => lum(t.bg) < 0.5;

/**
 * Ground for a card. Flat colour is what makes generated cards look cheap,
 * so the surface is built in four passes: a diagonal wash, an accent
 * spotlight, a vignette for depth, and a fine film grain over the top.
 * The grain is an feTurbulence filter desaturated to grey — it is what
 * makes the gradient read as printed paper rather than as a CSS fill, and
 * it also dissolves the banding that large soft gradients otherwise show.
 */
function background(f: DesignFormat, t: DesignTheme, id: string, accent: string): string {
  const dark = isDark(t);
  const sx = f.w * 0.78;
  const sy = f.h * 0.06;
  const sr = Math.max(f.w, f.h) * 0.72;
  return `<defs>
      <linearGradient id="wash-${id}" x1="0" y1="0" x2="0.75" y2="1">
        <stop offset="0%" stop-color="${t.bg2}"/>
        <stop offset="58%" stop-color="${t.bg}"/>
        <stop offset="100%" stop-color="${t.bg}"/>
      </linearGradient>
      <radialGradient id="spot-${id}" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="${accent}" stop-opacity="${dark ? 0.34 : 0.16}"/>
        <stop offset="55%" stop-color="${accent}" stop-opacity="${dark ? 0.12 : 0.05}"/>
        <stop offset="100%" stop-color="${accent}" stop-opacity="0"/>
      </radialGradient>
      <radialGradient id="vig-${id}" cx="46%" cy="42%" r="78%">
        <stop offset="48%" stop-color="#000000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="${dark ? 0.38 : 0.07}"/>
      </radialGradient>
      <filter id="grain-${id}" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
        <feTurbulence type="fractalNoise" baseFrequency="0.86" numOctaves="3" stitchTiles="stitch"/>
        <feColorMatrix type="saturate" values="0"/>
      </filter>
    </defs>
    <rect width="${f.w}" height="${f.h}" fill="url(#wash-${id})"/>
    <ellipse cx="${sx.toFixed(0)}" cy="${sy.toFixed(0)}" rx="${sr.toFixed(0)}" ry="${sr.toFixed(0)}" fill="url(#spot-${id})"/>
    <rect width="${f.w}" height="${f.h}" fill="url(#vig-${id})"/>
    <rect width="${f.w}" height="${f.h}" filter="url(#grain-${id})" opacity="${dark ? 0.18 : 0.11}"/>`;
}

/** A partial accent arc — the apsis sweep, drawn with a dash pattern. */
function apsis(cx: number, cy: number, r: number, accent: string, fraction: number, width: number, opacity: number, rotate = 0): string {
  const c = 2 * Math.PI * r;
  return `<circle cx="${cx.toFixed(0)}" cy="${cy.toFixed(0)}" r="${r.toFixed(0)}" fill="none" stroke="${accent}" stroke-opacity="${opacity}" stroke-width="${width}" stroke-linecap="round" stroke-dasharray="${(c * fraction).toFixed(1)} ${c.toFixed(1)}" transform="rotate(${rotate} ${cx.toFixed(0)} ${cy.toFixed(0)})"/>`;
}

const PAD = (f: DesignFormat) => (f.w === 1200 ? 72 : 96);

/* ---------------------------------------------------------------- 1. Plate — framed editorial, for quotes */

function plate(f: DesignFormat, t: DesignTheme, c: DesignContent): string {
  const pad = PAD(f);
  const wide = f.key === 'wide';
  const footLineY = f.h - pad - (wide ? 62 : 88);
  const metaY = footLineY + (wide ? 32 : 36);
  const srcY = metaY + (wide ? 22 : 26);

  // The eyebrow travels with the quote, so the header never floats away
  // from the content and the remaining whitespace reads as intentional.
  const headerH = wide ? 54 : 70;
  const bandTop = pad + (wide ? 34 : 48);
  const bandBottom = footLineY - (wide ? 34 : 50);
  const bandH = bandBottom - bandTop - headerH;

  // The quote sets to the space it has: a two-line line sets large and
  // fills the card, a long one steps down. Sized before anything else is
  // positioned, because everything else hangs off it.
  const fit = fitSize(c.body, (s) => `600 ${s}px ${SERIF}`, f.w - pad * 2 - 56, wide ? 4 : 8, bandH, 0.62, wide ? 30 : 38, wide ? 60 : 108, 1.32);
  const size = fit.size;
  const lines = fit.lines;
  const lh = size * 1.32;

  const blockH = lines.length * lh;
  const groupH = headerH + blockH;
  const groupTop = bandTop + Math.max(0, (bandBottom - bandTop - groupH) / 2);
  const eyebrowY = groupTop + (wide ? 22 : 28);
  const ruleY = eyebrowY - (wide ? 26 : 32);
  const first = groupTop + headerH + size * 0.82;

  // Typographic quotes on the text itself rather than a decorative mark,
  // which collided with the eyebrow on short cards.
  const quoted = lines.map((l, i) => (i === 0 ? `\u201C${l}` : l));
  if (quoted.length) quoted[quoted.length - 1] = `${quoted[quoted.length - 1]}\u201D`;

  return `
  ${background(f, t, 'plate', c.accent)}
  ${orbit(f.w + 30, -50, [300, 430, 560], c.accent, [0.1, 0.07, 0.045], 2)}
  ${apsis(f.w + 30, -50, 430, c.accent, 0.3, 3, 0.5, 142)}
  ${orbit(f.w + 30, -50, [560], c.accent, [0.05], 1.4, '2 10')}
  <rect x="${pad}" y="${pad}" width="${f.w - pad * 2}" height="${f.h - pad * 2}" fill="none" stroke="${t.rule}" stroke-width="1.4"/>
  <rect x="${pad + 14}" y="${pad + 14}" width="${f.w - (pad + 14) * 2}" height="${f.h - (pad + 14) * 2}" fill="none" stroke="${t.line}" stroke-width="0.9"/>

  <rect x="${pad + 44}" y="${ruleY}" width="${wide ? 40 : 48}" height="3" fill="${c.accent}"/>
  <text x="${pad + 44}" y="${eyebrowY}" font-family="${SANS}" font-size="${wide ? 17 : 20}" font-weight="600" letter-spacing="${wide ? 3 : 3.6}" fill="${c.accent}">${esc(c.eyebrow.toUpperCase())}</text>

  ${textBlock(quoted, pad + 44, first, lh, `font-family="${SERIF}" font-size="${size}" font-weight="600" letter-spacing="-0.7" fill="${t.ink}"`)}

  <line x1="${pad + 44}" y1="${footLineY}" x2="${f.w - pad - 44}" y2="${footLineY}" stroke="${t.line}" stroke-width="1"/>
  <text x="${pad + 44}" y="${metaY}" font-family="${SANS}" font-size="${wide ? 17 : 20}" font-weight="600" fill="${t.ink}">${esc(c.meta ?? '')}</text>
  ${c.source ? `<text x="${pad + 44}" y="${srcY}" font-family="${SANS}" font-size="${wide ? 15 : 18}" fill="${t.muted}">${esc(c.source)}</text>` : ''}
  ${mark(wide ? 30 : 36, c.accent, t.ink, f.w - pad - 44 - (wide ? 150 : 172), metaY - 32)}
  ${wordmark(f.w - pad - 44, metaY, wide ? 21 : 25, c.accent, t.ink, 'end')}
  `;
}

/* ---------------------------------------------------------------- 2. Orbit — evidence as rings, for facts */

function orbitDesign(f: DesignFormat, t: DesignTheme, c: DesignContent): string {
  const pad = PAD(f);
  const wide = f.key === 'wide';
  const tSize = wide ? 44 : 56;
  const bSize = wide ? 20 : 25;
  const tFont = `600 ${tSize}px ${SERIF}`;
  const bFont = `400 ${bSize}px ${SANS}`;
  const tLH = tSize * 1.14;
  const bLH = bSize * 1.62;
  const gap = wide ? 24 : 34;

  const titleLines = wrap(c.title ?? '', tFont, f.w - pad * 2 - (wide ? 250 : 0), 4);
  const bodyLines = wrap(c.body, bFont, f.w - pad * 2 - (wide ? 250 : 0), wide ? 4 : 8);

  const eyebrowY = wide ? 96 : 138;
  const footLineY = f.h - pad - 58;
  const ringCx = wide ? f.w - pad - 70 : f.w / 2;

  // The evidence rings belong to the finding, so the block and the rings
  // are centred together rather than the rings floating near the footer.
  const dark = isDark(t);
  const ringAccent = dark ? shift(c.accent, '#ffffff', 0.34) : c.accent;
  const ringLine = dark ? shift(t.line, '#ffffff', 0.22) : t.line;
  const ringR = wide ? 84 : 124;
  const ringGap = wide ? 52 : 74;
  const blockH = titleLines.length * tLH + gap + bodyLines.length * bLH;
  const groupH = blockH + ringGap + ringR * 2;
  const bandTop = eyebrowY + (wide ? 44 : 62);
  const bandBottom = footLineY - (wide ? 30 : 40);
  const groupTop = bandTop + Math.max(0, (bandBottom - bandTop - groupH) / 2);
  const tFirst = groupTop + tSize * 0.82;
  const bFirst = tFirst + (titleLines.length - 1) * tLH + gap + bSize * 0.82;
  const ringCy = groupTop + blockH + ringGap + ringR;

  const level = Math.max(0, Math.min(5, c.level ?? 0));
  const rings = [0.25, 0.44, 0.63, 0.82, 1]
    .map(
      (k, i) =>
        `<circle cx="${ringCx}" cy="${ringCy}" r="${(ringR * k).toFixed(1)}" fill="none" stroke="${i < level ? ringAccent : ringLine}" stroke-width="${i < level ? 4.6 : 2.2}" stroke-opacity="${i < level ? 1 : 0.9}"/>`,
    )
    .join('');
  const ringLabel = `<text x="${ringCx}" y="${ringCy + (wide ? 5 : 7)}" text-anchor="middle" font-family="${SANS}" font-size="${wide ? 17 : 22}" font-weight="600" letter-spacing="1" fill="${dark ? t.soft : t.muted}">${level}/5</text>`;

  return `
  ${background(f, t, 'orbit', c.accent)}
  ${orbit(-40, f.h + 40, [240, 340, 440], c.accent, [0.07, 0.05, 0.03], 2)}
  ${apsis(-40, f.h + 40, 340, c.accent, 0.28, 3, 0.45, -58)}
  <rect x="0" y="0" width="${f.w}" height="${wide ? 8 : 10}" fill="${c.accent}"/>

  <text x="${pad}" y="${eyebrowY}" font-family="${SANS}" font-size="${wide ? 17 : 20}" font-weight="600" letter-spacing="${wide ? 3 : 3.6}" fill="${c.accent}">${esc(c.eyebrow.toUpperCase())}</text>
  <text x="${f.w - pad}" y="${eyebrowY}" text-anchor="end" font-family="${SANS}" font-size="${wide ? 15 : 18}" letter-spacing="1.6" fill="${t.muted}">${esc((c.meta ?? '').toUpperCase())}</text>

  ${textBlock(titleLines, pad, tFirst, tLH, `font-family="${SERIF}" font-size="${tSize}" font-weight="600" letter-spacing="-0.8" fill="${t.ink}"`)}
  ${textBlock(bodyLines, pad, bFirst, bLH, `font-family="${SANS}" font-size="${bSize}" fill="${t.soft}"`)}

  <g>${rings}${ringLabel}</g>

  <line x1="${pad}" y1="${footLineY}" x2="${f.w - pad}" y2="${footLineY}" stroke="${t.line}" stroke-width="1"/>
  ${c.source ? `<text x="${pad}" y="${footLineY + 30}" font-family="${SANS}" font-size="${wide ? 15 : 18}" fill="${t.muted}">${esc(c.source)}</text>` : ''}
  ${mark(wide ? 30 : 34, c.accent, t.ink, f.w - pad - (wide ? 148 : 166), footLineY + 2)}
  ${wordmark(f.w - pad, footLineY + 34, wide ? 21 : 24, c.accent, t.ink, 'end')}
  `;
}

/* ---------------------------------------------------------------- 3. Index — typographic, for entries */

function indexDesign(f: DesignFormat, t: DesignTheme, c: DesignContent): string {
  const pad = PAD(f);
  const wide = f.key === 'wide';
  const bSize = wide ? 20 : 26;
  const bFont = `400 ${bSize}px ${SANS}`;
  const bLH = bSize * 1.6;
  const gap = wide ? 22 : 32;
  const indent = wide ? 30 : 40;
  const maxW = f.w - pad * 2 - indent - 20;

  const footLineY = f.h - pad - 58;
  const headerH = wide ? 54 : 76;
  const bandTop = pad + (wide ? 40 : 62);
  const bandBottom = footLineY - (wide ? 34 : 48);

  // The title takes whatever the body and the gaps leave, so a short
  // entry name sets big instead of sitting lost at the top of the card.
  const bodyLines = wrap(c.body, bFont, maxW, wide ? 4 : 8);
  const bodyH = bodyLines.length * bLH;
  const titleBand = Math.max(130, bandBottom - bandTop - headerH - bodyH - gap);
  const fit = fitSize(c.title ?? c.body, (s) => `600 ${s}px ${SERIF}`, maxW, 4, titleBand, 0.92, wide ? 34 : 46, wide ? 74 : 132, 1.12);
  const tSize = fit.size;
  const titleLines = fit.lines;
  const tLH = tSize * 1.12;

  const blockH = titleLines.length * tLH + gap + bodyH;
  const groupH = headerH + blockH;
  const groupTop = bandTop + Math.max(0, (bandBottom - bandTop - groupH) / 2);
  const eyebrowY = groupTop + (wide ? 22 : 28);
  const topRuleY = Math.max(pad + 4, groupTop - (wide ? 56 : 80));
  const tFirst = groupTop + headerH + tSize * 0.82;
  const bFirst = tFirst + (titleLines.length - 1) * tLH + gap + bSize * 0.82;

  return `
  ${background(f, t, 'index', c.accent)}
  ${orbit(f.w - 40, f.h + 90, [320, 470, 620], c.accent, [0.075, 0.05, 0.032], 2)}
  ${orbit(f.w - 40, f.h + 90, [620], c.accent, [0.04], 1.4, '3 12')}
  ${apsis(f.w - 40, f.h + 90, 470, c.accent, 0.24, 3, 0.5, -42)}
  <rect x="${pad}" y="${topRuleY}" width="${f.w - pad * 2}" height="1" fill="${t.line}"/>
  <rect x="${pad}" y="${Math.round(groupTop - 14)}" width="5" height="${Math.round(blockH + 30)}" fill="${c.accent}"/>

  <text x="${pad + indent}" y="${eyebrowY}" font-family="${SANS}" font-size="${wide ? 17 : 20}" font-weight="600" letter-spacing="${wide ? 3 : 3.6}" fill="${c.accent}">${esc(c.eyebrow.toUpperCase())}</text>
  ${textBlock(titleLines, pad + indent, tFirst, tLH, `font-family="${SERIF}" font-size="${tSize}" font-weight="600" letter-spacing="-1" fill="${t.ink}"`)}
  ${textBlock(bodyLines, pad + indent, bFirst, bLH, `font-family="${SANS}" font-size="${bSize}" fill="${t.soft}"`)}

  <line x1="${pad}" y1="${footLineY}" x2="${f.w - pad}" y2="${footLineY}" stroke="${t.line}" stroke-width="1"/>
  ${c.source ? `<text x="${pad}" y="${footLineY + 30}" font-family="${SANS}" font-size="${wide ? 15 : 18}" fill="${t.muted}">${esc(c.source)}</text>` : ''}
  ${mark(wide ? 30 : 34, c.accent, t.ink, f.w - pad - (wide ? 148 : 166), footLineY + 2)}
  ${wordmark(f.w - pad, footLineY + 34, wide ? 21 : 24, c.accent, t.ink, 'end')}
  `;
}

export const DESIGNS: { key: DesignKey; label: string; note: string }[] = [
  { key: 'plate', label: 'Plate', note: 'Framed · quotes' },
  { key: 'orbit', label: 'Orbit', note: 'Evidence rings · facts' },
  { key: 'index', label: 'Index', note: 'Typographic · entries' },
];

export function buildCardSvg(
  design: DesignKey,
  format: DesignFormat,
  theme: DesignTheme,
  content: DesignContent,
  fontCss = '',
): string {
  const body =
    design === 'orbit' ? orbitDesign(format, theme, content)
      : design === 'index' ? indexDesign(format, theme, content)
        : plate(format, theme, content);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${format.w}" height="${format.h}" viewBox="0 0 ${format.w} ${format.h}" role="img" aria-label="${esc(content.title ?? content.body).slice(0, 120)}">
    <style>${fontCss}</style>
    ${body}
  </svg>`;
}
