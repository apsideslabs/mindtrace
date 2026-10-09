import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { factsCategories, getCollectionsForCategory } from '../content/facts';

export function FactsHome({ onBack, onOpenCategory }: { onBack: () => void; onOpenCategory: (id: string) => void }) {
  const totalFacts = factsCategories.reduce(
    (acc, c) => acc + getCollectionsForCategory(c.id).reduce((a, col) => a + col.facts.length, 0),
    0,
  );

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 pt-8 pb-20">
      <button onClick={onBack} className="flex items-center gap-2 font-mono text-[10.5px] tracking-[0.16em] uppercase text-muted hover:text-accent transition-colors mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </button>

      <header className="rule-red pt-6 pb-7">
        <div className="kicker kicker-accent mb-4">MindTrace Facts</div>
        <h1 className="font-display text-[46px] sm:text-[58px] leading-[1] font-semibold tracking-tight text-ink">Research Notes</h1>
        <p className="standfirst mt-5 max-w-2xl">
          {totalFacts} sourced findings across {factsCategories.length} collections — each a short, evidence-rated note you can actually use.
        </p>
      </header>

      <div className="rule">
        {factsCategories.map((c, i) => {
          const collections = getCollectionsForCategory(c.id);
          const count = collections.reduce((a, col) => a + col.facts.length, 0);
          const enabled = count > 0;
          return (
            <button
              key={c.id}
              onClick={() => enabled && onOpenCategory(c.id)}
              disabled={!enabled}
              className={`group w-full grid grid-cols-[2.5rem_1fr_auto] md:grid-cols-[3rem_14rem_1fr_auto] gap-x-4 items-baseline py-5 text-left border-b hairline transition-colors ${enabled ? 'hover:bg-surface/60' : 'opacity-50 cursor-default'}`}
            >
              <span className="font-mono text-[13px] text-accent tnum">{String(i + 1).padStart(2, '0')}</span>
              <span className="font-display text-[22px] font-medium text-ink group-hover:text-accent transition-colors leading-snug">{c.title}</span>
              <span className="hidden md:block font-body text-[14.5px] text-muted leading-relaxed">{c.description}</span>
              <span className="font-mono text-[11px] text-faint tnum whitespace-nowrap">{count} notes</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
