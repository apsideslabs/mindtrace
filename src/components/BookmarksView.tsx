import React from 'react';
import { ArrowRight, Bookmark } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto px-5 md:px-8 pt-8 pb-20">
      <header className="rule-red pt-6 pb-7">
        <div className="kicker kicker-accent mb-4">Your library</div>
        <h1 className="font-display text-[46px] sm:text-[56px] leading-[1] font-semibold tracking-tight text-ink">Saved Entries</h1>
        <p className="standfirst mt-5">
          {saved.length ? `${saved.length} entr${saved.length === 1 ? 'y' : 'ies'} set aside for later.` : 'Nothing saved yet.'}
        </p>
      </header>

      {saved.length > 0 ? (
        <div className="rule mt-8">
          {saved.map((t, i) => (
            <div key={t!.id} className="group flex items-start gap-4 py-4 border-b hairline">
              <span className="font-mono text-[12px] text-faint tnum w-7 pt-1.5 shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <button onClick={() => onOpenTopic(t!.id)} className="flex-1 text-left min-w-0">
                <h3 className="font-display text-[21px] font-medium text-ink group-hover:text-accent transition-colors">{t!.title}</h3>
                <p className="font-body mt-1.5 text-[14.5px] text-muted line-clamp-2 leading-relaxed">{t!.description}</p>
                <span className="mt-2 inline-block font-mono text-[10px] tracking-[0.14em] uppercase text-faint">{getCategoryById(t!.category)?.title}</span>
              </button>
              <button onClick={() => toggleBookmark(t!.id)} aria-label="Remove bookmark" className="p-2 text-accent hover:text-ink transition-colors">
                <Bookmark className="w-4 h-4 fill-current" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="border-y-2 border-ink/10 py-16 text-center flex flex-col items-center mt-8">
          <Bookmark className="w-6 h-6 text-faint mb-5" />
          <h3 className="font-display text-[24px] font-medium text-ink mb-2">No saved entries</h3>
          <p className="font-body text-[15px] text-muted max-w-xs leading-relaxed mb-6">
            Tap the bookmark icon on any entry and it will appear here.
          </p>
          <button onClick={() => go('explore')} className="btn btn-primary">
            Open the catalogue <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
