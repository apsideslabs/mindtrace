import React, { useState } from 'react';
import { ArrowLeft, Search } from 'lucide-react';
import { getCollectionById } from '../content/facts';

function Evidence({ level }: { level: number }) {
  return (
    <span className="inline-flex items-center gap-2" title={`Evidence ${level}/5`}>
      <span className="flex gap-[3px]">
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} className={`w-3 h-[3px] ${i < level ? 'bg-accent' : 'bg-line-strong'}`} />
        ))}
      </span>
      <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-faint">Ev {level}/5</span>
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
    <div className="max-w-4xl mx-auto px-5 md:px-8 pt-8 pb-20">
      <button onClick={onBack} className="flex items-center gap-2 font-mono text-[10.5px] tracking-[0.16em] uppercase text-muted hover:text-accent transition-colors mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </button>

      <header className="rule-red pt-6 pb-7">
        <h1 className="font-display text-[42px] sm:text-[52px] leading-[1.02] font-semibold tracking-tight text-ink">{collection.title}</h1>
        <p className="standfirst mt-4 max-w-2xl">{collection.description}</p>
        <div className="mt-6 flex items-center gap-x-6 font-mono text-[11px] tracking-[0.14em] uppercase text-muted">
          <span>{collection.facts.length} notes</span>
          <span className="text-line-strong">/</span>
          <span>{totalTime} min</span>
        </div>
      </header>

      <div className="relative mb-4 mt-8 max-w-sm">
        <Search className="w-4 h-4 text-muted absolute left-0 top-1/2 -translate-y-1/2" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search this collection…"
          className="w-full bg-transparent border-b border-line pl-7 pr-2 py-2 text-[14px] font-body text-ink placeholder:text-faint outline-none focus:border-accent transition-colors"
        />
      </div>

      <div className="rule">
        {facts.map((f) => (
          <button key={f.id} onClick={() => onOpenFact(f.id)} className="w-full flex items-start gap-4 py-4 border-b hairline text-left group">
            <span className="font-mono text-[12px] text-faint tnum pt-1 shrink-0">{String(f.number).padStart(2, '0')}</span>
            <span className="flex-1 min-w-0">
              <span className="font-display text-[20px] font-medium text-ink group-hover:text-accent transition-colors block leading-snug">
                {f.title}
              </span>
              <span className="mt-2 flex items-center gap-4">
                <Evidence level={f.evidenceLevel} />
                <span className="font-mono text-[10px] tracking-[0.1em] uppercase text-faint">{f.readingTimeMinutes} min</span>
              </span>
            </span>
          </button>
        ))}
        {facts.length === 0 && <p className="py-12 text-center font-body text-[15px] text-muted">No matching notes.</p>}
      </div>
    </div>
  );
}
