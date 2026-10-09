import React, { useMemo, useState } from 'react';
import { Quote as QuoteIcon } from 'lucide-react';
import { QUOTES, quoteCategories } from '../content/quotes';

export function QuotesView() {
  const [active, setActive] = useState<string>('all');
  const list = useMemo(
    () => (active === 'all' ? QUOTES : QUOTES.filter((q) => q.category === active)),
    [active],
  );

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 pt-12 pb-24">
      <header className="border-b-2 border-ink/10 pb-8 mb-8">
        <div className="kicker mb-3">On the mind</div>
        <h1 className="font-display text-[40px] sm:text-[50px] font-semibold text-ink flex items-center gap-4">
          Quotes
        </h1>
        <p className="font-body mt-4 text-[18px] text-ink-soft max-w-2xl leading-relaxed">
          Lines worth keeping — from psychology, philosophy, leadership and the study of human nature.
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-10">
        <button
          onClick={() => setActive('all')}
          className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold uppercase tracking-wider border transition-colors ${
            active === 'all' ? 'bg-ink text-paper border-ink' : 'border-line text-muted hover:border-line-strong hover:text-ink'
          }`}
        >
          All
        </button>
        {quoteCategories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActive(c.id)}
            className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold uppercase tracking-wider border transition-colors ${
              active === c.id ? 'bg-ink text-paper border-ink' : 'border-line text-muted hover:border-line-strong hover:text-ink'
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      <div className="columns-1 md:columns-2 gap-5">
        {list.map((q) => (
          <figure key={q.id} className="card p-7 mb-5 break-inside-avoid">
            <QuoteIcon className="w-5 h-5 text-gold/60 mb-3" />
            <blockquote className="font-body text-[19px] leading-relaxed text-ink">{q.text}</blockquote>
            <figcaption className="mt-5 pt-4 border-t hairline text-[11.5px] font-semibold uppercase tracking-[0.14em] text-muted">
              {q.author}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
