import React, { useState, useEffect, Suspense, lazy } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, BookOpen, Waypoints, Quote as QuoteIcon, Bookmark, User as UserIcon } from 'lucide-react';
import { useUserStats } from './store';
import { CategoryId, TopicId } from './types';

import { HomeView } from './components/HomeView';
import { ExploreView } from './components/ExploreView';
import { CategoryView } from './components/CategoryView';
import { TopicView } from './components/TopicView';
import { BookmarksView } from './components/BookmarksView';
import { ProfileView } from './components/ProfileView';
import { QuotesView } from './components/QuotesView';
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
  | 'bookmarks' | 'profile'
  | 'facts-home' | 'facts-category' | 'facts-collection' | 'facts-reader';

const DISCLAIMER_VERSION = '1.0';

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

  useEffect(() => {
    const accepted = localStorage.getItem('mindtrace_disclaimer_version');
    if (accepted !== DISCLAIMER_VERSION) setShowDisclaimer(true);
    setBooted(true);
  }, []);

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
      case 'bookmarks':
        return <BookmarksView stats={stats} toggleBookmark={toggleBookmark} onOpenTopic={openTopic} go={go} />;
      case 'profile':
        return <ProfileView stats={stats} go={go} clearStats={clearStats} />;
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
            else if (k === 'bookmarks') go('bookmarks');
            else if (k === 'profile') go('profile');
          }}
          onSearch={() => setSearchOpen(true)}
        />

        <main className="flex-1 w-full">
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

        {/* Mobile bottom navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-paper border-t-2 border-ink/10 pb-safe">
          <div className="h-16 grid grid-cols-5">
            {([
              { key: 'home', icon: Search, label: 'Home' },
              { key: 'explore', icon: BookOpen, label: 'Catalogue' },
              { key: 'visualize', icon: Waypoints, label: 'Map' },
              { key: 'quotes', icon: QuoteIcon, label: 'Quotes' },
              { key: 'profile', icon: UserIcon, label: 'Profile' },
            ] as const).map((item) => {
              const Icon = item.icon;
              const active = navKey === item.key || (item.key === 'home' && navKey === 'home');
              return (
                <button
                  key={item.key}
                  onClick={() => {
                    if (item.key === 'home') go('home');
                    else if (item.key === 'explore') go('explore');
                    else if (item.key === 'visualize') go('visualize');
                    else if (item.key === 'quotes') go('quotes');
                    else go('profile');
                  }}
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
