import React, { useState } from 'react';
import { ArrowLeft, Search, Clock } from 'lucide-react';
import { getCollectionById } from '../content/facts';

function Evidence({ level }: { level: number }) {
  return (
    <span className="inline-flex items-center gap-1.5" title={`Evidence ${level}/5`}>
      <span className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={`w-1.5 h-1.5 rounded-full ${i < level ? 'bg-accent' : 'bg-line-strong'}`} />
        ))}
      </span>
      <span className="text-[10.5px] uppercase tracking-wider text-faint">Ev. {level}/5</span>
    </span>
  );
}

export function CollectionPage({
  collectionId,
  onBack,
  onOpenFact,
}: {
  collectionId: string;
  onBack: () => void;
  onOpenFact: (id: string) => void;
}) {
  const collection = getCollectionById(collectionId);
  const [q, setQ] = useState('');
  if (!collection) return null;

  const facts = collection.facts.filter((f) =>
    !q.trim() || `${f.title} ${f.summary}`.toLowerCase().includes(q.toLowerCase()),
  );
  const totalTime = collection.facts.reduce((a, f) => a + f.readingTimeMinutes, 0);

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 pt-12 pb-24">
      <button onClick={onBack} className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted hover:text-ink transition-colors mb-10">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <header className="border-b-2 border-ink/10 pb-8 mb-8">
        <h1 className="font-display text-[36px] sm:text-[44px] font-semibold text-ink">{collection.title}</h1>
        <p className="font-body mt-3 text-[17px] text-ink-soft max-w-2xl leading-relaxed">{collection.description}</p>
        <div className="mt-6 flex items-center gap-6 text-[12.5px] text-muted uppercase tracking-wider">
          <span><strong className="text-ink font-semibold">{collection.facts.length}</strong> notes</span>
          <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> <strong className="text-ink font-semibold">{totalTime}</strong> min</span>
        </div>
      </header>

      <div className="relative mb-6 max-w-sm">
        <Search className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search this collection…"
          className="w-full bg-surface border hairline rounded-full pl-10 pr-4 py-2.5 text-[13.5px] text-ink placeholder:text-faint outline-none focus:border-line-strong transition-colors"
        />
      </div>

      <div className="border-t hairline">
        {facts.map((f) => (
          <button key={f.id} onClick={() => onOpenFact(f.id)} className="w-full flex items-start gap-4 py-5 text-left border-b hairline group">
            <span className="font-mono text-[12px] text-faint pt-1 shrink-0 tabular-nums">{String(f.number).padStart(2, '0')}</span>
            <span className="flex-1 min-w-0">
              <span className="font-display text-[18px] font-semibold text-ink group-hover:text-accent transition-colors block leading-snug">
                {f.title}
              </span>
              <span className="mt-2 flex items-center gap-4">
                <Evidence level={f.evidenceLevel} />
                <span className="text-[11.5px] text-faint flex items-center gap-1.5 uppercase tracking-wider"><Clock className="w-3 h-3" /> {f.readingTimeMinutes} min</span>
              </span>
            </span>
          </button>
        ))}
        {facts.length === 0 && <p className="py-12 text-center font-body text-[15px] text-muted">No matching notes.</p>}
      </div>
    </div>
  );
}
