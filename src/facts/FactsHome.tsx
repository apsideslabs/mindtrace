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
      <button onClick={onBack} className="flex items-center gap-2 text-[13px] font-medium text-muted hover:text-ink transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <header className="border-b hairline pb-8 mb-8">
        <div className="kicker mb-3">MindTrace Facts</div>
        <h1 className="font-display text-[38px] sm:text-[46px] leading-tight font-semibold text-ink">
          Research-backed findings
        </h1>
        <p className="mt-4 text-[16px] text-ink-soft max-w-2xl leading-relaxed">
          {totalFacts} facts across {factsCategories.length} collections — each one a short, sourced finding you can actually use.
        </p>
      </header>

      <div className="grid sm:grid-cols-2 gap-3">
        {factsCategories.map((c) => {
          const collections = getCollectionsForCategory(c.id);
          const count = collections.reduce((a, col) => a + col.facts.length, 0);
          const enabled = count > 0;
          return (
            <button
              key={c.id}
              onClick={() => enabled && onOpenCategory(c.id)}
              disabled={!enabled}
              className={`card p-6 text-left group flex flex-col ${enabled ? '' : 'opacity-50 cursor-default'}`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="w-10 h-10 rounded-xl bg-accent-soft flex items-center justify-center text-accent">
                  {ICONS[c.id] ?? <BrainCircuit className="w-5 h-5" />}
                </span>
                <span className="text-[11px] font-semibold text-muted tabular-nums">{count} facts</span>
              </div>
              <h3 className="font-display text-[19px] font-semibold text-ink group-hover:text-accent transition-colors">{c.title}</h3>
              <p className="mt-1.5 text-[13px] text-muted leading-relaxed flex-1">{c.description}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-ink-soft group-hover:text-accent transition-colors">
                Open <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
