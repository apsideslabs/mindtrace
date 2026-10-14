import React, { useMemo, useState } from 'react';
import { Share2 } from 'lucide-react';
import { QUOTES, quoteCategories } from '../content/quotes';
import { Quote } from '../types';
import { ShareCardModal } from './ShareCardModal';
import { slugify } from '../share/card';

/** One hue per quote theme, matching the module palette. */
const QUOTE_ACCENT: Record<string, string> = {
  psychology: '#6a5a9e',
  philosophy: '#3a5ba0',
  'human-nature': '#b07a2a',
  leadership: '#2f6e7a',
  success: '#4e7a3a',
  motivation: '#b23a2a',
};
const accentFor = (c: string) => QUOTE_ACCENT[c] ?? '#b23a2a';
const labelFor = (c: string) => quoteCategories.find((x) => x.id === c)?.title ?? 'Quote';

const PAGE = 60;

export function QuotesView() {
  const [active, setActive] = useState<string>('all');
  const [limit, setLimit] = useState(PAGE);
  const [sharing, setSharing] = useState<Quote | null>(null);

  const list = useMemo(
    () => (active === 'all' ? QUOTES : QUOTES.filter((q) => q.category === active)),
    [active],
  );
  const shown = list.slice(0, limit);

  const pick = (id: string) => {
    setActive(id);
    setLimit(PAGE);
  };

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 pt-12 pb-24">
      <header className="mb-10">
        <div className="kicker mb-3">On the mind</div>
        <h1 className="font-display text-[36px] sm:text-[44px] font-semibold text-ink">Quotes</h1>
        <p className="mt-3 text-[16px] text-ink-soft max-w-2xl leading-relaxed">
          {QUOTES.length} lines worth keeping — from psychology, philosophy, leadership and the study of
          human nature. Each one is attributed to a source you can check.
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => pick('all')}
          className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-medium border transition-colors ${
            active === 'all' ? 'bg-ink text-paper border-ink' : 'border-line text-ink-soft hover:border-line-strong'
          }`}
        >
          All
        </button>
        {quoteCategories.map((c) => (
          <button
            key={c.id}
            onClick={() => pick(c.id)}
            className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-medium border transition-colors ${
              active === c.id ? 'bg-ink text-paper border-ink' : 'border-line text-ink-soft hover:border-line-strong'
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      <div className="columns-1 md:columns-2 gap-4 [column-fill:_balance]">
        {shown.map((q) => (
          <figure key={q.id} className="card p-6 mb-4 break-inside-avoid group">
            <blockquote className="font-display text-[19px] leading-snug text-ink">“{q.text}”</blockquote>
            <figcaption className="mt-4 flex items-end justify-between gap-3">
              <span className="text-[12.5px] font-semibold uppercase tracking-wider text-muted">
                {q.author}
                {q.source && (
                  <span className="mt-1 block text-[11.5px] font-normal normal-case tracking-normal text-faint">
                    {q.source}
                  </span>
                )}
              </span>
              <button
                onClick={() => setSharing(q)}
                className="shrink-0 p-2 rounded-full text-muted hover:text-ink transition-colors opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
                aria-label={`Make a card from this quote by ${q.author}`}
                title="Make a card"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </figcaption>
          </figure>
        ))}
      </div>

      {list.length > limit && (
        <div className="mt-8 flex justify-center">
          <button onClick={() => setLimit((n) => n + PAGE)} className="btn btn-ghost">
            Show {Math.min(PAGE, list.length - limit)} more
          </button>
        </div>
      )}

      {sharing && (
        <ShareCardModal
          content={{
            eyebrow: labelFor(sharing.category),
            body: sharing.text,
            meta: sharing.author,
            source: sharing.source,
            accent: accentFor(sharing.category),
          }}
          filename={`mindtrace-quote-${slugify(sharing.author)}.png`}
          onClose={() => setSharing(null)}
          initialDesign="plate"
        />
      )}
    </div>
  );
}
