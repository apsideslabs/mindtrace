import React, { useState } from 'react';
import { ChevronRight, Trash2 } from 'lucide-react';
import { UserStats } from '../types';
import { getTopicCount } from '../content/content-index';

type Go = (screen: any) => void;

export function ProfileView({
  stats,
  go,
  clearStats,
}: {
  stats: UserStats;
  go: Go;
  clearStats: () => void;
}) {
  const [showSettings, setShowSettings] = useState(false);

  const total = getTopicCount();
  const read = stats.topicsRead.length;
  const pct = total ? Math.round((read / total) * 100) : 0;

  const rank =
    read >= 100 ? 'Scholar' : read >= 50 ? 'Master' : read >= 20 ? 'Advanced' : read >= 5 ? 'Intermediate' : 'Beginner';

  const stats3 = [
    { label: 'Entries read', value: read },
    { label: 'Saved', value: stats.bookmarkedTopics.length },
    { label: 'Minutes read', value: stats.readingTimeMinutes || Math.floor(read * 4) },
  ];

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 pt-8 pb-20">
      <header className="rule-red pt-6 pb-7">
        <div className="kicker kicker-accent mb-4">Reader</div>
        <h1 className="font-display text-[46px] sm:text-[56px] leading-[1] font-semibold tracking-tight text-ink">{rank}</h1>
        <p className="standfirst mt-5">Your reading record. Everything is stored locally on this device.</p>
      </header>

      <section className="grid grid-cols-3 border-b hairline mt-8">
        {stats3.map((s, i) => (
          <div key={s.label} className={`py-7 ${i > 0 ? 'border-l hairline pl-6' : ''}`}>
            <div className="font-display text-[44px] sm:text-[56px] leading-none font-semibold text-ink tnum">{s.value}</div>
            <div className="kicker mt-3">{s.label}</div>
          </div>
        ))}
      </section>

      <section className="mt-10">
        <div className="flex items-baseline justify-between mb-3">
          <span className="kicker">Library progress</span>
          <span className="font-mono text-[12px] text-ink tnum">{read} / {total} · {pct}%</span>
        </div>
        <div className="h-[3px] w-full bg-line">
          <div className="h-full bg-accent transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </section>

      <section className="mt-12 rule">
        <button onClick={() => go('bookmarks')} className="w-full flex items-center justify-between py-5 border-b hairline group">
          <span>
            <span className="block font-display text-[20px] font-medium text-ink group-hover:text-accent transition-colors">Saved entries</span>
            <span className="block font-body text-[14px] text-muted mt-0.5">Your bookmarked readings</span>
          </span>
          <ChevronRight className="w-5 h-5 text-faint group-hover:text-accent transition-colors" />
        </button>

        <button onClick={() => setShowSettings((v) => !v)} className="w-full flex items-center justify-between py-5 border-b hairline group">
          <span>
            <span className="block font-display text-[20px] font-medium text-ink group-hover:text-accent transition-colors">Data &amp; privacy</span>
            <span className="block font-body text-[14px] text-muted mt-0.5">Stored locally, never uploaded</span>
          </span>
          <ChevronRight className={`w-5 h-5 text-faint transition-transform ${showSettings ? 'rotate-90' : ''}`} />
        </button>

        {showSettings && (
          <div className="py-5 border-b hairline flex items-center justify-between mt-fade">
            <span>
              <span className="block font-body text-[15px] text-ink">Clear local data</span>
              <span className="block font-body text-[13px] text-muted mt-0.5">Removes reading history and bookmarks</span>
            </span>
            <button
              onClick={() => { if (confirm('Clear all reading data and bookmarks? This cannot be undone.')) clearStats(); }}
              className="btn btn-ghost text-accent border-accent/40"
            >
              <Trash2 className="w-4 h-4" /> Clear
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
