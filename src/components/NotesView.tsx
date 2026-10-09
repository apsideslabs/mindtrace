import React, { useMemo } from 'react';
import { ArrowRight, Trash2, Download, StickyNote } from 'lucide-react';
import { Note, TopicId } from '../types';
import { getTopicById, getCategoryById } from '../content/content-index';

type Go = (screen: any) => void;

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function NotesView({
  notes,
  removeNote,
  onOpenTopic,
  go,
}: {
  notes: Note[];
  removeNote: (id: string) => void;
  onOpenTopic: (id: TopicId) => void;
  go: Go;
}) {
  const grouped = useMemo(() => {
    const map = new Map<string, Note[]>();
    notes.forEach((n) => {
      const list = map.get(n.topicId) ?? [];
      list.push(n);
      map.set(n.topicId, list);
    });
    return [...map.entries()].sort((a, b) => (b[1][0]?.createdAt ?? 0) - (a[1][0]?.createdAt ?? 0));
  }, [notes]);

  const exportAll = () => {
    const lines: string[] = ['# MindTrace — Notes & Highlights', ''];
    grouped.forEach(([topicId, list]) => {
      const t = getTopicById(topicId);
      lines.push(`## ${t?.title ?? topicId}`);
      if (t) lines.push(`_${getCategoryById(t.category)?.title ?? ''}_`, '');
      list.forEach((n) => {
        if (n.quote) lines.push(`> ${n.quote.replace(/\n/g, ' ')}`);
        if (n.body) lines.push(n.body);
        lines.push(`— ${formatDate(n.createdAt)}`, '');
      });
    });
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mindtrace-notes.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 pt-12 pb-24">
      <header className="rule-ink pt-7 pb-7 flex items-end justify-between gap-6">
        <div>
          <div className="kicker kicker-accent mb-4">Your library</div>
          <h1 className="font-display text-[38px] sm:text-[46px] font-semibold text-ink">Notes &amp; Highlights</h1>
          <p className="mt-3 text-[15px] text-ink-soft">
            {notes.length
              ? `${notes.length} note${notes.length === 1 ? '' : 's'} across ${grouped.length} entr${grouped.length === 1 ? 'y' : 'ies'}.`
              : 'Nothing saved yet.'}
          </p>
        </div>
        {notes.length > 0 && (
          <button onClick={exportAll} className="btn btn-ghost shrink-0">
            <Download className="w-4 h-4" /> Export
          </button>
        )}
      </header>

      {notes.length === 0 ? (
        <div className="card p-12 text-center flex flex-col items-center mt-8">
          <span className="w-14 h-14 rounded-full bg-paper-2 flex items-center justify-center mb-4">
            <StickyNote className="w-6 h-6 text-muted" />
          </span>
          <h3 className="font-display text-[19px] font-semibold text-ink mb-2">No notes yet</h3>
          <p className="text-[14px] text-muted max-w-sm leading-relaxed mb-6">
            While reading an entry, select any passage and choose <strong className="text-ink">Highlight</strong> — or add a
            note from the toolbar. Your notes stay on this device.
          </p>
          <button onClick={() => go('explore')} className="btn btn-primary">
            Open the library <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="mt-2">
          {grouped.map(([topicId, list]) => {
            const t = getTopicById(topicId);
            return (
              <section key={topicId} className="mb-10">
                <div className="flex items-baseline gap-3 border-b-2 border-ink/10 pb-2 mb-4">
                  <button onClick={() => onOpenTopic(topicId)} className="font-display text-[20px] font-semibold text-ink hover:text-accent transition-colors text-left">
                    {t?.title ?? topicId}
                  </button>
                  <span className="kicker">{getCategoryById(t?.category ?? '')?.title}</span>
                  <span className="ml-auto font-mono text-[11px] text-faint tnum">{list.length}</span>
                </div>
                <ul className="space-y-5">
                  {list.map((n) => (
                    <li key={n.id} className="group flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        {n.quote && (
                          <blockquote className="border-l-2 pl-4 italic text-[15px] text-ink-soft mb-2" style={{ borderColor: n.color || undefined }}>
                            {n.quote}
                          </blockquote>
                        )}
                        {n.body && <p className="text-[15px] text-ink leading-relaxed whitespace-pre-wrap">{n.body}</p>}
                        <span className="mt-1.5 block font-mono text-[10.5px] uppercase tracking-wider text-faint">
                          {formatDate(n.createdAt)}
                        </span>
                      </div>
                      <button
                        onClick={() => removeNote(n.id)}
                        aria-label="Delete note"
                        className="p-2 text-faint hover:text-accent transition-colors shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
