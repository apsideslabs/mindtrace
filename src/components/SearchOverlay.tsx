import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X, CornerDownLeft } from 'lucide-react';
import { searchTopics, searchFacts, getCategoryById } from '../content/content-index';

export function SearchOverlay({
  open,
  onClose,
  onOpenTopic,
  onOpenFact,
}: {
  open: boolean;
  onClose: () => void;
  onOpenTopic: (id: string) => void;
  onOpenFact: (id: string) => void;
}) {
  const [q, setQ] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ('');
      setTimeout(() => inputRef.current?.focus(), 30);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const topics = useMemo(() => (q.trim().length > 1 ? searchTopics(q).slice(0, 6) : []), [q]);
  const facts = useMemo(() => (q.trim().length > 1 ? searchFacts(q).slice(0, 5) : []), [q]);
  const empty = q.trim().length > 1 && topics.length === 0 && facts.length === 0;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh] sm:pt-[15vh]">
      <div className="absolute inset-0 bg-ink/30" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-surface border hairline border-t-2 border-t-accent shadow-2xl mt-fade">
        <div className="flex items-center gap-3 px-5 h-16 border-b hairline">
          <Search className="w-[18px] h-[18px] text-accent" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the catalogue and facts…"
            className="flex-1 bg-transparent outline-none font-body text-[17px] text-ink placeholder:text-faint"
          />
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-muted hover:text-ink">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[54vh] overflow-y-auto">
          {q.trim().length <= 1 && (
            <div className="px-5 py-6">
              <div className="kicker mb-3">Try</div>
              <div className="flex flex-wrap gap-2">
                {['gaslighting', 'attachment', 'anchoring', 'cognitive biases', 'body language'].map((s) => (
                  <button key={s} onClick={() => setQ(s)} className="chip">{s}</button>
                ))}
              </div>
            </div>
          )}

          {topics.length > 0 && (
            <div className="border-t hairline">
              <div className="px-5 pt-4 pb-1 kicker">Entries</div>
              {topics.map((t) => (
                <button key={t.id} onClick={() => onOpenTopic(t.id)} className="w-full flex items-center gap-4 px-5 py-3 text-left border-b hairline group hover:bg-paper-2/60">
                  <span className="flex-1 min-w-0">
                    <span className="block font-display text-[17px] font-medium text-ink group-hover:text-accent transition-colors truncate">{t.title}</span>
                    <span className="block font-mono text-[10px] tracking-[0.14em] uppercase text-faint mt-0.5">{getCategoryById(t.category)?.title}</span>
                  </span>
                  <CornerDownLeft className="w-3.5 h-3.5 text-faint opacity-0 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          )}

          {facts.length > 0 && (
            <div className="border-t hairline">
              <div className="px-5 pt-4 pb-1 kicker">Facts</div>
              {facts.map((f) => (
                <button key={f.id} onClick={() => onOpenFact(f.id)} className="w-full flex items-start gap-4 px-5 py-3 text-left border-b hairline group hover:bg-paper-2/60">
                  <span className="flex-1 min-w-0">
                    <span className="block font-display text-[17px] font-medium text-ink group-hover:text-accent transition-colors truncate">{f.title}</span>
                    <span className="block font-body text-[13px] text-muted line-clamp-1 mt-0.5">{f.summary}</span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {empty && <div className="px-5 py-12 text-center font-body text-[15px] text-muted">No results for “{q}”. Try a broader term.</div>}
        </div>
      </div>
    </div>
  );
}
