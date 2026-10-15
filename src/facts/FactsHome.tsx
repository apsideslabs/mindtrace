import React from 'react';
import { ArrowLeft, ArrowRight, BrainCircuit, Link2, Network, Fingerprint } from 'lucide-react';
import { factsCategories, getCollectionsForCategory } from '../content/facts';
import { CATEGORY_ACCENT } from '../content/content-index';

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
          const accent = CATEGORY_ACCENT[c.id] ?? '#b23a2a';
          return (
            <button
              key={c.id}
              onClick={() => enabled && onOpenCategory(c.id)}
              disabled={!enabled}
              className={`group relative overflow-hidden rounded-xl border border-line bg-surface p-6 text-left transition-[border-color,box-shadow] duration-200 ${
                enabled ? 'hover:border-line-strong hover:shadow-[0_14px_34px_-26px_rgba(20,18,15,0.45)]' : 'cursor-default opacity-50'
              }`}
            >
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-[3px] transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                style={{ background: accent }}
              />
              <div className="mb-4 flex items-center justify-between">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: `${accent}14`, color: accent }}
                >
                  {ICONS[c.id] ?? <BrainCircuit className="w-5 h-5" />}
                </span>
                <span className="font-mono text-[11px] tabular-nums text-faint">
                  {String(count).padStart(2, '0')}
                </span>
              </div>
              <h3 className="font-display text-[19px] font-semibold tracking-[-0.01em] text-ink transition-colors group-hover:text-accent">
                {c.title}
              </h3>
              <p className="mt-1.5 flex-1 text-[13px] leading-relaxed text-muted">{c.description}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-ink-soft transition-colors group-hover:text-accent">
                Open <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
