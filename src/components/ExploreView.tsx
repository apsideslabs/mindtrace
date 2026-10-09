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
    <div className="max-w-5xl mx-auto px-5 md:px-8 pt-12 pb-24">
      <header className="mb-10">
        <div className="kicker mb-3">The catalogue</div>
        <h1 className="font-display text-[40px] sm:text-[50px] leading-tight font-semibold text-ink">
          Every entry, in one place.
        </h1>
        <p className="font-body mt-4 text-[18px] text-ink-soft max-w-2xl leading-relaxed">
          {getTopicCount()} entries organised into {categories.length} modules. Search directly, or browse a theme.
        </p>
        <div className="relative mt-8 max-w-md">
          <Search className="w-4 h-4 text-muted absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the catalogue…"
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
                    <span className="block font-display text-[18px] font-semibold text-ink group-hover:text-accent transition-colors">
                      {t.title}
                    </span>
                    <span className="block font-body text-[13.5px] text-muted line-clamp-1 mt-0.5">{t.description}</span>
                  </span>
                  <span className="hidden sm:block text-[11px] uppercase tracking-wider text-faint shrink-0">{getCategoryById(t.category)?.title}</span>
                  <ArrowRight className="w-4 h-4 text-faint group-hover:text-accent transition-colors shrink-0" />
                </button>
              ))}
            </div>
          ) : (
            <p className="font-body text-muted text-[15px] py-10">No entries match “{q}”.</p>
          )}
        </section>
      ) : (
        <section className="border-t hairline">
          {categories.map((c, i) => {
            const Icon = getCategoryIcon(c.iconName);
            const count = getTopicsByCategory(c.id).length;
            const accent = CATEGORY_ACCENT[c.id] ?? '#17140f';
            return (
              <button
                key={c.id}
                onClick={() => onOpenCategory(c.id)}
                className="group w-full flex items-start gap-5 py-6 text-left border-b hairline hover:bg-surface/60 transition-colors px-1"
              >
                <span className="font-mono text-[13px] text-faint w-7 pt-1 shrink-0 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <span className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${accent}14`, color: accent }}>
                  <Icon className="w-[21px] h-[21px]" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-display text-[21px] font-semibold text-ink group-hover:text-accent transition-colors">{c.title}</span>
                  <span className="block font-body text-[14.5px] text-muted leading-relaxed mt-1 max-w-2xl">{c.description}</span>
                </span>
                <span className="hidden sm:flex flex-col items-end shrink-0 pt-1">
                  <span className="font-display text-[20px] font-semibold text-ink tabular-nums">{count}</span>
                  <span className="text-[10px] uppercase tracking-wider text-faint">entries</span>
                </span>
                <ArrowRight className="w-4 h-4 text-faint group-hover:text-accent transition-colors shrink-0 mt-2" />
              </button>
            );
          })}
        </section>
      )}
    </div>
  );
}
