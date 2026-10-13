import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { X, Download, Share2, Check } from 'lucide-react';
import { ShareCard } from './ShareCard';
import {
  CARD_FORMATS,
  CARD_THEMES,
  CardContent,
  CardFormat,
  CardTheme,
  downloadCard,
  formatOf,
  shareCard,
  themeOf,
} from '../share/card';

interface ShareCardModalProps {
  content: CardContent;
  filename: string;
  onClose: () => void;
  initialFormat?: CardFormat;
}

const MAX_PREVIEW = 420;

export const ShareCardModal: React.FC<ShareCardModalProps> = ({ content, filename, onClose, initialFormat = 'square' }) => {
  const [format, setFormat] = useState<CardFormat>(initialFormat);
  const [theme, setTheme] = useState<CardTheme>('light');
  const [status, setStatus] = useState<'idle' | 'busy' | 'done' | 'error'>('idle');
  const cardRef = useRef<HTMLDivElement>(null);

  const fmt = formatOf(format);
  const thm = themeOf(theme);
  const scale = Math.min(MAX_PREVIEW / fmt.w, MAX_PREVIEW / fmt.h, 1);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const save = useCallback(async () => {
    if (!cardRef.current) return;
    setStatus('busy');
    const ok = await downloadCard(cardRef.current, thm, filename);
    setStatus(ok ? 'done' : 'error');
    setTimeout(() => setStatus('idle'), 2200);
  }, [filename, thm]);

  const send = useCallback(async () => {
    if (!cardRef.current) return;
    setStatus('busy');
    const res = await shareCard(cardRef.current, thm, filename, content.title ?? content.eyebrow, content.body.slice(0, 140));
    setStatus(res === 'failed' ? 'error' : 'done');
    setTimeout(() => setStatus('idle'), 2200);
  }, [content, filename, thm]);

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
          {/* preview */}
          <div className="flex justify-center mb-5">
            <div
              className="overflow-hidden rounded-xl border hairline shadow-sm"
              style={{ width: fmt.w * scale, height: fmt.h * scale }}
            >
              <div style={{ transform: `scale(${scale})`, transformOrigin: 'top left', width: fmt.w, height: fmt.h }}>
                <div ref={cardRef} style={{ width: fmt.w, height: fmt.h }}>
                  <ShareCard content={content} format={fmt} theme={thm} />
                </div>
              </div>
            </div>
          </div>

          {/* format */}
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

          {/* theme */}
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

        <div className="px-6 py-4 border-t hairline flex flex-col-reverse sm:flex-row justify-end gap-3 shrink-0">
          <button onClick={save} disabled={status === 'busy'} className="btn btn-ghost justify-center gap-2">
            <Download className="w-4 h-4" />
            {status === 'done' ? 'Saved' : status === 'error' ? 'Try again' : 'Download PNG'}
          </button>
          <button onClick={send} disabled={status === 'busy'} className="btn btn-accent justify-center gap-2">
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </motion.div>
    </div>
  );
};
