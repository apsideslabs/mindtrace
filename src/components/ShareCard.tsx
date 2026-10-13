import React from 'react';
import { CardContent, FormatSpec, ThemeSpec } from '../share/card';

/* The card is deliberately styled with inline hex values rather than
 * Tailwind classes, so the rasterised PNG is identical to the preview
 * regardless of the reader's app theme. */

const SERIF = "'Fraunces', ui-serif, Georgia, 'Times New Roman', serif";
const SANS = "'Inter', ui-sans-serif, system-ui, -apple-system, sans-serif";

function Mark({ size, accent, ink }: { size: number; accent: string; ink: string }) {
  const r = size / 2;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true">
      <circle cx="32" cy="32" r="30" fill="none" stroke={ink} strokeOpacity="0.18" strokeWidth="2" />
      <circle cx="32" cy="32" r="13" fill="none" stroke={accent} strokeWidth="2.5" />
      <circle cx="32" cy="32" r="3.5" fill={ink} />
    </svg>
  );
}

interface ShareCardProps {
  content: CardContent;
  format: FormatSpec;
  theme: ThemeSpec;
  /** Rendered for a preview at reduced size; keeps type proportional. */
  scale?: number;
}

export const ShareCard: React.FC<ShareCardProps> = ({ content, format, theme, scale = 1 }) => {
  const px = (n: number) => n * scale;
  const { w, h } = format;
  const wide = format.key === 'wide';
  const pad = wide ? 72 : 96;

  // Gentle auto-fit so long quotes do not overflow the card.
  const len = content.body.length;
  const base = wide ? 42 : 56;
  const shrink = len > 320 ? 0.72 : len > 240 ? 0.82 : len > 160 ? 0.92 : 1;
  const bodySize = Math.round(base * shrink);
  const titleSize = Math.round((wide ? 46 : 62) * shrink);

  return (
    <div
      style={{
        width: px(w),
        height: px(h),
        background: theme.bg,
        color: theme.ink,
        padding: px(pad),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxSizing: 'border-box',
        fontFamily: SANS,
      }}
    >
      {/* head */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div
          style={{
            fontSize: px(wide ? 17 : 20),
            fontWeight: 600,
            letterSpacing: px(2),
            textTransform: 'uppercase',
            color: content.accent,
          }}
        >
          {content.eyebrow}
        </div>
        <Mark size={px(wide ? 30 : 40)} accent={content.accent} ink={theme.ink} />
      </div>

      {/* body */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: px(24), paddingBottom: px(24) }}>
        {content.title && (
          <div
            style={{
              fontFamily: SERIF,
              fontSize: px(titleSize),
              lineHeight: 1.18,
              fontWeight: 600,
              letterSpacing: px(-0.5),
              marginBottom: px(18),
            }}
          >
            {content.title}
          </div>
        )}
        <div
          style={{
            fontFamily: SERIF,
            fontSize: px(bodySize),
            lineHeight: 1.36,
            fontWeight: content.title ? 400 : 500,
            color: content.title ? theme.soft : theme.ink,
            letterSpacing: px(-0.3),
          }}
        >
          {content.title ? content.body : `“${content.body}”`}
        </div>
      </div>

      {/* foot */}
      <div
        style={{
          borderTop: `${px(1)}px solid ${theme.line}`,
          paddingTop: px(22),
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: px(20),
        }}
      >
        <div style={{ minWidth: 0 }}>
          {content.meta && (
            <div style={{ fontSize: px(wide ? 17 : 20), fontWeight: 600, color: theme.ink }}>
              {content.meta}
            </div>
          )}
          <div style={{ fontSize: px(wide ? 15 : 18), color: theme.muted, marginTop: px(4) }}>
            MindTrace · apsideslabs.github.io/mindtrace
          </div>
        </div>
        <div
          style={{
            fontFamily: SERIF,
            fontSize: px(wide ? 22 : 27),
            fontWeight: 600,
            letterSpacing: px(-0.4),
            whiteSpace: 'nowrap',
          }}
        >
          Mind<span style={{ color: content.accent }}>Trace</span>
        </div>
      </div>
    </div>
  );
};
