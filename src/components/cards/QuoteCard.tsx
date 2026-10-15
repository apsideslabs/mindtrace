import React from 'react';
import { Share2 } from 'lucide-react';
import { Quote } from '../../types';

/**
 * A quote as a printed plate rather than a bordered box.
 *
 * The card carries the quote's own accent colour in three places — the
 * spine down the left edge, the category chip, and the watermark mark
 * behind the text — so a psychology quote and a leadership quote read as
 * different objects at a glance instead of the same white rectangle.
 *
 * The opening quote mark is set as a large watermark and the text is not
 * wrapped in literal quote characters, which is what a typographic plate
 * does: the mark signals "quotation" without crowding the first line.
 */
export function QuoteCard({
  quote,
  label,
  accent,
  onShare,
}: {
  quote: Quote;
  label: string;
  accent: string;
  onShare?: () => void;
}) {
  return (
    <figure
      className="group relative mb-4 break-inside-avoid overflow-hidden rounded-xl border border-line bg-surface transition-[border-color,box-shadow] duration-200 hover:border-line-strong hover:shadow-[0_14px_34px_-24px_rgba(20,18,15,0.45)]"
      style={{ borderLeftColor: accent }}
    >
      {/* Accent spine — the card's identity, carried in one stroke. */}
      <span aria-hidden className="absolute inset-y-0 left-0 w-[3px]" style={{ background: accent }} />
      {/* Watermark quotation mark. Set behind the text on the right rather
          than hung off the top-left, where it was being clipped by the card
          and colliding with the category chip. */}
      <span
        aria-hidden
        className="pointer-events-none absolute right-3 top-1 select-none font-display text-[124px] leading-none"
        style={{ color: accent, opacity: 0.08 }}
      >
        &ldquo;
      </span>

      <div className="relative px-6 pb-5 pt-6">
        <span
          className="inline-flex items-center rounded-full px-2.5 py-[3px] text-[10px] font-semibold uppercase tracking-[0.15em]"
          style={{ background: `${accent}14`, color: accent }}
        >
          {label}
        </span>

        <blockquote className="mt-3.5 font-display text-[21px] leading-[1.32] tracking-[-0.014em] text-ink">
          {quote.text}
        </blockquote>

        <figcaption className="mt-5 flex items-end justify-between gap-3 border-t border-line pt-3.5">
          <span className="min-w-0">
            <span className="block truncate text-[13px] font-semibold text-ink">{quote.author}</span>
            {quote.source && (
              <span className="mt-0.5 block text-[11.5px] leading-snug text-faint">{quote.source}</span>
            )}
          </span>
          {onShare && (
            <button
              onClick={onShare}
              className="shrink-0 rounded-full p-2 text-muted opacity-0 transition-colors hover:text-ink focus-visible:opacity-100 group-hover:opacity-100"
              aria-label={`Make a card from this quote by ${quote.author}`}
              title="Make a card"
            >
              <Share2 className="h-4 w-4" />
            </button>
          )}
        </figcaption>
      </div>
    </figure>
  );
}
