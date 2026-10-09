import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X, CornerDownLeft, BookOpen, Zap } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]">
      <div className="absolute inset-0 bg-ink/25 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-surface border hairline rounded-2xl shadow-2xl overflow-hidden mt-fade">
        <div className="flex items-center gap-3 px-4 h-14 border-b hairline">
          <Search className="w-[18px] h-[18px] text-muted" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the catalogue and facts…"
            className="flex-1 bg-transparent outline-none text-[15px] text-ink placeholder:text-faint"
          />
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-muted hover:bg-paper-2">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-[52vh] overflow-y-auto">
          {q.trim().length <= 1 && (
            <div className="px-5 py-6 text-[13px] text-muted">
              Type to search across <strong className="text-ink font-semibold">237 entries</strong> and the Facts library.
              <div className="mt-3 flex flex-wrap gap-2">
                {['gaslighting', 'attachment', 'anchoring', 'cognitive biases', 'body language'].map((s) => (
                  <button key={s} onClick={() => setQ(s)} className="px-3 py-1 rounded-full border hairline text-[12px] text-ink-soft hover:border-line-strong">
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {topics.length > 0 && (
            <div className="py-2">
              <div className="px-5 pt-2 pb-1 kicker">Topics</div>
              {topics.map((t) => (
                <button
                  key={t.id}
                  onClick={() => onOpenTopic(t.id)}
                  className="w-full flex items-center gap-3 px-5 py-2.5 text-left hover:bg-paper-2/70 group"
                >
                  <BookOpen className="w-4 h-4 text-muted shrink-0" />
                  <span className="flex-1 min-w-0">
                    <span className="block text-[14px] font-medium text-ink truncate">{t.title}</span>
                    <span className="block text-[12px] text-muted truncate">
                      {getCategoryById(t.category)?.title}
                    </span>
                  </span>
                  <CornerDownLeft className="w-3.5 h-3.5 text-faint opacity-0 group-hover:opacity-100" />
                </button>
              ))}
            </div>
          )}

          {facts.length > 0 && (
            <div className="py-2 border-t hairline">
              <div className="px-5 pt-2 pb-1 kicker">Facts</div>
              {facts.map((f) => (
                <button
                  key={f.id}
                  onClick={() => onOpenFact(f.id)}
                  className="w-full flex items-start gap-3 px-5 py-2.5 text-left hover:bg-paper-2/70 group"
                >
                  <Zap className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span className="flex-1 min-w-0">
                    <span className="block text-[14px] font-medium text-ink truncate">{f.title}</span>
                    <span className="block text-[12px] text-muted line-clamp-1">{f.summary}</span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {empty && (
            <div className="px-5 py-10 text-center text-[13px] text-muted">
              No results for “{q}”. Try a broader term.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
