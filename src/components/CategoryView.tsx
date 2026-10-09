import React, { useState } from 'react';
import { ArrowLeft, Bookmark, Check, Search } from 'lucide-react';
import { CategoryId, TopicId, UserStats } from '../types';
import { getCategoryById, getTopicsByCategory, getAllCategories } from '../content/content-index';

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
    <div className="max-w-4xl mx-auto px-5 md:px-8 pt-6 pb-20">
      <button onClick={onBack} className="flex items-center gap-2 font-mono text-[10.5px] tracking-[0.16em] uppercase text-muted hover:text-accent transition-colors mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> The Catalogue
      </button>

      <header className="rule-red pt-6 pb-7">
        <div className="flex items-baseline gap-4 mb-4">
          <span className="font-mono text-[12px] text-accent tnum">Module {String(moduleNo).padStart(2, '0')}</span>
          <span className="flex-1 h-px bg-line" />
          <span className="font-mono text-[11px] text-faint tnum">{readCount}/{topics.length} read</span>
        </div>
        <h1 className="font-display text-[42px] sm:text-[52px] leading-[1.02] font-semibold tracking-tight text-ink">{category.title}</h1>
        <p className="standfirst mt-4 max-w-2xl">{category.description}</p>
        <div className="mt-6 h-[3px] w-full bg-line">
          <div className="h-full bg-accent transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </header>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4 mt-8">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-muted absolute left-0 top-1/2 -translate-y-1/2" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${topics.length} entries…`}
            className="w-full bg-transparent border-b border-line pl-7 pr-2 py-2 text-[14px] font-body text-ink placeholder:text-faint outline-none focus:border-accent transition-colors"
          />
        </div>
        <div className="flex items-center gap-2">
          {filters.map((f) => (
            <button key={f.key} onClick={() => setFilter(f.key)} className={`chip ${filter === f.key ? 'chip-active' : ''}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rule">
        {shown.map((t, i) => {
          const isRead = stats.topicsRead.includes(t.id);
          const isSaved = stats.bookmarkedTopics.includes(t.id);
          return (
            <div key={t.id} className="group flex items-start gap-4 py-4 border-b hairline">
              <span className="font-mono text-[12px] text-faint tnum w-7 pt-1.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <button onClick={() => onOpenTopic(t.id)} className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-2.5">
                  <h3 className={`font-display text-[21px] font-medium leading-snug transition-colors ${isRead ? 'text-muted' : 'text-ink group-hover:text-accent'}`}>
                    {t.title}
                  </h3>
                  {isRead && <Check className="w-4 h-4 text-accent shrink-0" />}
                </div>
                <p className="font-body mt-1.5 text-[14.5px] text-muted leading-relaxed line-clamp-2 max-w-2xl">{t.description}</p>
                <span className="mt-2 inline-block font-mono text-[10px] tracking-[0.14em] uppercase text-faint">{t.readTime} min</span>
              </button>
              <button
                onClick={() => toggleBookmark(t.id)}
                aria-label="Bookmark"
                className={`mt-1 p-2 transition-colors ${isSaved ? 'text-accent' : 'text-faint hover:text-ink'}`}
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
