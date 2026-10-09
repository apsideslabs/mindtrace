import React, { useMemo, useState } from 'react';
import { QUOTES, quoteCategories } from '../content/quotes';

export function QuotesView() {
  const [active, setActive] = useState<string>('all');
  const list = useMemo(
    () => (active === 'all' ? QUOTES : QUOTES.filter((q) => q.category === active)),
    [active],
  );

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 pt-8 pb-20">
      <header className="rule-red pt-6 pb-7">
        <div className="kicker kicker-accent mb-4">On the mind</div>
        <h1 className="font-display text-[46px] sm:text-[58px] leading-[1] font-semibold tracking-tight text-ink">Quotes</h1>
        <p className="standfirst mt-5 max-w-2xl">
          Lines worth keeping — from psychology, philosophy, leadership and the study of human nature.
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-8 mt-6">
        <button onClick={() => setActive('all')} className={`chip ${active === 'all' ? 'chip-active' : ''}`}>All</button>
        {quoteCategories.map((c) => (
          <button key={c.id} onClick={() => setActive(c.id)} className={`chip ${active === c.id ? 'chip-active' : ''}`}>{c.title}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-x-12">
        {list.map((q) => (
          <figure key={q.id} className="border-t hairline pt-5 pb-7 break-inside-avoid">
            <blockquote className="font-body text-[20px] leading-[1.55] text-ink">{q.text}</blockquote>
            <figcaption className="mt-4 font-mono text-[10.5px] tracking-[0.18em] uppercase text-accent">
              {q.author}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
