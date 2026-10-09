import React from 'react';
import { Search, Bookmark, User as UserIcon } from 'lucide-react';

export type NavKey = 'home' | 'explore' | 'visualize' | 'quotes' | 'facts' | 'bookmarks' | 'profile';

const LINKS: { key: NavKey; label: string }[] = [
  { key: 'explore', label: 'Catalogue' },
  { key: 'visualize', label: 'Map' },
  { key: 'facts', label: 'Facts' },
  { key: 'quotes', label: 'Quotes' },
];

export function Masthead({
  active,
  onNavigate,
  onSearch,
}: {
  active: NavKey;
  onNavigate: (k: NavKey) => void;
  onSearch: () => void;
}) {
  const date = new Date().toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <header className="sticky top-0 z-40 bg-paper">
      <div className="h-[3px] bg-accent" />

      {/* Wordmark row */}
      <div className="border-b hairline">
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-[60px] flex items-center justify-between gap-4">
          <div className="hidden md:flex flex-col w-44 shrink-0 leading-[1.5]">
            <span className="kicker">{date}</span>
            <span className="kicker text-faint">A research library</span>
          </div>

          <button onClick={() => onNavigate('home')} className="flex items-center gap-4 flex-1 md:flex-none justify-start md:justify-center" aria-label="MindTrace home">
            <span className="hidden md:block h-px w-14 bg-line-strong" />
            <span className="font-display text-[30px] md:text-[34px] font-semibold leading-none tracking-tight whitespace-nowrap">
              <span className="text-ink">Mind</span><span className="text-accent">Trace</span>
            </span>
            <span className="hidden md:block h-px w-14 bg-line-strong" />
          </button>

          <div className="flex items-center gap-1 shrink-0 md:w-44 justify-end">
            <button
              onClick={onSearch}
              className="hidden sm:flex items-center gap-2 h-8 pl-3 pr-2 border hairline text-muted hover:border-ink hover:text-ink transition-colors"
              aria-label="Search"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="font-mono text-[10px] tracking-[0.15em] uppercase">Search</span>
              <kbd className="font-mono text-[10px] px-1 border-l hairline text-faint">/</kbd>
            </button>
            <button onClick={onSearch} className="sm:hidden w-9 h-9 flex items-center justify-center text-ink-soft" aria-label="Search">
              <Search className="w-[18px] h-[18px]" />
            </button>
            <button
              onClick={() => onNavigate('bookmarks')}
              className={`hidden md:flex w-9 h-9 items-center justify-center transition-colors ${active === 'bookmarks' ? 'text-accent' : 'text-ink-soft hover:text-ink'}`}
              aria-label="Saved"
            >
              <Bookmark className="w-[17px] h-[17px]" />
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className={`hidden md:flex w-9 h-9 items-center justify-center transition-colors ${active === 'profile' ? 'text-accent' : 'text-ink-soft hover:text-ink'}`}
              aria-label="Profile"
            >
              <UserIcon className="w-[17px] h-[17px]" />
            </button>
          </div>
        </div>
      </div>

      {/* Section nav (desktop) */}
      <nav className="hidden md:block bg-paper border-b-2 border-ink/10">
        <div className="max-w-6xl mx-auto px-8 h-[42px] flex items-center justify-center">
          {LINKS.map((l, i) => (
            <React.Fragment key={l.key}>
              {i > 0 && <span className="w-px h-4 bg-line mx-2" />}
              <button
                onClick={() => onNavigate(l.key)}
                className={`relative px-6 h-[42px] font-mono text-[11px] tracking-[0.18em] uppercase transition-colors ${
                  active === l.key ? 'text-accent' : 'text-ink-soft hover:text-ink'
                }`}
              >
                {l.label}
                {active === l.key && <span className="absolute left-5 right-5 bottom-0 h-[3px] bg-accent" />}
              </button>
            </React.Fragment>
          ))}
        </div>
      </nav>
    </header>
  );
}
