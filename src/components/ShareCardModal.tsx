import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { X, Download, Share2, Check, FileCode2 } from 'lucide-react';
import { ShareCard } from './ShareCard';
import {
  CARD_FORMATS,
  CARD_THEMES,
  DESIGNS,
  DesignContent,
  DesignKey,
  CardFormat,
  CardTheme,
  buildCard,
  downloadCard,
  downloadSvg,
  formatOf,
  shareCard,
  themeOf,
} from '../share/card';

interface ShareCardModalProps {
  content: DesignContent;
  filename: string;
  onClose: () => void;
  initialFormat?: CardFormat;
  initialDesign?: DesignKey;
}

const MAX_PREVIEW = 400;

export const ShareCardModal: React.FC<ShareCardModalProps> = ({
  content,
  filename,
  onClose,
  initialFormat = 'square',
  initialDesign = 'plate',
}) => {
  const [design, setDesign] = useState<DesignKey>(initialDesign);
  const [format, setFormat] = useState<CardFormat>(initialFormat);
  const [theme, setTheme] = useState<CardTheme>('light');
  const [svg, setSvg] = useState('');
  const [status, setStatus] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');

  const fmt = formatOf(format);
  const thm = themeOf(theme);
  const scale = Math.min(MAX_PREVIEW / fmt.w, MAX_PREVIEW / fmt.h, 1);
  const stem = filename.replace(/\.png$/, '');

  useEffect(() => {
    let live = true;
    setSvg('');
    buildCard(design, fmt, thm, content).then((s) => { if (live) setSvg(s); });
    return () => { live = false; };
  }, [design, fmt, thm, content]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const flash = useCallback((ok: boolean) => {
    setStatus(ok ? 'done' : 'error');
    setTimeout(() => setStatus('idle'), 2000);
  }, []);

  const savePng = useCallback(async () => {
    if (!svg) return;
    setStatus('busy');
    flash(await downloadCard(svg, fmt, thm, `${stem}.png`));
  }, [svg, fmt, thm, stem, flash]);

  const saveSvg = useCallback(() => {
    if (!svg) return;
    setStatus('busy');
    flash(downloadSvg(svg, `${stem}.svg`));
  }, [svg, stem, flash]);

  const send = useCallback(async () => {
    if (!svg) return;
    setStatus('busy');
    const res = await shareCard(svg, fmt, thm, `${stem}.png`, content.title ?? content.eyebrow, content.body.slice(0, 140));
    flash(res !== 'failed');
  }, [svg, fmt, thm, stem, content, flash]);

  const busy = status === 'busy' || !svg;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-ink/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Share as a card"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.24, ease: 'easeOut' }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg max-h-full bg-surface rounded-2xl shadow-2xl flex flex-col overflow-hidden border hairline"
      >
        <div className="px-6 py-4 border-b hairline flex items-center justify-between shrink-0">
          <div>
            <div className="kicker mb-0.5">Share as a card</div>
            <h2 className="font-display text-xl font-semibold text-ink tracking-tight">Make an image</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-muted hover:text-ink transition-colors" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <div className="flex justify-center mb-5">
            <div
              className="overflow-hidden rounded-xl border hairline shadow-sm bg-paper-2"
              style={{ width: fmt.w * scale, height: fmt.h * scale }}
            >
              <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: fmt.w, height: fmt.h }}>
                <ShareCard svg={svg} width={fmt.w} height={fmt.h} alt={content.title ?? content.body.slice(0, 80)} />
              </div>
            </div>
          </div>

          <div className="mb-4">
            <div className="kicker mb-2">Design</div>
            <div className="grid grid-cols-3 gap-2" role="group" aria-label="Card design">
              {DESIGNS.map((d) => (
                <button
                  key={d.key}
                  onClick={() => setDesign(d.key)}
                  aria-pressed={design === d.key}
                  className={`px-3 py-2.5 rounded-lg border text-left transition-colors ${
                    design === d.key ? 'border-accent bg-accent-soft' : 'border-line hover:border-line-strong'
                  }`}
                >
                  <span className={`block text-[12.5px] font-semibold ${design === d.key ? 'text-accent' : 'text-ink'}`}>
                    {d.label}
                  </span>
                  <span className="block text-[10.5px] text-faint leading-tight mt-0.5">{d.note}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="kicker mb-2">Format</div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Card format">
              {CARD_FORMATS.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setFormat(f.key)}
                  aria-pressed={format === f.key}
                  className={`px-3.5 py-2 rounded-lg border text-[12.5px] font-medium transition-colors ${
                    format === f.key ? 'border-accent text-accent bg-accent-soft' : 'border-line text-ink-soft hover:border-line-strong'
                  }`}
                >
                  {f.label}
                  <span className="block text-[10.5px] font-normal text-faint">{f.note}</span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="kicker mb-2">Style</div>
            <div className="flex gap-2" role="group" aria-label="Card style">
              {CARD_THEMES.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTheme(t.key)}
                  aria-pressed={theme === t.key}
                  aria-label={t.label}
                  title={t.label}
                  className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-transform hover:scale-105 ${
                    theme === t.key ? 'border-ink' : 'border-line'
                  }`}
                  style={{ background: t.bg }}
                >
                  {theme === t.key && <Check className="w-4 h-4" style={{ color: t.ink }} />}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t hairline flex flex-col-reverse sm:flex-row justify-end gap-2 shrink-0">
          <button onClick={saveSvg} disabled={busy} className="btn btn-ghost justify-center gap-2" title="Download the vector source">
            <FileCode2 className="w-4 h-4" /> SVG
          </button>
          <button onClick={savePng} disabled={busy} className="btn btn-ghost justify-center gap-2">
            <Download className="w-4 h-4" />
            {status === 'done' ? 'Saved' : status === 'error' ? 'Try again' : 'PNG'}
          </button>
          <button onClick={send} disabled={busy} className="btn btn-accent justify-center gap-2">
            <Share2 className="w-4 h-4" /> Share
          </button>
        </div>
      </motion.div>
    </div>
  );
};
