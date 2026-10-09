import React, { useMemo, useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { CategoryId, TopicId } from '../types';
import { getAllCategories, getTopicsByCategory, searchTopics, CATEGORY_ACCENT, getTopicCount, getCategoryById } from '../content/content-index';
import { getCategoryIcon } from '../utils/icons';

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
    <div className="max-w-6xl mx-auto px-5 md:px-8 pt-12 pb-24">
      <header className="mb-10">
        <div className="kicker mb-3">The library</div>
        <h1 className="font-display text-[38px] sm:text-[46px] leading-tight font-semibold text-ink">
          Every concept, in one place.
        </h1>
        <p className="mt-4 text-[16px] text-ink-soft max-w-2xl leading-relaxed">
          {getTopicCount()} topics organised into {categories.length} modules. Search directly, or start from a theme.
        </p>
        <div className="relative mt-7 max-w-md">
          <Search className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the library…"
            className="w-full bg-surface border hairline rounded-full pl-11 pr-4 py-3 text-[14px] text-ink placeholder:text-faint outline-none focus:border-line-strong transition-colors"
          />
        </div>
      </header>

      {q.trim().length > 1 ? (
        <section>
          <div className="kicker mb-4">{results.length} result{results.length === 1 ? '' : 's'}</div>
          {results.length ? (
            <div className="divide-y divide-line border-y hairline">
              {results.map((t) => (
                <button key={t.id} onClick={() => onOpenTopic(t.id)} className="w-full flex items-center gap-4 py-4 text-left group">
                  <span className="flex-1 min-w-0">
                    <span className="block font-display text-[17px] font-semibold text-ink group-hover:text-accent transition-colors">
                      {t.title}
                    </span>
                    <span className="block text-[13px] text-muted line-clamp-1 mt-0.5">{t.description}</span>
                  </span>
                  <span className="hidden sm:block text-[12px] text-faint shrink-0">{getCategoryById(t.category)?.title}</span>
                  <ArrowRight className="w-4 h-4 text-faint group-hover:text-accent transition-colors shrink-0" />
                </button>
              ))}
            </div>
          ) : (
            <p className="text-muted text-[14px] py-10">No topics match “{q}”.</p>
          )}
        </section>
      ) : (
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.map((c) => {
            const Icon = getCategoryIcon(c.iconName);
            const count = getTopicsByCategory(c.id).length;
            const accent = CATEGORY_ACCENT[c.id] ?? '#14120f';
            return (
              <button key={c.id} onClick={() => onOpenCategory(c.id)} className="card p-6 text-left group flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <span className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}14`, color: accent }}>
                    <Icon className="w-5 h-5" />
                  </span>
                  <span className="text-[11px] font-semibold text-muted tabular-nums">{count} topics</span>
                </div>
                <h3 className="font-display text-[19px] font-semibold text-ink group-hover:text-accent transition-colors">{c.title}</h3>
                <p className="mt-1.5 text-[13px] text-muted leading-relaxed flex-1">{c.description}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-ink-soft group-hover:text-accent transition-colors">
                  Open <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </button>
            );
          })}
        </section>
      )}
    </div>
  );
}
