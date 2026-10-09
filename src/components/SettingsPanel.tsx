import React, { useEffect, useRef, useState } from 'react';
import { SlidersHorizontal, X, RotateCcw, Sun, Moon, BookOpen, Eye, EyeOff, Check, Highlighter } from 'lucide-react';
import { Settings, ACCENTS, HIGHLIGHTS, FONT_SIZES, PAGE_WIDTHS, THEMES, Theme } from '../settings';

const THEME_ICON: Record<Theme, React.ReactNode> = {
  light: <Sun className="w-3.5 h-3.5" />,
  sepia: <BookOpen className="w-3.5 h-3.5" />,
  dark: <Moon className="w-3.5 h-3.5" />,
};

function Seg({
  options,
  value,
  onChange,
  render,
  label,
}: {
  options: { name: string; value: string | number }[];
  value: string | number;
  onChange: (v: any) => void;
  render?: (o: { name: string; value: any }) => React.ReactNode;
  label: string;
}) {
  return (
    <div role="group" aria-label={label} className="flex gap-1.5">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={String(o.value)}
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            className={`flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg border text-[12px] font-medium transition-colors ${
              active
                ? 'border-accent text-accent bg-accent-soft'
                : 'border-line text-ink-soft hover:border-line-strong'
            }`}
          >
            {render ? render(o) : o.name}
          </button>
        );
      })}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <div className="kicker mb-2.5">{label}</div>
      {children}
    </div>
  );
}

export function SettingsPanel({
  settings,
  update,
  reset,
}: {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  reset: () => void;
}) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); btnRef.current?.focus(); } };
    const onClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node) && !btnRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onClick);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  return (
    <>
      <button
        ref={btnRef}
        onClick={() => setOpen((v) => !v)}
        aria-label="Reading settings"
        aria-expanded={open}
        className="fixed z-50 right-4 md:right-6 bottom-20 md:bottom-6 w-11 h-11 rounded-full bg-ink text-paper shadow-xl flex items-center justify-center hover:bg-accent transition-colors focus-visible:outline-2"
      >
        {open ? <X className="w-5 h-5" /> : <SlidersHorizontal className="w-5 h-5" />}
      </button>

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="Reading settings"
          className="fixed z-50 right-4 md:right-6 bottom-36 md:bottom-20 w-[19rem] max-w-[calc(100vw-2rem)] max-h-[70vh] overflow-y-auto bg-surface border hairline rounded-2xl shadow-2xl p-5 mt-fade"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="kicker flex items-center gap-2"><SlidersHorizontal className="w-3.5 h-3.5" /> Reading settings</span>
            <button onClick={() => { reset(); }} className="text-muted hover:text-accent transition-colors" aria-label="Reset to defaults" title="Reset to defaults">
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <Row label="Theme">
            <Seg
              label="Theme"
              options={THEMES}
              value={settings.theme}
              onChange={(v) => update({ theme: v })}
              render={(o) => (<>{THEME_ICON[o.value as Theme]}<span>{o.name}</span></>)}
            />
          </Row>

          <Row label="Accent colour">
            <div className="flex flex-wrap gap-2">
              {ACCENTS.map((a) => (
                <button
                  key={a.value}
                  onClick={() => update({ accent: a.value })}
                  aria-label={a.name}
                  aria-pressed={settings.accent === a.value}
                  title={a.name}
                  className={`w-7 h-7 rounded-full border-2 transition-transform hover:scale-110 ${settings.accent === a.value ? 'border-ink' : 'border-line'}`}
                  style={{ background: a.value }}
                />
              ))}
            </div>
          </Row>

          <Row label="Text size">
            <Seg label="Text size" options={FONT_SIZES} value={settings.fontSize} onChange={(v) => update({ fontSize: v })} />
          </Row>

          <Row label="Page width">
            <Seg label="Page width" options={PAGE_WIDTHS} value={settings.pageWidth} onChange={(v) => update({ pageWidth: v })} />
          </Row>

          <Row label="Highlight colour">
            <div className="flex flex-wrap gap-2">
              {HIGHLIGHTS.map((h) => (
                <button
                  key={h.value}
                  onClick={() => update({ highlight: h.value })}
                  aria-label={h.name}
                  aria-pressed={settings.highlight === h.value}
                  title={h.name}
                  className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-transform hover:scale-110 ${settings.highlight === h.value ? 'border-ink' : 'border-line'}`}
                  style={{ background: h.value }}
                >
                  {settings.highlight === h.value && <Check className="w-3.5 h-3.5 text-ink" />}
                </button>
              ))}
            </div>
            <p className="mt-2.5 text-[12px] text-muted leading-relaxed">
              Select any passage while reading and choose <strong className="text-ink">Highlight</strong> — it is saved to
              Notes in this colour.
            </p>
          </Row>

          <Row label="Key-line emphasis">
            <button
              onClick={() => update({ emphasis: !settings.emphasis })}
              aria-pressed={settings.emphasis}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-[13px] font-medium transition-colors ${
                settings.emphasis ? 'border-accent text-accent bg-accent-soft' : 'border-line text-ink-soft hover:border-line-strong'
              }`}
            >
              <span className="flex items-center gap-2">
                <Highlighter className="w-4 h-4" />
                Underline key lines
              </span>
              <span className={`w-8 h-4 rounded-full relative transition-colors ${settings.emphasis ? 'bg-accent' : 'bg-line-strong'}`}>
                <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${settings.emphasis ? 'left-4' : 'left-0.5'}`} />
              </span>
            </button>
            <p className="mt-2.5 text-[12px] text-muted leading-relaxed">
              Marks the key line of every section and the key points in each list while you read.
            </p>
          </Row>

          <Row label="Reading">
            <button
              onClick={() => update({ focusMode: !settings.focusMode })}
              aria-pressed={settings.focusMode}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-[13px] font-medium transition-colors ${
                settings.focusMode ? 'border-accent text-accent bg-accent-soft' : 'border-line text-ink-soft hover:border-line-strong'
              }`}
            >
              <span className="flex items-center gap-2">
                {settings.focusMode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                Focus mode
              </span>
              <span className={`w-8 h-4 rounded-full relative transition-colors ${settings.focusMode ? 'bg-accent' : 'bg-line-strong'}`}>
                <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${settings.focusMode ? 'left-4' : 'left-0.5'}`} />
              </span>
            </button>
            <p className="mt-2.5 text-[12px] text-muted leading-relaxed">
              Hides the masthead, footer and navigation for distraction-free reading.
            </p>
          </Row>

          <div className="pt-3 border-t hairline text-[11.5px] text-muted leading-relaxed">
            Preferences and notes are stored on this device only.
          </div>
        </div>
      )}
    </>
  );
}
