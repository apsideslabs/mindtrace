import React from 'react';
import { Clock } from 'lucide-react';
import { Fact } from '../../content/facts/types';

/**
 * A fact as a finding card.
 *
 * The evidence level used to be five generic star icons, which read as a
 * product review rather than a research rating. It is now a five-tick
 * meter filled to the level, stated in words beside it, so the claim and
 * its strength are read together.
 *
 * The summary is shown, not just the title: a list of bare titles makes
 * the reader open every item to find out whether it is worth opening.
 */
export function FactCard({
  fact,
  accent,
  onOpen,
}: {
  fact: Fact;
  accent: string;
  onOpen: () => void;
}) {
  const level = Math.max(0, Math.min(5, fact.evidenceLevel ?? 0));
  return (
    <button
      onClick={onOpen}
      className="group relative w-full overflow-hidden rounded-xl border border-line bg-surface p-5 text-left transition-[border-color,box-shadow] duration-200 hover:border-line-strong hover:shadow-[0_14px_34px_-26px_rgba(20,18,15,0.45)]"
    >
      <span aria-hidden className="absolute inset-y-0 left-0 w-[3px] opacity-0 transition-opacity duration-200 group-hover:opacity-100" style={{ background: accent }} />

      <div className="flex items-start gap-4">
        <span className="shrink-0 pt-[3px] font-mono text-[11.5px] tabular-nums text-faint">
          {String(fact.number).padStart(2, '0')}
        </span>

        <div className="min-w-0 flex-1">
          <h3 className="font-display text-[17.5px] font-semibold leading-snug tracking-[-0.01em] text-ink transition-colors group-hover:text-accent">
            {fact.title}
          </h3>
          {fact.summary && (
            <p className="mt-1.5 line-clamp-2 text-[13.5px] leading-relaxed text-muted">{fact.summary}</p>
          )}

          <div className="mt-3.5 flex items-center gap-3">
            <span className="flex items-center gap-[3px]" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className="h-1 w-3.5 rounded-full"
                  style={{ background: i < level ? accent : 'var(--color-line-strong)' }}
                />
              ))}
            </span>
            <span className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-faint">
              Evidence {level}/5
            </span>
            <span className="flex items-center gap-1.5 text-[11.5px] text-faint">
              <Clock className="h-3 w-3" />
              {fact.readingTimeMinutes} min
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
