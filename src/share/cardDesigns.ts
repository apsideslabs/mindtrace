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

function background(f: DesignFormat, t: DesignTheme, id: string): string {
  return `<defs>
      <radialGradient id="bg-${id}" cx="28%" cy="8%" r="110%">
        <stop offset="0%" stop-color="${t.bg2}"/>
        <stop offset="100%" stop-color="${t.bg}"/>
      </radialGradient>
    </defs>
    <rect width="${f.w}" height="${f.h}" fill="url(#bg-${id})"/>`;
}

const PAD = (f: DesignFormat) => (f.w === 1200 ? 72 : 96);

/* ---------------------------------------------------------------- 1. Plate — framed editorial, for quotes */

function plate(f: DesignFormat, t: DesignTheme, c: DesignContent): string {
  const pad = PAD(f);
  const wide = f.key === 'wide';
  const size = wide ? 42 : f.key === 'portrait' ? 64 : 56;
  const font = `600 ${size}px ${SERIF}`;
  const lh = size * 1.32;
  const lines = wrap(c.body, font, f.w - pad * 2 - 56, wide ? 4 : 8);

  const footLineY = f.h - pad - (wide ? 62 : 88);
  const metaY = footLineY + (wide ? 32 : 36);
  const srcY = metaY + (wide ? 22 : 26);

  // The eyebrow travels with the quote, so the header never floats away
  // from the content and the remaining whitespace reads as intentional.
  const headerH = wide ? 54 : 70;
  const blockH = lines.length * lh;
  const groupH = headerH + blockH;
  const bandTop = pad + (wide ? 34 : 48);
  const bandBottom = footLineY - (wide ? 34 : 50);
  const groupTop = bandTop + Math.max(0, (bandBottom - bandTop - groupH) / 2);
  const eyebrowY = groupTop + (wide ? 22 : 28);
  const ruleY = eyebrowY - (wide ? 26 : 32);
  const first = groupTop + headerH + size * 0.82;

  // Typographic quotes on the text itself rather than a decorative mark,
  // which collided with the eyebrow on short cards.
  const quoted = lines.map((l, i) => (i === 0 ? `\u201C${l}` : l));
  if (quoted.length) quoted[quoted.length - 1] = `${quoted[quoted.length - 1]}\u201D`;

  return `
  ${background(f, t, 'plate')}
  ${orbit(f.w + 30, -50, [300, 430, 560], c.accent, [0.1, 0.07, 0.045], 2)}
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
  const ringR = wide ? 62 : 76;
  const ringGap = wide ? 44 : 62;
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
        `<circle cx="${ringCx}" cy="${ringCy}" r="${(ringR * k).toFixed(1)}" fill="none" stroke="${i < level ? c.accent : t.line}" stroke-width="${i < level ? 3.4 : 1.6}"/>`,
    )
    .join('');
  const ringLabel = `<text x="${ringCx}" y="${ringCy + (wide ? 4 : 5)}" text-anchor="middle" font-family="${SANS}" font-size="${wide ? 14 : 17}" font-weight="600" fill="${t.muted}">${level}/5</text>`;

  return `
  ${background(f, t, 'orbit')}
  ${orbit(-40, f.h + 40, [240, 340, 440], c.accent, [0.07, 0.05, 0.03], 2)}
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
  const tSize = wide ? 48 : f.key === 'portrait' ? 76 : 64;
  const bSize = wide ? 20 : 26;
  const tFont = `600 ${tSize}px ${SERIF}`;
  const bFont = `400 ${bSize}px ${SANS}`;
  const tLH = tSize * 1.12;
  const bLH = bSize * 1.6;
  const gap = wide ? 22 : 32;
  const indent = wide ? 30 : 40;

  const titleLines = wrap(c.title ?? c.body, tFont, f.w - pad * 2 - indent - 20, 4);
  const bodyLines = wrap(c.body, bFont, f.w - pad * 2 - indent - 20, wide ? 4 : 8);

  const footLineY = f.h - pad - 58;
  const headerH = wide ? 54 : 76;
  const blockH = titleLines.length * tLH + gap + bodyLines.length * bLH;
  const groupH = headerH + blockH;
  const bandTop = pad + (wide ? 40 : 62);
  const bandBottom = footLineY - (wide ? 34 : 48);
  const groupTop = bandTop + Math.max(0, (bandBottom - bandTop - groupH) / 2);
  const eyebrowY = groupTop + (wide ? 22 : 28);
  const topRuleY = Math.max(pad + 4, groupTop - (wide ? 56 : 80));
  const tFirst = groupTop + headerH + tSize * 0.82;
  const bFirst = tFirst + (titleLines.length - 1) * tLH + gap + bSize * 0.82;

  return `
  ${background(f, t, 'index')}
  ${orbit(f.w - 40, f.h + 90, [320, 470, 620], c.accent, [0.075, 0.05, 0.032], 2)}
  ${orbit(f.w - 40, f.h + 90, [620], c.accent, [0.04], 1.4, '3 12')}
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
