import React, { useState } from 'react';
import { BookOpen, Bookmark, Clock, ChevronRight, Trash2, ShieldCheck } from 'lucide-react';
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
    { label: 'Entries read', value: read, icon: BookOpen },
    { label: 'Saved', value: stats.bookmarkedTopics.length, icon: Bookmark },
    { label: 'Minutes read', value: stats.readingTimeMinutes || Math.floor(read * 4), icon: Clock },
  ];

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 pt-12 pb-24">
      <header className="flex items-center gap-5 mb-12">
        <div className="w-16 h-16 rounded-2xl bg-ink flex items-center justify-center shrink-0">
          <span className="font-display text-[22px] font-semibold text-paper">{rank[0]}</span>
        </div>
        <div>
          <h1 className="font-display text-[34px] font-semibold text-ink">Your profile</h1>
          <p className="text-[14px] text-muted flex items-center gap-1.5 mt-0.5">
            <ShieldCheck className="w-4 h-4 text-good" /> {rank} reader · data stays on this device
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {stats3.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="kicker">{s.label}</span>
                <Icon className="w-[18px] h-[18px] text-accent" />
              </div>
              <div className="font-display text-[38px] font-semibold text-ink tabular-nums leading-none">{s.value}</div>
            </div>
          );
        })}
      </div>

      <section className="card p-6 mb-8">
        <div className="flex items-center justify-between mb-3">
          <span className="kicker">Library progress</span>
          <span className="text-[13px] font-semibold text-ink tabular-nums">{read} / {total} · {pct}%</span>
        </div>
        <div className="h-1.5 rounded-full bg-paper-2 overflow-hidden">
          <div className="h-full bg-accent rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
      </section>

      <div className="space-y-3">
        <button onClick={() => go('bookmarks')} className="card w-full p-5 flex items-center justify-between group">
          <span className="flex items-center gap-4">
            <span className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center">
              <Bookmark className="w-5 h-5 text-accent" />
            </span>
            <span className="text-left">
              <span className="block font-display text-[16px] font-semibold text-ink">Saved readings</span>
              <span className="block text-[13px] text-muted mt-0.5">Your bookmarked topics</span>
            </span>
          </span>
          <ChevronRight className="w-5 h-5 text-muted group-hover:text-ink transition-colors" />
        </button>

        <button onClick={() => setShowSettings((v) => !v)} className="card w-full p-5 flex items-center justify-between group">
          <span className="flex items-center gap-4">
            <span className="w-10 h-10 rounded-xl bg-paper-2 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-ink-soft" />
            </span>
            <span className="text-left">
              <span className="block font-display text-[16px] font-semibold text-ink">Data & privacy</span>
              <span className="block text-[13px] text-muted mt-0.5">Stored locally, never uploaded</span>
            </span>
          </span>
          <ChevronRight className={`w-5 h-5 text-muted transition-transform ${showSettings ? 'rotate-90' : ''}`} />
        </button>

        {showSettings && (
          <div className="card p-5 mt-fade">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[14px] font-medium text-ink">Clear local data</div>
                <div className="text-[12.5px] text-muted">Removes reading history and bookmarks</div>
              </div>
              <button
                onClick={() => {
                  if (confirm('Clear all reading data and bookmarks? This cannot be undone.')) clearStats();
                }}
                className="btn btn-ghost text-bad border-bad/30 hover:bg-accent-soft"
              >
                <Trash2 className="w-4 h-4" /> Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
