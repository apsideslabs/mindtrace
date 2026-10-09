import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { CategoryId, TopicId } from '../types';
import { getAllCategories, getTopicsByCategory, searchTopics, getTopicCount, getCategoryById } from '../content/content-index';

export function ExploreView({
  onOpenCategory,
  onOpenTopic,
}: {
  onOpenCategory: (id: CategoryId) => void;
  onOpenTopic: (id: TopicId) => void;
  onOpenFact?: (id: string) => void;
}) {
  const [q, setQ] = useState('');
  const categories = getAllCategories();
  const results = useMemo(() => (q.trim().length > 1 ? searchTopics(q).slice(0, 40) : []), [q]);

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 pt-8 pb-20">
      <header className="rule-red pt-6 mb-2">
        <div className="kicker kicker-accent mb-4">Contents</div>
        <h1 className="font-display text-[46px] sm:text-[60px] leading-[1] font-semibold tracking-tight text-ink">
          The Catalogue
        </h1>
        <p className="standfirst mt-5 max-w-2xl">
          {getTopicCount()} entries, arranged in {categories.length} modules. Search the whole library, or read a module from the top.
        </p>
        <div className="relative mt-6 max-w-md">
          <Search className="w-4 h-4 text-muted absolute left-0 top-1/2 -translate-y-1/2" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the catalogue…"
            className="w-full bg-transparent border-b border-line-strong pl-7 pr-2 py-3 text-[15px] font-body text-ink placeholder:text-faint outline-none focus:border-accent transition-colors"
          />
        </div>
      </header>

      {q.trim().length > 1 ? (
        <section className="mt-10">
          <div className="kicker mb-3">{results.length} result{results.length === 1 ? '' : 's'}</div>
          <div className="rule">
            {results.map((t) => (
              <button key={t.id} onClick={() => onOpenTopic(t.id)} className="w-full flex items-baseline gap-4 py-4 text-left border-b hairline group">
                <span className="flex-1 min-w-0">
                  <span className="block font-display text-[19px] font-medium text-ink group-hover:text-accent transition-colors">
                    {t.title}
                  </span>
                  <span className="block font-body text-[14px] text-muted line-clamp-1 mt-0.5">{t.description}</span>
                </span>
                <span className="hidden sm:block font-mono text-[10px] tracking-[0.14em] uppercase text-faint shrink-0">
                  {getCategoryById(t.category)?.title}
                </span>
              </button>
            ))}
            {results.length === 0 && <p className="font-body text-muted text-[15px] py-10">No entries match “{q}”.</p>}
          </div>
        </section>
      ) : (
        <section className="mt-12 rule">
          {categories.map((c, i) => {
            const count = getTopicsByCategory(c.id).length;
            return (
              <button key={c.id} onClick={() => onOpenCategory(c.id)} className="group w-full grid grid-cols-[2.5rem_1fr_auto] md:grid-cols-[3rem_14rem_1fr_auto] gap-x-8 items-baseline py-5 text-left border-b hairline hover:bg-surface/60 transition-colors">
                <span className="font-mono text-[13px] text-accent tnum">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-display text-[22px] font-medium text-ink group-hover:text-accent transition-colors leading-snug">
                  {c.title}
                </span>
                <span className="hidden md:block font-body text-[14.5px] text-muted leading-relaxed">{c.description}</span>
                <span className="font-mono text-[11px] text-faint tnum whitespace-nowrap justify-self-end">{count} entries</span>
              </button>
            );
          })}
        </section>
      )}
    </div>
  );
}
