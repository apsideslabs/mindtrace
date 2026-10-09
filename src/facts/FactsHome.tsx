import React from 'react';
import { ArrowLeft, ArrowRight, BrainCircuit, Link2, Network, Fingerprint } from 'lucide-react';
import { factsCategories, getCollectionsForCategory } from '../content/facts';

const ICONS: Record<string, React.ReactNode> = {
  psychology: <BrainCircuit className="w-5 h-5" />,
  relationships: <Link2 className="w-5 h-5" />,
  social: <Network className="w-5 h-5" />,
  crime: <Fingerprint className="w-5 h-5" />,
};

export function FactsHome({ onBack, onOpenCategory }: { onBack: () => void; onOpenCategory: (id: string) => void }) {
  const totalFacts = factsCategories.reduce(
    (acc, c) => acc + getCollectionsForCategory(c.id).reduce((a, col) => a + col.facts.length, 0),
    0,
  );

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 pt-12 pb-24">
      <button onClick={onBack} className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-muted hover:text-ink transition-colors mb-10">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <header className="border-b-2 border-ink/10 pb-8 mb-8">
        <div className="kicker mb-3">MindTrace Facts</div>
        <h1 className="font-display text-[40px] sm:text-[50px] leading-tight font-semibold text-ink">
          Research notes
        </h1>
        <p className="font-body mt-4 text-[18px] text-ink-soft max-w-2xl leading-relaxed">
          {totalFacts} sourced findings across {factsCategories.length} collections — each one a short, evidence-rated
          note you can actually use.
        </p>
      </header>

      <div className="border-t hairline">
        {factsCategories.map((c, i) => {
          const collections = getCollectionsForCategory(c.id);
          const count = collections.reduce((a, col) => a + col.facts.length, 0);
          const enabled = count > 0;
          return (
            <button
              key={c.id}
              onClick={() => enabled && onOpenCategory(c.id)}
              disabled={!enabled}
              className={`group w-full flex items-start gap-5 py-6 text-left border-b hairline transition-colors px-1 ${enabled ? 'hover:bg-surface/60' : 'opacity-50 cursor-default'}`}
            >
              <span className="font-mono text-[13px] text-faint w-7 pt-1 shrink-0 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
              <span className="w-11 h-11 rounded-xl bg-accent-soft flex items-center justify-center text-accent shrink-0">
                {ICONS[c.id] ?? <BrainCircuit className="w-5 h-5" />}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-display text-[21px] font-semibold text-ink group-hover:text-accent transition-colors">{c.title}</span>
                <span className="block font-body text-[14.5px] text-muted leading-relaxed mt-1 max-w-2xl">{c.description}</span>
              </span>
              <span className="hidden sm:flex flex-col items-end shrink-0 pt-1">
                <span className="font-display text-[20px] font-semibold text-ink tabular-nums">{count}</span>
                <span className="text-[10px] uppercase tracking-wider text-faint">notes</span>
              </span>
              <ArrowRight className="w-4 h-4 text-faint group-hover:text-accent transition-colors shrink-0 mt-2" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
