/* ------------------------------------------------------------------ *
 * Card designs
 *
 * Cards are composed as hand-built SVG rather than styled DOM: the
 * layout is exact at every output size, the ornament is real vector
 * geometry, and the same markup both previews and exports.
 *
 * Visual language: an orbital "apsis" motif, registration marks and
 * hairlines borrowed from print, Fraunces for display and Inter for
 * detail, on warm paper with a film grain over it.
 *
 * Two rules hold everywhere:
 *
 *  1. Nothing is allowed to touch the trim. Every design works inside a
 *     safe area inset by `pad`, and the only things drawn outside it are
 *     the registration marks, which are meant to be there.
 *
 *  2. Every piece of text is measured against the box it sits in.
 *     Display type is fitted to its band (`fitSize`) and wrapped; single
 *     lines that must stay one line — the label, the attribution, the
 *     citation — are truncated to fit (`fitLine`). A citation is a long
 *     string and used to run straight off the card.
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
  /** 0-5, drawn as the apsis gauge on the fact design. */
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
/**
 * Split a token that cannot fit a line on its own. The corpus is full of
 * long hyphenated compounds — "incentive-sensitization",
 * "Risk-Need-Responsivity" — and a wrapper that only breaks on spaces
 * leaves them running straight off the card. Hyphens are the natural
 * break point; a character break is the fallback.
 */
function breakToken(token: string, font: string, maxWidth: number): string[] {
  const out: string[] = [];
  const parts = token.split(/(?<=-)/);
  let cur = '';
  for (const part of parts) {
    if (!cur) {
      cur = part;
    } else if (textWidth(cur + part, font) <= maxWidth) {
      cur += part;
    } else {
      out.push(cur);
      cur = part;
    }
    while (textWidth(cur, font) > maxWidth && cur.length > 1) {
      let k = cur.length;
      while (k > 1 && textWidth(cur.slice(0, k), font) > maxWidth) k -= 1;
      out.push(cur.slice(0, k));
      cur = cur.slice(k);
    }
  }
  if (cur) out.push(cur);
  return out;
}

export function wrap(text: string, font: string, maxWidth: number, maxLines = 99): string[] {
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = '';
  let dropped = false;

  for (const word of words) {
    if (textWidth(word, font) > maxWidth) {
      // Too wide for any line: break it and emit the pieces as lines.
      if (line) {
        lines.push(line);
        line = '';
      }
      const chunks = breakToken(word, font, maxWidth);
      for (let c = 0; c < chunks.length; c++) {
        if (c === chunks.length - 1) {
          line = chunks[c];
        } else if (lines.length >= maxLines) {
          dropped = true;
          break;
        } else {
          lines.push(chunks[c]);
        }
      }
      if (dropped) break;
      continue;
    }

    const next = line ? `${line} ${word}` : word;
    if (!line || textWidth(next, font) <= maxWidth) {
      line = next;
    } else if (lines.length >= maxLines) {
      dropped = true;
      break;
    } else {
      lines.push(line);
      line = word;
    }
  }

  if (!dropped && line) lines.push(line);

  // Only ellipsise when something was genuinely left out. The previous
  // version tracked a running count that missed the word held in `line`,
  // so a wrap that kept every word still got an ellipsis appended.
  if (dropped && lines.length) {
    const i = lines.length - 1;
    let last = lines[i];
    while (textWidth(`${last}…`, font) > maxWidth && last.length > 1) last = last.slice(0, -1);
    lines[i] = `${last}…`;
  }
  return lines;
}

/**
 * One line, shortened until it fits. Used for the label, the attribution
 * and the citation — things that must not wrap but also must not cross
 * the trim. An unbreakable token longer than the box is hard-cut.
 */
export function fitLine(text: string, font: string, maxWidth: number): string {
  const s = String(text ?? '').trim();
  if (!s || textWidth(s, font) <= maxWidth) return s;
  let cut = s;
  while (cut.length > 1 && textWidth(`${cut}…`, font) > maxWidth) {
    const sp = cut.lastIndexOf(' ');
    cut = sp > 0 ? cut.slice(0, sp) : cut.slice(0, -1);
  }
  return `${cut.trimEnd()}…`;
}

/**
 * Largest display size at which the text fills the target share of the
 * band. This is what stops a two-line quote from floating as a small
 * paragraph in the middle of a card: the type scales to the space.
 */
const wordCount = (t: string): number => String(t).split(/\s+/).filter(Boolean).length;

/** True when `wrap` kept every word — i.e. the lines were not ellipsised. */
const wrapsWhole = (lines: string[], text: string): boolean =>
  !lines.some((l) => l.endsWith('…')) && wordCount(lines.join(' ')) >= wordCount(text);

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
  // Display type is never allowed to be ellipsised: losing the end of a
  // finding is worse than setting it smaller. So a size only wins if the
  // whole string wrapped, and the largest such size that fits the band is
  // taken. `whole` is the best complete setting seen, used if nothing
  // complete fits.
  let whole: { size: number; lines: string[] } | null = null;
  for (let s = max; s >= min; s -= 2) {
    const lines = wrap(text, fontAt(s), maxWidth, maxLines);
    if (!wrapsWhole(lines, text)) continue;
    if (!whole) whole = { size: s, lines };
    if (lines.length * s * lhFactor <= bandH * target) return { size: s, lines };
  }
  return whole ?? { size: min, lines: wrap(text, fontAt(min), maxWidth, maxLines) };
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

/* ------------------------------------------------------------ ornament */

export function orbit(
  cx: number,
  cy: number,
  radii: number[],
  accent: string,
  opacities: number[],
  width: number,
  dash = '',
): string {
  return radii
    .map(
      (r, i) =>
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${accent}" stroke-opacity="${opacities[i] ?? 0.06}" stroke-width="${width}"${dash ? ` stroke-dasharray="${dash}"` : ''}/>`,
    )
    .join('');
}

/** The apsis mark — concentric rings around a centre, as in the wordmark. */
export function mark(size: number, accent: string, ink: string, x = 0, y = 0): string {
  const c = size / 2;
  return (
    `<circle cx="${x + c}" cy="${y + c}" r="${c - 1}" fill="none" stroke="${ink}" stroke-opacity="0.5" stroke-width="1.1"/>` +
    `<circle cx="${x + c}" cy="${y + c}" r="${c * 0.62}" fill="none" stroke="${accent}" stroke-opacity="0.9" stroke-width="1.1"/>` +
    `<circle cx="${x + c}" cy="${y + c}" r="${c * 0.24}" fill="${accent}"/>`
  );
}

export function wordmark(x: number, y: number, size: number, accent: string, ink: string, anchor = 'start'): string {
  return (
    `<text x="${x}" y="${y}" text-anchor="${anchor}" font-family="${SERIF}" font-size="${size}" font-weight="600" ` +
    `letter-spacing="-0.3" fill="${ink}">Mind<tspan fill="${accent}">Trace</tspan></text>`
  );
}

/**
 * L-shaped registration marks, set in the margin outside the trim. The
 * print cue that says a card was composed rather than filled in.
 */
function cornerMarks(x: number, y: number, w: number, h: number, gap: number, len: number, colour: string, sw: number): string {
  const x0 = x, x1 = x + w, y0 = y, y1 = y + h;
  const seg = (ax: number, ay: number, bx: number, by: number) =>
    `<line x1="${ax}" y1="${ay}" x2="${bx}" y2="${by}" stroke="${colour}" stroke-width="${sw}"/>`;
  return [
    seg(x0 - gap - len, y0 - gap, x0 - gap, y0 - gap),
    seg(x0 - gap, y0 - gap - len, x0 - gap, y0 - gap),
    seg(x1 + gap, y0 - gap, x1 + gap + len, y0 - gap),
    seg(x1 + gap, y0 - gap - len, x1 + gap, y0 - gap),
    seg(x0 - gap - len, y1 + gap, x0 - gap, y1 + gap),
    seg(x0 - gap, y1 + gap, x0 - gap, y1 + gap + len),
    seg(x1 + gap, y1 + gap, x1 + gap + len, y1 + gap),
    seg(x1 + gap, y1 + gap, x1 + gap, y1 + gap + len),
  ].join('');
}

/** Arc as a path, angles in degrees, 0 at 12 o'clock, clockwise. */
function arcPath(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const p = (a: number) => {
    const rad = ((a - 90) * Math.PI) / 180;
    return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)];
  };
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  const large = Math.abs(a1 - a0) > 180 ? 1 : 0;
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

/**
 * The apsis gauge: the evidence level as five arc segments around a
 * centre. Filled segments are accent, empty ones a hairline, so the
 * level is legible at a glance and still reads as the brand motif.
 */
function gauge(cx: number, cy: number, r: number, level: number, accent: string, line: string, sw: number): string {
  // A full track with a single accent sweep over it. Five discrete
  // segments were tried and read as a plain circle, because the gaps
  // between them are too small to see at card size; an arc that travels
  // a fifth of the way round per level is legible at a glance.
  const frac = Math.max(0, Math.min(5, level)) / 5;
  const sweep = frac * 359.9;
  const track = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${line}" stroke-width="${sw * 0.6}" stroke-opacity="0.75"/>`;
  const fill = frac > 0 ? `<path d="${arcPath(cx, cy, r, 0, sweep)}" fill="none" stroke="${accent}" stroke-width="${sw}" stroke-linecap="round"/>` : '';
  return track + fill;
}

/* ------------------------------------------------------------- ground */

const lum = (hex: string): number => {
  const h = hex.replace('#', '');
  const n = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16) / 255);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const isDark = (t: DesignTheme): boolean => lum(t.bg) < 0.5;

/**
 * Ground for a card. Flat colour is what makes generated cards look
 * cheap, so the surface is built in four passes: a diagonal wash, an
 * accent spotlight, a vignette for depth, and a fine film grain over the
 * top. The grain is an feTurbulence filter desaturated to grey — it is
 * what makes the gradient read as printed paper rather than as a CSS
 * fill, and it also dissolves the banding that large soft gradients
 * otherwise show.
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

/**
 * Stable per-card id suffix. Gradient and filter ids are document-global,
 * so two cards rendered side by side would otherwise share the first
 * card's defs — a dark card would paint with a light card's wash. Derived
 * from the content so it is deterministic between builds.
 */
function uid(format: DesignFormat, theme: DesignTheme, c: DesignContent): string {
  const s = `${format.key}|${theme.key}|${c.eyebrow}|${c.title ?? ''}|${c.body}`;
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(36);
}

/* ------------------------------------------------------- shared chrome */

interface Geo {
  pad: number;
  x: number;
  y: number;
  w: number;
  h: number;
  top: number;
  bottom: number;
  footRuleY: number;
  footY: number;
}

/**
 * The frame every card shares: trim rule, registration marks, the label
 * above the rule, and the footer with the citation and the wordmark.
 * Everything is measured to the trim, so no line can cross it.
 */
function chrome(f: DesignFormat, t: DesignTheme, c: DesignContent, labelSize: number): { svg: string; geo: Geo } {
  const pad = PAD(f);
  const wide = f.key === 'wide';
  const x = pad, y = pad, w = f.w - pad * 2, h = f.h - pad * 2;

  const labelY = pad + (wide ? 36 : 46);
  const ruleY = labelY + (wide ? 20 : 26);
  const footRuleY = f.h - pad - (wide ? 44 : 56);
  const footY = footRuleY + (wide ? 26 : 33);

  const labelFont = `600 ${labelSize}px ${SANS}`;
  // Small, so a full citation has a chance of fitting rather than being
  // cut. A citation that still overruns is truncated rather than allowed
  // to cross the trim.
  const footFont = `${wide ? 13 : 14}px ${SANS}`;

  // Reserve the right-hand end for the mark + wordmark before fitting the citation.
  const reserve = wide ? 232 : 286;
  const label = fitLine(c.eyebrow.toUpperCase(), labelFont, w - 8);
  const citation = c.source ? fitLine(c.source, footFont, w - reserve) : '';

  const svg = `
    ${cornerMarks(x, y, w, h, 0, wide ? 13 : 17, t.rule, 1.2)}
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="none" stroke="${t.rule}" stroke-width="1.4"/>
    <text x="${pad}" y="${labelY}" font-family="${SANS}" font-size="${labelSize}" font-weight="600" letter-spacing="${wide ? 2.2 : 2.7}" fill="${c.accent}">${esc(label)}</text>
    <line x1="${x}" y1="${ruleY}" x2="${f.w - pad}" y2="${ruleY}" stroke="${t.line}" stroke-width="1"/>
    <line x1="${x}" y1="${footRuleY}" x2="${f.w - pad}" y2="${footRuleY}" stroke="${t.line}" stroke-width="1"/>
    ${citation ? `<text x="${pad}" y="${footY}" font-family="${SANS}" font-size="${footFont}" fill="${t.muted}">${esc(citation)}</text>` : ''}
    ${mark(wide ? 26 : 30, c.accent, t.ink, f.w - pad - (wide ? 158 : 176), footRuleY + (wide ? 10 : 12))}
    ${wordmark(f.w - pad, footY + (wide ? 2 : 4), wide ? 19 : 22, c.accent, t.ink, 'end')}`;

  const geo: Geo = {
    pad,
    x,
    y,
    w,
    h,
    top: ruleY + (wide ? 30 : 42),
    bottom: footRuleY - (wide ? 26 : 38),
    footRuleY,
    footY,
  };
  return { svg, geo };
}

/* ------------------------------------------------------------- plate */

/**
 * Quotation. A hanging quote mark in the margin, the quote set to fill
 * its band, and the attribution on an accent rule beneath it. The source
 * lives in the footer with every other card, so the two never repeat.
 */
function plate(f: DesignFormat, t: DesignTheme, c: DesignContent): string {
  const wide = f.key === 'wide';
  const id = uid(f, t, c);
  const { svg: chromeSvg, geo } = chrome(f, t, c, wide ? 17 : 20);

  const markSize = wide ? 96 : 138;
  const indent = wide ? 66 : 94;
  const maxW = geo.w - indent;

  const attrH = wide ? 78 : 104;
  const bandH = geo.bottom - geo.top - attrH;

  const fit = fitSize(c.body, (s) => `600 ${s}px ${SERIF}`, maxW, wide ? 4 : 8, bandH, 0.94, wide ? 26 : 34, wide ? 54 : 94, 1.26);
  const size = fit.size;
  const lines = fit.lines;
  const lh = size * 1.26;

  const blockH = lines.length * lh + attrH;
  const top = geo.top + Math.max(0, (geo.bottom - geo.top - blockH) / 2);
  const first = top + size * 0.82;
  const ruleY = first + (lines.length - 1) * lh + (wide ? 44 : 58);
  const authorY = ruleY + (wide ? 30 : 37);

  const authorFont = `600 ${wide ? 19 : 22}px ${SANS}`;
  const author = c.meta ? fitLine(c.meta, authorFont, geo.w - 40) : '';

  // The quote mark sits in the margin, its top aligned with the first
  // line's cap height, so the text starts to its right.
  const quoteY = first - size * 0.06;
  const quote = `<text x="${geo.pad}" y="${Math.round(quoteY)}" font-family="${SERIF}" font-size="${Math.round(markSize)}" font-weight="600" fill="${c.accent}" fill-opacity="0.42">\u201C</text>`;

  return `
  ${background(f, t, id, c.accent)}
  ${orbit(f.w + 30, -50, [300, 430, 560], c.accent, [0.1, 0.07, 0.045], 2)}
  ${apsis(f.w + 30, -50, 430, c.accent, 0.3, 3, 0.5, 142)}
  ${chromeSvg}
  ${quote}
  ${textBlock(lines, geo.pad + indent, first, lh, `font-family="${SERIF}" font-size="${size}" font-weight="600" letter-spacing="-0.5" fill="${t.ink}"`)}
  <line x1="${geo.pad + indent}" y1="${Math.round(ruleY)}" x2="${geo.pad + indent + (wide ? 42 : 52)}" y2="${Math.round(ruleY)}" stroke="${c.accent}" stroke-width="2.4"/>
  ${author ? `<text x="${geo.pad + indent}" y="${Math.round(authorY)}" font-family="${SANS}" font-size="${wide ? 19 : 22}" font-weight="600" fill="${t.ink}">${esc(author)}</text>` : ''}`;
}

/* ------------------------------------------------------------ orbit */

/**
 * Finding. The claim set large, the summary beneath it, and the evidence
 * drawn as the apsis gauge — five arc segments, filled to the level —
 * beside its own label. The gauge is the fact card's signature.
 */
function orbitDesign(f: DesignFormat, t: DesignTheme, c: DesignContent): string {
  const wide = f.key === 'wide';
  const id = uid(f, t, c);
  const { svg: chromeSvg, geo } = chrome(f, t, c, wide ? 17 : 20);

  const dark = isDark(t);
  const accent = dark ? shift(c.accent, '#ffffff', 0.3) : c.accent;
  const trackLine = dark ? shift(t.line, '#ffffff', 0.2) : t.line;

  const level = Math.max(0, Math.min(5, Math.round(c.level ?? 0)));
  const gaugeR = wide ? 52 : 70;
  const gaugeBlock = gaugeR * 2 + (wide ? 30 : 40);

  const bSize = wide ? 20 : 25;
  const bFont = `400 ${bSize}px ${SANS}`;
  const bLH = bSize * 1.58;
  const bodyLines = wrap(c.body, bFont, geo.w, wide ? 3 : 6);
  const bodyH = bodyLines.length * bLH;
  const gap = wide ? 26 : 36;

  // The finding is the card's substance, so it is never ellipsised: the
  // title is allowed up to five lines and the type steps down instead.
  const titleBand = Math.max(120, geo.bottom - geo.top - gaugeBlock - bodyH - gap * 2);
  const fit = fitSize(c.title ?? c.body, (s) => `600 ${s}px ${SERIF}`, geo.w, 5, titleBand, 0.98, wide ? 24 : 32, wide ? 56 : 88, 1.14);
  const tSize = fit.size;
  const titleLines = fit.lines;
  const tLH = tSize * 1.14;

  const blockH = titleLines.length * tLH + gap + bodyH + gap + gaugeBlock;
  const top = geo.top + Math.max(0, (geo.bottom - geo.top - blockH) / 2);
  const tFirst = top + tSize * 0.82;
  const bFirst = tFirst + (titleLines.length - 1) * tLH + gap + bSize * 0.82;
  const gaugeTop = bFirst + (bodyLines.length - 1) * bLH + gap - bSize * 0.82 + bSize;
  const gcx = geo.pad + gaugeR;
  const gcy = gaugeTop + gaugeR;

  const factNo = c.meta ? fitLine(c.meta.toUpperCase(), `600 ${wide ? 15 : 17}px ${SANS}`, geo.w - gaugeBlock - 40) : '';
  const labelX = geo.pad + gaugeBlock + (wide ? 22 : 30);

  return `
  ${background(f, t, id, c.accent)}
  ${orbit(-40, f.h + 40, [240, 340, 440], c.accent, [0.07, 0.05, 0.03], 2)}
  ${apsis(-40, f.h + 40, 340, c.accent, 0.28, 3, 0.45, -58)}
  ${chromeSvg}
  ${textBlock(titleLines, geo.pad, tFirst, tLH, `font-family="${SERIF}" font-size="${tSize}" font-weight="600" letter-spacing="-0.5" fill="${t.ink}"`)}
  ${textBlock(bodyLines, geo.pad, bFirst, bLH, `font-family="${SANS}" font-size="${bSize}" fill="${t.soft}"`)}
  ${gauge(gcx, gcy, gaugeR, level, accent, trackLine, wide ? 5 : 6.5)}
  <circle cx="${gcx}" cy="${gcy}" r="${wide ? 5 : 6.5}" fill="${accent}"/>
  <text x="${labelX}" y="${gcy - (wide ? 2 : 4)}" font-family="${SANS}" font-size="${wide ? 13 : 15}" font-weight="600" letter-spacing="${wide ? 2.2 : 2.8}" fill="${accent}">EVIDENCE</text>
  <text x="${labelX}" y="${gcy + (wide ? 26 : 32)}" font-family="${SERIF}" font-size="${wide ? 24 : 30}" font-weight="600" fill="${t.ink}">${level}<tspan fill="${t.muted}" font-family="${SANS}" font-size="${wide ? 17 : 21}" font-weight="400"> of 5</tspan></text>
  ${factNo ? `<text x="${labelX}" y="${gcy + (wide ? 50 : 64)}" font-family="${SANS}" font-size="${wide ? 14 : 16}" font-weight="600" letter-spacing="${wide ? 2 : 2.4}" fill="${t.muted}">${esc(factNo)}</text>` : ''}`;
}

/* ------------------------------------------------------------ index */

/** Entry. The typographic card: name set large, summary beneath. */
function indexDesign(f: DesignFormat, t: DesignTheme, c: DesignContent): string {
  const wide = f.key === 'wide';
  const id = uid(f, t, c);
  const { svg: chromeSvg, geo } = chrome(f, t, c, wide ? 17 : 20);

  const bSize = wide ? 20 : 25;
  const bFont = `400 ${bSize}px ${SANS}`;
  const bLH = bSize * 1.58;
  const gap = wide ? 26 : 36;

  const bodyLines = wrap(c.body, bFont, geo.w, wide ? 3 : 6);
  const bodyH = bodyLines.length * bLH;
  const titleBand = Math.max(120, geo.bottom - geo.top - bodyH - gap);

  const fit = fitSize(c.title ?? c.body, (s) => `600 ${s}px ${SERIF}`, geo.w, 4, titleBand, 0.96, wide ? 30 : 42, wide ? 66 : 118, 1.12);
  const tSize = fit.size;
  const titleLines = fit.lines;
  const tLH = tSize * 1.12;

  const blockH = titleLines.length * tLH + gap + bodyH;
  const top = geo.top + Math.max(0, (geo.bottom - geo.top - blockH) / 2);
  const tFirst = top + tSize * 0.82;
  const bFirst = tFirst + (titleLines.length - 1) * tLH + gap + bSize * 0.82;

  return `
  ${background(f, t, id, c.accent)}
  ${orbit(f.w - 40, f.h + 90, [320, 470, 620], c.accent, [0.075, 0.05, 0.032], 2)}
  ${apsis(f.w - 40, f.h + 90, 470, c.accent, 0.24, 3, 0.5, -42)}
  ${chromeSvg}
  ${textBlock(titleLines, geo.pad, tFirst, tLH, `font-family="${SERIF}" font-size="${tSize}" font-weight="600" letter-spacing="-0.5" fill="${t.ink}"`)}
  ${textBlock(bodyLines, geo.pad, bFirst, bLH, `font-family="${SANS}" font-size="${bSize}" fill="${t.soft}"`)}`;
}

export const DESIGNS: { key: DesignKey; label: string; note: string }[] = [
  { key: 'plate', label: 'Quotation', note: 'Hanging mark · quotes' },
  { key: 'orbit', label: 'Finding', note: 'Apsis gauge · facts' },
  { key: 'index', label: 'Entry', note: 'Typographic · entries' },
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
