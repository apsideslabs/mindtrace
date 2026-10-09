import React from 'react';
import { ArrowLeft, ArrowRight, Clock, Star, BookOpen } from 'lucide-react';
import { getFactById, getCollectionById } from '../content/facts';

export function FactReader({
  factId,
  onBack,
  onNavigateFact,
}: {
  factId: string;
  onBack: () => void;
  onNavigateFact: (id: string) => void;
}) {
  const fact = getFactById(factId);
  if (!fact) return null;
  const collection = getCollectionById(fact.collectionId);
  if (!collection) return null;

  const idx = collection.facts.findIndex((f) => f.id === fact.id);
  const prev = idx > 0 ? collection.facts[idx - 1] : null;
  const next = idx < collection.facts.length - 1 ? collection.facts[idx + 1] : null;
  const pct = ((idx + 1) / collection.facts.length) * 100;

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 h-[3px] z-50 bg-paper-2">
        <div className="h-full bg-accent transition-all duration-300" style={{ width: `${pct}%` }} />
      </div>

      <div className="max-w-2xl mx-auto px-5 md:px-8 pt-12 pb-28">
        <button onClick={onBack} className="flex items-center gap-2 text-[13px] font-medium text-muted hover:text-ink transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> {collection.title}
        </button>

        <header className="border-b hairline pb-8 mb-8">
          <div className="flex items-center gap-4 text-[12px] text-muted mb-5">
            <span className="font-mono tracking-wider border hairline rounded px-2 py-0.5">FACT {String(fact.number).padStart(2, '0')}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {fact.readingTimeMinutes} min</span>
            <span className="flex items-center gap-0.5 ml-auto">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < fact.evidenceLevel ? 'fill-accent text-accent' : 'text-line-strong'}`} />
              ))}
            </span>
          </div>
          <h1 className="font-display text-[30px] sm:text-[36px] leading-[1.15] font-semibold text-ink">{fact.title}</h1>
        </header>

        <article className="space-y-9">
          <section>
            <h2 className="kicker mb-2">Summary</h2>
            <p className="text-[17px] leading-[1.75] text-ink">{fact.summary}</p>
          </section>

          {fact.whyItHappens && (
            <section>
              <h2 className="kicker mb-2">Why it happens</h2>
              <p className="text-[16px] leading-[1.75] text-ink-soft">{fact.whyItHappens}</p>
            </section>
          )}

          {fact.realWorldExample && (
            <section>
              <h2 className="kicker mb-2">In the real world</h2>
              <blockquote className="border-l-2 border-accent pl-5 py-1 italic text-[16px] text-ink-soft leading-relaxed">
                {fact.realWorldExample}
              </blockquote>
            </section>
          )}

          {fact.practicalUse && (
            <section>
              <h2 className="kicker mb-2">Practical use</h2>
              <p className="text-[16px] leading-[1.75] text-ink-soft">{fact.practicalUse}</p>
            </section>
          )}

          {fact.relatedConcepts && fact.relatedConcepts.length > 0 && (
            <section>
              <h2 className="kicker mb-3">Related concepts</h2>
              <div className="flex flex-wrap gap-2">
                {fact.relatedConcepts.map((c, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full border hairline text-[12.5px] text-ink-soft">{c}</span>
                ))}
              </div>
            </section>
          )}

          {fact.references && fact.references.length > 0 && (
            <section className="pt-6 border-t hairline">
              <h2 className="kicker mb-3 flex items-center gap-2"><BookOpen className="w-3.5 h-3.5" /> Sources</h2>
              <ul className="space-y-2.5">
                {fact.references.map((r, i) => (
                  <li key={i} className="text-[13px] text-ink-soft leading-snug">
                    <span className="text-ink font-medium">{r.title}</span> — {r.source}{r.year ? ` (${r.year})` : ''}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>

        <nav className="mt-12 pt-8 border-t hairline flex items-center justify-between gap-4">
          {prev ? (
            <button onClick={() => onNavigateFact(prev.id)} className="group text-left min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-faint flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5" /> Previous</span>
              <span className="font-display text-[14.5px] font-semibold text-ink group-hover:text-accent transition-colors line-clamp-1">{prev.title}</span>
            </button>
          ) : <span />}
          {next ? (
            <button onClick={() => onNavigateFact(next.id)} className="group text-right min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-faint flex items-center gap-1 justify-end">Next <ArrowRight className="w-3.5 h-3.5" /></span>
              <span className="font-display text-[14.5px] font-semibold text-ink group-hover:text-accent transition-colors line-clamp-1">{next.title}</span>
            </button>
          ) : <span />}
        </nav>
      </div>
    </div>
  );
}
