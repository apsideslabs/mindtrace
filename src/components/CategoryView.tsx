import React, { useState } from 'react';
import { ArrowLeft, Bookmark, Clock, Check, Search } from 'lucide-react';
import { CategoryId, TopicId, UserStats } from '../types';
import { getCategoryById, getTopicsByCategory, CATEGORY_ACCENT } from '../content/content-index';
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

  const accent = CATEGORY_ACCENT[category.id] ?? '#14120f';
  const Icon = getCategoryIcon(category.iconName);
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
    <div className="max-w-5xl mx-auto px-5 md:px-8 pt-8 pb-24">
      <button onClick={onBack} className="flex items-center gap-2 text-[13px] font-medium text-muted hover:text-ink transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to library
      </button>

      <header className="border-b hairline pb-8 mb-8">
        <div className="flex items-start justify-between gap-6">
          <div>
            <span className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5" style={{ background: `${accent}14`, color: accent }}>
              <Icon className="w-6 h-6" />
            </span>
            <h1 className="font-display text-[36px] sm:text-[42px] leading-tight font-semibold text-ink">{category.title}</h1>
            <p className="mt-3 text-[16px] text-ink-soft max-w-2xl leading-relaxed">{category.description}</p>
          </div>
          <div className="hidden sm:block text-right shrink-0">
            <div className="font-display text-[34px] font-semibold text-ink tabular-nums">{readCount}<span className="text-faint text-[20px]">/{topics.length}</span></div>
            <div className="kicker">read</div>
          </div>
        </div>
        <div className="mt-6 h-1 rounded-full bg-paper-2 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: accent }} />
        </div>
      </header>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={`Search ${topics.length} topics…`}
            className="w-full bg-surface border hairline rounded-full pl-10 pr-4 py-2.5 text-[13.5px] text-ink placeholder:text-faint outline-none focus:border-line-strong transition-colors"
          />
        </div>
        <div className="flex items-center gap-1.5">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-medium border transition-colors ${
                filter === f.key ? 'bg-ink text-paper border-ink' : 'border-line text-ink-soft hover:border-line-strong'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="divide-y divide-line border-t hairline">
        {shown.map((t) => {
          const isRead = stats.topicsRead.includes(t.id);
          const isSaved = stats.bookmarkedTopics.includes(t.id);
          return (
            <div key={t.id} className="group flex items-start gap-4 py-5">
              <button onClick={() => onOpenTopic(t.id)} className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className={`font-display text-[18px] font-semibold transition-colors ${isRead ? 'text-muted' : 'text-ink group-hover:text-accent'}`}>
                    {t.title}
                  </h3>
                  {isRead && <Check className="w-4 h-4 text-good shrink-0" />}
                </div>
                <p className="mt-1 text-[13.5px] text-muted leading-relaxed line-clamp-2">{t.description}</p>
                <span className="mt-2 inline-flex items-center gap-1.5 text-[12px] text-faint">
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
        {shown.length === 0 && <p className="py-12 text-center text-[14px] text-muted">Nothing here yet.</p>}
      </div>
    </div>
  );
}
