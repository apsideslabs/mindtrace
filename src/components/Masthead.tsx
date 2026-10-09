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
  return (
    <header className="sticky top-0 z-40">
      <div className="h-[3px] bg-accent" />
      <div className="bg-paper border-b hairline">
        <div className="max-w-6xl mx-auto px-5 md:px-8 h-[62px] flex items-center justify-between gap-6">
          <button onClick={() => onNavigate('home')} className="flex items-center gap-3 shrink-0 group" aria-label="MindTrace home">
            <span className="relative flex items-center justify-center w-9 h-9 rounded-full border border-ink/20">
              <span className="w-4 h-4 rounded-full border border-accent" />
              <span className="absolute w-1 h-1 rounded-full bg-gold" />
            </span>
            <span className="flex flex-col items-start leading-none">
              <span className="font-display text-[20px] font-semibold tracking-tight text-ink">
                Mind<span className="text-accent">Trace</span>
              </span>
              <span className="hidden sm:block text-[9.5px] tracking-[0.22em] uppercase text-muted mt-0.5">
                Research Library
              </span>
            </span>
          </button>

          <nav className="hidden md:flex items-center gap-1">
            {LINKS.map((l) => (
              <button
                key={l.key}
                onClick={() => onNavigate(l.key)}
                className={`relative px-3.5 py-2 text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors ${
                  active === l.key ? 'text-ink' : 'text-muted hover:text-ink'
                }`}
              >
                {l.label}
                {active === l.key && <span className="absolute left-3.5 right-3.5 -bottom-0.5 h-px bg-gold" />}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onSearch}
              className="hidden sm:flex items-center gap-2 h-9 pl-3 pr-2.5 rounded-full border hairline bg-surface text-muted hover:border-line-strong transition-colors"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
              <span className="text-[12.5px]">Search</span>
              <kbd className="ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded border hairline text-faint">/</kbd>
            </button>
            <button
              onClick={onSearch}
              className="sm:hidden w-9 h-9 flex items-center justify-center rounded-full border hairline text-ink-soft"
              aria-label="Search"
            >
              <Search className="w-[18px] h-[18px]" />
            </button>
            <button
              onClick={() => onNavigate('bookmarks')}
              className={`hidden md:flex w-9 h-9 items-center justify-center rounded-full transition-colors ${
                active === 'bookmarks' ? 'text-accent bg-accent-soft' : 'text-ink-soft hover:bg-paper-2'
              }`}
              aria-label="Saved"
            >
              <Bookmark className="w-[18px] h-[18px]" />
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className={`hidden md:flex w-9 h-9 items-center justify-center rounded-full transition-colors ${
                active === 'profile' ? 'text-accent bg-accent-soft' : 'text-ink-soft hover:bg-paper-2'
              }`}
              aria-label="Profile"
            >
              <UserIcon className="w-[18px] h-[18px]" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
