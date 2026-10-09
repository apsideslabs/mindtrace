import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { getCategoryById, getCollectionsForCategory } from '../content/facts';

export function CategoryPage({
  categoryId,
  onBack,
  onOpenCollection,
}: {
  categoryId: string;
  onBack: () => void;
  onOpenCollection: (id: string) => void;
}) {
  const category = getCategoryById(categoryId);
  const collections = getCollectionsForCategory(categoryId);
  if (!category) return null;

  const totalFacts = collections.reduce((a, c) => a + c.facts.length, 0);
  const totalTime = collections.reduce((a, c) => a + c.facts.reduce((f, x) => f + x.readingTimeMinutes, 0), 0);

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-8 pt-8 pb-20">
      <button onClick={onBack} className="flex items-center gap-2 font-mono text-[10.5px] tracking-[0.16em] uppercase text-muted hover:text-accent transition-colors mb-6">
        <ArrowLeft className="w-3.5 h-3.5" /> Research Notes
      </button>

      <header className="rule-red pt-6 pb-7">
        <div className="kicker mb-4">Collection</div>
        <h1 className="font-display text-[42px] sm:text-[52px] leading-[1.02] font-semibold tracking-tight text-ink">{category.title}</h1>
        <p className="standfirst mt-4 max-w-2xl">{category.description}</p>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11px] tracking-[0.14em] uppercase text-muted">
          <span>{collections.length} collections</span>
          <span className="text-line-strong">/</span>
          <span>{totalFacts} notes</span>
          <span className="text-line-strong">/</span>
          <span>{totalTime} min</span>
        </div>
      </header>

      <div className="rule mt-8">
        {collections.map((c) => (
          <button key={c.id} onClick={() => onOpenCollection(c.id)} className="group w-full flex items-baseline gap-4 py-4 border-b hairline text-left">
            <span className="flex-1 min-w-0">
              <span className="font-display text-[21px] font-medium text-ink group-hover:text-accent transition-colors block">{c.title}</span>
              <span className="block font-body text-[14.5px] text-muted line-clamp-1 mt-1">{c.description}</span>
            </span>
            <span className="font-mono text-[11px] text-faint tnum shrink-0">{c.facts.length} notes</span>
          </button>
        ))}
      </div>
    </div>
  );
}
