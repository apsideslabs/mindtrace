import React, { useState } from 'react';
import { ArrowLeft, Bookmark, Clock, Check, Search } from 'lucide-react';
import { CategoryId, TopicId, UserStats } from '../types';
import { getCategoryById, getTopicsByCategory, getAllCategories, CATEGORY_ACCENT } from '../content/content-index';
import { getCategoryIcon } from '../utils/icons';

type Filter = 'all' | 'unread' | 'read' | 'saved';

export function CategoryView({
  categoryId,
  onBack,
  onOpenTopic,
  stats,
  toggleBookmark,
}: {
  categoryId: CategoryId;
  onBack: () => void;
  onOpenTopic: (id: TopicId) => void;
  stats: UserStats;
  toggleBookmark: (id: TopicId) => void;
}) {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const category = getCategoryById(categoryId);
  const topics = getTopicsByCategory(categoryId);
  if (!category) return null;

  const accent = CATEGORY_ACCENT[category.id] ?? '#17140f';
  const Icon = getCategoryIcon(category.iconName);
  const moduleNo = getAllCategories().findIndex((c) => c.id === category.id) + 1;
  const readCount = topics.filter((t) => stats.topicsRead.includes(t.id)).length;
  const pct = topics.length ? Math.round((readCount / topics.length) * 100) : 0;

  const shown = topics.filter((t) => {
    const hay = `${t.title} ${t.description}`.toLowerCase();
    if (q && !hay.includes(q.toLowerCase())) return false;
    const isRead = stats.topicsRead.includes(t.id);
    if (filter === 'unread') return !isRead;
    if (filter === 'read') return isRead;
    if (filter === 'saved') return stats.bookmarkedTopics.includes(t.id);
    return true;
  });

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'unread', label: 'Unread' },
    { key: 'read', label: 'Read' },
    { key: 'saved', label: 'Saved' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 pt-8 pb-24">
      <button onClick={onBack} className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted hover:text-ink transition-colors mb-10">
        <ArrowLeft className="w-4 h-4" /> The catalogue
      </button>

      <header className="border-b-2 border-ink/10 pb-8 mb-8">
        <div className="flex items-center gap-3 mb-5">
          <span className="font-mono text-[12px] text-faint tabular-nums">Module {String(moduleNo).padStart(2, '0')}</span>
          <span className="h-px w-8 bg-line-strong" />
          <span className="text-[11px] uppercase tracking-[0.14em] text-muted">{topics.length} entries</span>
        </div>
        <div className="flex items-start gap-5">
          <span className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0" style={{ background: `${accent}14`, color: accent }}>
            <Icon className="w-7 h-7" />
          </span>
          <div className="flex-1">
            <h1 className="font-display text-[36px] sm:text-[44px] leading-[1.05] font-semibold text-ink">{category.title}</h1>
            <p className="font-body mt-3 text-[17px] text-ink-soft max-w-2xl leading-relaxed">{category.description}</p>
          </div>
        </div>
        <div className="mt-7 flex items-center gap-4">
          <div className="flex-1 h-1 rounded-full bg-paper-2 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: accent }} />
          </div>
          <span className="text-[12px] text-muted tabular-nums shrink-0">{readCount}/{topics.length} read</span>
        </div>
      </header>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${topics.length} entries…`}
            className="w-full bg-surface border hairline rounded-full pl-10 pr-4 py-2.5 text-[13.5px] text-ink placeholder:text-faint outline-none focus:border-line-strong transition-colors"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold uppercase tracking-wider border transition-colors ${
                filter === f.key ? 'bg-ink text-paper border-ink' : 'border-line text-muted hover:border-line-strong hover:text-ink'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t hairline">
        {shown.map((t, i) => {
          const isRead = stats.topicsRead.includes(t.id);
          const isSaved = stats.bookmarkedTopics.includes(t.id);
          return (
            <div key={t.id} className="group flex items-start gap-4 py-5 border-b hairline">
              <span className="font-mono text-[12px] text-faint w-7 pt-1 shrink-0 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <button onClick={() => onOpenTopic(t.id)} className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className={`font-display text-[19px] font-semibold transition-colors ${isRead ? 'text-muted' : 'text-ink group-hover:text-accent'}`}>
                    {t.title}
                  </h3>
                  {isRead && <Check className="w-4 h-4 text-good shrink-0" />}
                </div>
                <p className="font-body mt-1 text-[14px] text-muted leading-relaxed line-clamp-2">{t.description}</p>
                <span className="mt-2 inline-flex items-center gap-1.5 text-[11.5px] text-faint uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5" /> {t.readTime} min
                </span>
              </button>
              <button
                onClick={() => toggleBookmark(t.id)}
                aria-label="Bookmark"
                className={`mt-1 p-2 rounded-full transition-colors ${isSaved ? 'text-accent' : 'text-faint hover:text-ink'}`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
              </button>
            </div>
          );
        })}
        {shown.length === 0 && <p className="py-12 text-center font-body text-[15px] text-muted">Nothing here yet.</p>}
      </div>
    </div>
  );
}
