import React from 'react';
import { Bookmark, ArrowRight, BookOpen } from 'lucide-react';
import { TopicId, UserStats } from '../types';
import { getTopicById, getCategoryById } from '../content/content-index';

type Go = (screen: any) => void;

export function BookmarksView({
  stats,
  toggleBookmark,
  onOpenTopic,
  go,
}: {
  stats: UserStats;
  toggleBookmark: (id: TopicId) => void;
  onOpenTopic: (id: TopicId) => void;
  go: Go;
}) {
  const saved = stats.bookmarkedTopics.map((id) => getTopicById(id)).filter(Boolean);

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 pt-12 pb-24">
      <header className="mb-10">
        <div className="kicker mb-3">Your library</div>
        <h1 className="font-display text-[36px] sm:text-[42px] font-semibold text-ink">Saved readings</h1>
        <p className="mt-3 text-[16px] text-ink-soft">
          {saved.length ? `${saved.length} topic${saved.length === 1 ? '' : 's'} set aside for later.` : 'Nothing saved yet.'}
        </p>
      </header>

      {saved.length > 0 ? (
        <div className="divide-y divide-line border-t hairline">
          {saved.map((t) => (
            <div key={t!.id} className="group flex items-center gap-4 py-5">
              <button onClick={() => onOpenTopic(t!.id)} className="flex-1 text-left min-w-0">
                <h3 className="font-display text-[18px] font-semibold text-ink group-hover:text-accent transition-colors">{t!.title}</h3>
                <p className="mt-1 text-[13.5px] text-muted line-clamp-2 leading-relaxed">{t!.description}</p>
                <span className="mt-1.5 inline-block text-[12px] text-faint">{getCategoryById(t!.category)?.title}</span>
              </button>
              <button
                onClick={() => toggleBookmark(t!.id)}
                aria-label="Remove bookmark"
                className="p-2 rounded-full text-accent hover:text-ink transition-colors"
              >
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="card p-12 text-center flex flex-col items-center">
          <span className="w-14 h-14 rounded-full bg-paper-2 flex items-center justify-center mb-4">
            <Bookmark className="w-6 h-6 text-muted" />
          </span>
          <h3 className="font-display text-[19px] font-semibold text-ink mb-1.5">No saved topics</h3>
          <p className="text-[14px] text-muted max-w-xs leading-relaxed mb-6">
            Tap the bookmark icon on any topic and it will appear here.
          </p>
          <button onClick={() => go('explore')} className="btn btn-primary">
            Browse the library <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
