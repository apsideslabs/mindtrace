import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, BookOpen, Waypoints, Quote as QuoteIcon, Bookmark, User as UserIcon, StickyNote } from 'lucide-react';
import { useUserStats, useNotes } from './store';
import { CategoryId, TopicId } from './types';
import { getTopicById, getCategoryById } from './content/content-index';
import { getFactById } from './content/facts';

import { HomeView } from './components/HomeView';
import { ExploreView } from './components/ExploreView';
import { CategoryView } from './components/CategoryView';
import { TopicView } from './components/TopicView';
import { BookmarksView } from './components/BookmarksView';
import { ProfileView } from './components/ProfileView';
import { QuotesView } from './components/QuotesView';
import { NotesView } from './components/NotesView';
const VisualizeView = lazy(() => import('./components/VisualizeView').then((m) => ({ default: m.VisualizeView })));
import { SearchOverlay } from './components/SearchOverlay';
import { DisclaimerModal } from './components/DisclaimerModal';
import { Masthead, type NavKey } from './components/Masthead';

import { FactsHome } from './facts/FactsHome';
import { CategoryPage } from './facts/CategoryPage';
import { CollectionPage } from './facts/CollectionPage';
import { FactReader } from './facts/FactReader';

type Screen =
  | 'home' | 'explore' | 'category' | 'topic' | 'visualize' | 'quotes'
  | 'bookmarks' | 'profile' | 'notes'
  | 'facts-home' | 'facts-category' | 'facts-collection' | 'facts-reader';

const DISCLAIMER_VERSION = '1.0';
const SITE = 'MindTrace';

export default function App() {
  const [screen, setScreen] = useState<Screen>('home');
  const [activeCategory, setActiveCategory] = useState<CategoryId | null>(null);
  const [activeTopic, setActiveTopic] = useState<TopicId | null>(null);
  const [factsCategoryId, setFactsCategoryId] = useState<string | null>(null);
  const [factsCollectionId, setFactsCollectionId] = useState<string | null>(null);
  const [factsFactId, setFactsFactId] = useState<string | null>(null);

  const [searchOpen, setSearchOpen] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [booted, setBooted] = useState(false);

  const { stats, toggleBookmark, markTopicRead, addReadingTime, clearStats } = useUserStats();
  const { notes, addNote, removeNote, notesFor } = useNotes();

  useEffect(() => {
    const accepted = localStorage.getItem('mindtrace_disclaimer_version');
    if (accepted !== DISCLAIMER_VERSION) setShowDisclaimer(true);
    setBooted(true);
  }, []);

  // Per-view document title
  useEffect(() => {
    let title = SITE;
    if (screen === 'topic' && activeTopic) title = `${getTopicById(activeTopic)?.title ?? 'Entry'} · ${SITE}`;
    else if (screen === 'category' && activeCategory) title = `${getCategoryById(activeCategory)?.title ?? 'Module'} · ${SITE}`;
    else if (screen === 'explore') title = `Library · ${SITE}`;
    else if (screen === 'visualize') title = `Map · ${SITE}`;
    else if (screen === 'quotes') title = `Quotes · ${SITE}`;
    else if (screen === 'notes') title = `Notes & Highlights · ${SITE}`;
    else if (screen === 'bookmarks') title = `Saved · ${SITE}`;
    else if (screen === 'profile') title = `Profile · ${SITE}`;
    else if (screen === 'facts-home') title = `Facts · ${SITE}`;
    else if (screen === 'facts-reader' && factsFactId) title = `${getFactById(factsFactId)?.title ?? 'Fact'} · ${SITE}`;
    document.title = title;
  }, [screen, activeTopic, activeCategory, factsFactId]);

  // Keyboard: "/" or Cmd/Ctrl-K opens search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = ['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName);
      if ((e.key === '/' && !typing) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const go = (next: Screen) => {
    if (showDisclaimer) return;
    setScreen(next);
    window.scrollTo({ top: 0 });
  };

  const openCategory = (id: CategoryId) => {
    setActiveCategory(id);
    go('category');
  };

  const openTopic = (id: TopicId) => {
    setActiveTopic(id);
    go('topic');
    markTopicRead(id);
  };

  const openFact = (id: string) => {
    setFactsFactId(id);
    go('facts-reader');
  };

  const goBack = () => {
    if (screen === 'topic' && activeCategory) {
      setActiveTopic(null);
      go('category');
    } else if (screen === 'facts-reader' && factsCollectionId) {
      go('facts-collection');
    } else if (screen === 'facts-collection' && factsCategoryId) {
      go('facts-category');
    } else if (screen === 'facts-category') {
      go('facts-home');
    } else {
      setActiveCategory(null);
      setActiveTopic(null);
      go('home');
    }
  };

  const navKey: NavKey =
    screen === 'explore' || screen === 'category' || screen === 'topic' ? 'explore'
    : screen === 'visualize' ? 'visualize'
    : screen === 'quotes' ? 'quotes'
    : screen.startsWith('facts') ? 'facts'
    : screen === 'bookmarks' ? 'bookmarks'
    : screen === 'notes' ? 'notes'
    : screen === 'profile' ? 'profile'
    : 'home';

  const render = () => {
    switch (screen) {
      case 'home':
        return <HomeView onOpenCategory={openCategory} onOpenTopic={openTopic} onOpenFact={openFact} go={go} />;
      case 'explore':
        return <ExploreView onOpenCategory={openCategory} onOpenTopic={openTopic} onOpenFact={openFact} />;
      case 'category':
        return activeCategory ? (
          <CategoryView
            categoryId={activeCategory}
            onBack={goBack}
            onOpenTopic={openTopic}
            stats={stats}
            toggleBookmark={toggleBookmark}
          />
        ) : null;
      case 'topic':
        return activeTopic ? (
          <TopicView
            topicId={activeTopic}
            onBack={goBack}
            stats={stats}
            toggleBookmark={toggleBookmark}
            onOpenTopic={openTopic}
            addReadingTime={addReadingTime}
            notes={notesFor(activeTopic)}
            onAddNote={addNote}
            onDeleteNote={removeNote}
          />
        ) : null;
      case 'visualize':
        return (
          <Suspense fallback={<div className="max-w-6xl mx-auto px-5 md:px-8 pt-12 pb-24 text-[14px] text-muted">Loading the map…</div>}>
            <VisualizeView onOpenTopic={openTopic} />
          </Suspense>
        );
      case 'quotes':
        return <QuotesView />;
      case 'notes':
        return <NotesView notes={notes} removeNote={removeNote} onOpenTopic={openTopic} go={go} />;
      case 'bookmarks':
        return <BookmarksView stats={stats} toggleBookmark={toggleBookmark} onOpenTopic={openTopic} go={go} />;
      case 'profile':
        return <ProfileView stats={stats} go={go} clearStats={clearStats} noteCount={notes.length} />;
      case 'facts-home':
        return <FactsHome onBack={goBack} onOpenCategory={(id) => { setFactsCategoryId(id); go('facts-category'); }} />;
      case 'facts-category':
        return factsCategoryId ? (
          <CategoryPage
            categoryId={factsCategoryId}
            onBack={goBack}
            onOpenCollection={(id) => { setFactsCollectionId(id); go('facts-collection'); }}
          />
        ) : null;
      case 'facts-collection':
        return factsCollectionId ? (
          <CollectionPage
            collectionId={factsCollectionId}
            onBack={goBack}
            onOpenFact={openFact}
          />
        ) : null;
      case 'facts-reader':
        return factsFactId ? (
          <FactReader factId={factsFactId} onBack={goBack} onNavigateFact={setFactsFactId} />
        ) : null;
      default:
        return null;
    }
  };

  return (
    <>
      <a href="#main" className="skip-link">Skip to content</a>

      <AnimatePresence>
        {showDisclaimer && (
          <DisclaimerModal
            onAccept={() => { localStorage.setItem('mindtrace_disclaimer_version', DISCLAIMER_VERSION); setShowDisclaimer(false); }}
            onDecline={() => { window.location.href = 'https://google.com'; }}
          />
        )}
      </AnimatePresence>

      <div className={`min-h-screen bg-paper text-ink flex flex-col ${booted ? '' : 'opacity-0'}`}>
        <Masthead
          active={navKey}
          onNavigate={(k) => {
            if (k === 'home') go('home');
            else if (k === 'explore') go('explore');
            else if (k === 'visualize') go('visualize');
            else if (k === 'quotes') go('quotes');
            else if (k === 'facts') go('facts-home');
            else if (k === 'notes') go('notes');
            else if (k === 'bookmarks') go('bookmarks');
            else if (k === 'profile') go('profile');
          }}
          onSearch={() => setSearchOpen(true)}
        />

        <main id="main" className="flex-1 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={screen + (activeTopic ?? '') + (activeCategory ?? '') + (factsFactId ?? '')}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              {render()}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="border-t hairline mt-10">
          <div className="max-w-6xl mx-auto px-5 md:px-8 py-10 flex flex-col sm:flex-row gap-6 sm:items-start justify-between">
            <div>
              <div className="font-display text-[19px] font-semibold leading-none">
                <span className="text-ink">Mind</span><span className="text-accent">Trace</span>
              </div>
              <p className="mt-3 text-[13px] text-muted max-w-xs leading-relaxed">
                A reading library for psychology, relationships and human behaviour. Educational content only — not
                medical, legal or diagnostic advice.
              </p>
            </div>
            <nav aria-label="Footer" className="flex flex-wrap gap-x-7 gap-y-2.5 text-[13px]">
              {([
                ['Library', () => go('explore')],
                ['Facts', () => go('facts-home')],
                ['Quotes', () => go('quotes')],
                ['Map', () => go('visualize')],
                ['Notes', () => go('notes')],
                ['Saved', () => go('bookmarks')],
              ] as const).map(([label, fn]) => (
                <button key={label} onClick={fn} className="text-ink-soft hover:text-accent transition-colors">{label}</button>
              ))}
            </nav>
          </div>
        </footer>

        {/* Mobile bottom navigation */}
        <nav aria-label="Primary" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-paper/90 backdrop-blur-lg border-t hairline pb-safe">
          <div className="h-16 grid grid-cols-5">
            {([
              { key: 'home', icon: Search, label: 'Home' },
              { key: 'explore', icon: BookOpen, label: 'Library' },
              { key: 'visualize', icon: Waypoints, label: 'Map' },
              { key: 'notes', icon: StickyNote, label: 'Notes' },
              { key: 'profile', icon: UserIcon, label: 'Profile' },
            ] as const).map((item) => {
              const Icon = item.icon;
              const active = navKey === item.key;
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    if (item.key === 'home') go('home');
                    else if (item.key === 'explore') go('explore');
                    else if (item.key === 'visualize') go('visualize');
                    else if (item.key === 'notes') go('notes');
                    else go('profile');
                  }}
                  aria-current={active ? 'page' : undefined}
                  className={`flex flex-col items-center justify-center gap-1 text-[10px] font-medium tracking-wide transition-colors ${
                    active ? 'text-accent' : 'text-muted'
                  }`}
                >
                  <Icon className="w-[18px] h-[18px]" strokeWidth={active ? 2.2 : 1.8} />
                  {item.label}
                </button>
              );
            })}
          </div>
        </nav>
        <div className="md:hidden h-16" aria-hidden />
      </div>

      <SearchOverlay
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onOpenTopic={(id) => { setSearchOpen(false); openTopic(id); }}
        onOpenFact={(id) => { setSearchOpen(false); openFact(id); }}
      />
    </>
  );
}
