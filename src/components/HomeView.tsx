import React, { useMemo } from 'react';
import { ArrowRight, ArrowUpRight, Clock, BookOpen, Sparkles, Waypoints } from 'lucide-react';
import { CategoryId, TopicId } from '../types';
import { getAllCategories, getTopicsByCategory, getTopicById, getRelatedTopics, CATEGORY_ACCENT, getTopicCount } from '../content/content-index';
import { allCollections } from '../content/facts';
import { getCategoryIcon } from '../utils/icons';

type Go = (screen: any) => void;

const FEATURED_ID = 'gaslighting';

export function HomeView({
  onOpenCategory,
  onOpenTopic,
  onOpenFact,
  go,
}: {
  onOpenCategory: (id: CategoryId) => void;
  onOpenTopic: (id: TopicId) => void;
  onOpenFact: (id: string) => void;
  go: Go;
}) {
  const categories = getAllCategories();
  const totalTopics = getTopicCount();
  const featured = getTopicById(FEATURED_ID) ?? getTopicsByCategory('manipulation')[0];
  const featuredRelated = featured ? getRelatedTopics(featured).slice(0, 3) : [];

  const now = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  const dailyFact = useMemo(() => {
    const all = allCollections.flatMap((c) => c.facts);
    if (!all.length) return null;
    const seed = Math.floor(Date.now() / (1000 * 60 * 60 * 6));
    return all[seed % all.length];
  }, []);

  const lastRead = useMemo(() => {
    const ids = JSON.parse(localStorage.getItem('mindtrace_user_stats') || '{}')?.topicsRead as string[] | undefined;
    if (!ids?.length) return null;
    return getTopicById(ids[ids.length - 1]) ?? null;
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 pt-10 md:pt-14 pb-24">
      {/* Running line */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] uppercase tracking-[0.16em] text-muted border-b hairline pb-4 mb-10">
        <span>{totalTopics} entries</span>
        <span className="text-line-strong">·</span>
        <span>{categories.length} modules</span>
        <span className="text-line-strong">·</span>
        <span>A reading library</span>
        <span className="text-line-strong hidden sm:inline">·</span>
        <span className="hidden sm:inline">{now}</span>
      </div>

      {/* Hero */}
      <section className="mb-14">
        <h1 className="font-display text-[42px] leading-[1.03] sm:text-[58px] md:text-[72px] font-semibold tracking-tight text-ink max-w-4xl">
          Understand people.<br className="hidden sm:block" /> Understand yourself.
        </h1>
        <p className="font-body mt-6 text-[19px] leading-relaxed text-ink-soft max-w-2xl">
          A structured library of psychology, relationships, influence and the quiet mechanics of
          everyday behaviour — written to be read slowly, and kept.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button onClick={() => go('explore')} className="btn btn-primary">
            Open the catalogue <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={() => go('facts-home')} className="btn btn-ghost">
            Browse the facts
          </button>
        </div>
      </section>

      {/* Continue reading */}
      {lastRead && (
        <section className="mb-12">
          <div className="kicker mb-3">Continue reading</div>
          <button onClick={() => onOpenTopic(lastRead.id)} className="card w-full text-left p-5 flex items-center gap-4 group">
            <span className="w-11 h-11 rounded-full bg-accent-soft flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-accent" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block font-display text-[18px] font-semibold text-ink truncate">{lastRead.title}</span>
              <span className="block text-[12.5px] text-muted mt-0.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {lastRead.readTime} min read
              </span>
            </span>
            <ArrowUpRight className="w-5 h-5 text-muted group-hover:text-accent transition-colors" />
          </button>
        </section>
      )}

      {/* Lead entry */}
      {featured && (
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <span className="kicker text-gold">Lead entry</span>
            <span className="h-px flex-1 bg-line" />
          </div>
          <div className="grid md:grid-cols-5 gap-8 md:gap-12 items-start">
            <div className="md:col-span-3">
              <button onClick={() => onOpenTopic(featured.id)} className="block text-left group">
                <h2 className="font-display text-[34px] sm:text-[44px] leading-[1.08] font-semibold text-ink group-hover:text-accent transition-colors">
                  {featured.title}
                </h2>
                <p className="font-body mt-4 text-[18px] leading-relaxed text-ink-soft">{featured.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-[12.5px] font-semibold uppercase tracking-[0.12em] text-accent">
                  Read the entry <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </button>
            </div>
            <div className="md:col-span-2">
              <div className="border-l hairline pl-6 space-y-5">
                <div className="kicker">Read next</div>
                {featuredRelated.map((r) => (
                  <button key={r.id} onClick={() => onOpenTopic(r.id)} className="block text-left group">
                    <span className="font-display text-[17px] font-medium text-ink group-hover:text-accent transition-colors">
                      {r.title}
                    </span>
                    <span className="block font-body text-[13.5px] text-muted line-clamp-2 mt-1 leading-relaxed">{r.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Catalogue */}
      <section className="mb-16">
        <div className="flex items-end justify-between mb-6">
          <div>
            <div className="kicker mb-1.5">The catalogue</div>
            <h2 className="font-display text-[26px] font-semibold text-ink">Fourteen modules</h2>
          </div>
          <button onClick={() => go('explore')} className="text-[12.5px] font-semibold uppercase tracking-[0.12em] text-accent hover:text-accent-deep hidden sm:block">
            View all
          </button>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-10">
          {categories.map((c, i) => {
            const Icon = getCategoryIcon(c.iconName);
            const count = getTopicsByCategory(c.id).length;
            const accent = CATEGORY_ACCENT[c.id] ?? '#17140f';
            return (
              <button
                key={c.id}
                onClick={() => onOpenCategory(c.id)}
                className="group flex items-center gap-4 py-4 text-left border-b hairline"
              >
                <span className="font-mono text-[12px] text-faint w-6 shrink-0 tabular-nums">{String(i + 1).padStart(2, '0')}</span>
                <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${accent}14`, color: accent }}>
                  <Icon className="w-[17px] h-[17px]" />
                </span>
                <span className="flex-1 min-w-0">
                  <span className="block font-display text-[17px] font-semibold text-ink group-hover:text-accent transition-colors">{c.title}</span>
                  <span className="block font-body text-[13px] text-muted line-clamp-1">{c.description}</span>
                </span>
                <span className="text-[11px] font-semibold text-faint tabular-nums shrink-0 w-8 text-right">{count}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Research note + tools */}
      <section className="grid md:grid-cols-3 gap-5">
        {dailyFact && (
          <div className="md:col-span-2 card p-7">
            <div className="kicker mb-4 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-gold" /> Research note
            </div>
            <button onClick={() => onOpenFact(dailyFact.id)} className="text-left group">
              <h3 className="font-display text-[23px] font-semibold text-ink leading-snug group-hover:text-accent transition-colors">
                {dailyFact.title}
              </h3>
              <p className="font-body mt-3 text-[15.5px] text-ink-soft leading-relaxed line-clamp-3">{dailyFact.summary}</p>
            </button>
          </div>
        )}
        <div className="card p-7 flex flex-col justify-between gap-6">
          <div>
            <div className="kicker mb-2">Reference tools</div>
            <p className="font-body text-[14px] text-muted leading-relaxed">
              Trace how concepts connect in the map, or read the collection by theme.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={() => go('visualize')} className="btn btn-ghost justify-between w-full">
              <span className="flex items-center gap-2"><Waypoints className="w-4 h-4" /> Open the map</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => go('quotes')} className="btn btn-ghost justify-between w-full">
              <span className="flex items-center gap-2"><BookOpen className="w-4 h-4" /> Read quotes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
