import React, { useMemo, useState } from 'react';
import { QUOTES, quoteCategories } from '../content/quotes';

export function QuotesView() {
  const [active, setActive] = useState<string>('all');
  const list = useMemo(
    () => (active === 'all' ? QUOTES : QUOTES.filter((q) => q.category === active)),
    [active],
  );

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 pt-12 pb-24">
      <header className="mb-10">
        <div className="kicker mb-3">On the mind</div>
        <h1 className="font-display text-[36px] sm:text-[44px] font-semibold text-ink">Quotes</h1>
        <p className="mt-3 text-[16px] text-ink-soft max-w-2xl leading-relaxed">
          Lines worth keeping — from psychology, philosophy, leadership and the study of human nature.
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setActive('all')}
          className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-medium border transition-colors ${
            active === 'all' ? 'bg-ink text-paper border-ink' : 'border-line text-ink-soft hover:border-line-strong'
          }`}
        >
          All
        </button>
        {quoteCategories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-medium border transition-colors ${
              active === c.id ? 'bg-ink text-paper border-ink' : 'border-line text-ink-soft hover:border-line-strong'
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      <div className="columns-1 md:columns-2 gap-4 [column-fill:_balance]">
        {list.map((q) => (
          <figure key={q.id} className="card p-6 mb-4 break-inside-avoid">
            <blockquote className="font-display text-[19px] leading-snug text-ink">“{q.text}”</blockquote>
            <figcaption className="mt-4 text-[12.5px] font-semibold uppercase tracking-wider text-muted">
              {q.author}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
