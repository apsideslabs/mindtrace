import React from 'react';
import { ArrowLeft, ArrowRight, Layers, Clock, BookOpen } from 'lucide-react';
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
    <div className="max-w-4xl mx-auto px-5 md:px-8 pt-12 pb-24">
      <button onClick={onBack} className="flex items-center gap-2 text-[13px] font-medium text-muted hover:text-ink transition-colors mb-8">
        <ArrowLeft className="w-4 h-4" /> Back to facts
      </button>

      <header className="border-b hairline pb-8 mb-8">
        <div className="kicker mb-3">Collection</div>
        <h1 className="font-display text-[34px] sm:text-[40px] font-semibold text-ink">{category.title}</h1>
        <p className="mt-3 text-[16px] text-ink-soft max-w-2xl leading-relaxed">{category.description}</p>
        <div className="mt-6 flex flex-wrap items-center gap-6 text-[13px] text-muted">
          <span className="flex items-center gap-2"><Layers className="w-4 h-4" /> <strong className="text-ink font-semibold">{collections.length}</strong> collections</span>
          <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> <strong className="text-ink font-semibold">{totalFacts}</strong> facts</span>
          <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> <strong className="text-ink font-semibold">{totalTime}</strong> min</span>
        </div>
      </header>

      <div className="divide-y divide-line border-t hairline">
        {collections.map((c) => (
          <button key={c.id} onClick={() => onOpenCollection(c.id)} className="w-full flex items-center gap-4 py-5 text-left group">
            <span className="flex-1 min-w-0">
              <span className="font-display text-[18px] font-semibold text-ink group-hover:text-accent transition-colors block">{c.title}</span>
              <span className="block text-[13.5px] text-muted line-clamp-1 mt-1">{c.description}</span>
            </span>
            <span className="text-[12px] text-faint shrink-0 tabular-nums">{c.facts.length} facts</span>
            <ArrowRight className="w-4 h-4 text-faint group-hover:text-accent transition-colors shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
