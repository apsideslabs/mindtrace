import React, { useMemo } from 'react';
import { ArrowRight, ArrowUpRight, Clock, BookOpen, Sparkles } from 'lucide-react';
import { CategoryId, TopicId } from '../types';
import { getAllCategories, getTopicsByCategory, getTopicById, getRelatedTopics, CATEGORY_ACCENT, getTopicCount } from '../content/content-index';
import { allCollections, getFactById } from '../content/facts';
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

  const featuredRelated = featured ? getRelatedTopics(featured).slice(0, 3) : [];

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 pt-12 md:pt-16 pb-24">
      {/* Masthead / hero */}
      <section className="border-b hairline pb-10 mb-12">
        <div className="kicker mb-4">A reading library for human behaviour</div>
        <h1 className="font-display text-[40px] leading-[1.05] sm:text-[56px] md:text-[68px] font-semibold tracking-tight text-ink max-w-4xl">
          Understand people.<br className="hidden sm:block" /> Understand yourself.
        </h1>
        <p className="mt-6 text-[17px] leading-relaxed text-ink-soft max-w-2xl">
          {totalTopics} structured topics across {categories.length} modules — psychology, relationships,
          influence, negotiation and the quiet mechanics of everyday behaviour. Read, bookmark, and come back.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button onClick={() => go('explore')} className="btn btn-primary">
            Browse the library <ArrowRight className="w-4 h-4" />
          </button>
          <button onClick={() => go('facts-home')} className="btn btn-ghost">
            Explore facts
          </button>
        </div>
      </section>

      {/* Continue reading */}
      {lastRead && (
        <section className="mb-12">
          <div className="kicker mb-3">Continue reading</div>
          <button
            onClick={() => onOpenTopic(lastRead.id)}
            className="card w-full text-left p-5 flex items-center gap-4 group"
          >
            <span className="w-11 h-11 rounded-full bg-accent-soft flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-accent" />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block font-display text-[18px] font-semibold text-ink truncate">{lastRead.title}</span>
              <span className="block text-[13px] text-muted mt-0.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {lastRead.readTime} min read
              </span>
            </span>
            <ArrowUpRight className="w-5 h-5 text-muted group-hover:text-accent transition-colors" />
          </button>
        </section>
      )}

      {/* Featured */}
      {featured && (
        <section className="mb-14">
          <div className="kicker mb-3">Featured</div>
          <div className="grid md:grid-cols-5 gap-6 md:gap-10 items-start">
            <div className="md:col-span-3">
              <button onClick={() => onOpenTopic(featured.id)} className="block text-left group">
                <h2 className="font-display text-[32px] sm:text-[40px] leading-[1.1] font-semibold text-ink group-hover:text-accent transition-colors">
                  {featured.title}
                </h2>
                <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">{featured.description}</p>
                <span className="mt-5 inline-flex items-center gap-2 text-[13px] font-semibold text-accent">
                  Read the entry <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </button>
            </div>
            <div className="md:col-span-2">
              <div className="border-l hairline pl-5 space-y-4">
                <div className="kicker">Explore next</div>
                {featuredRelated.map((r) => (
                  <button key={r.id} onClick={() => onOpenTopic(r.id)} className="block text-left group">
                    <span className="font-display text-[17px] font-medium text-ink group-hover:text-accent transition-colors">
                      {r.title}
                    </span>
                    <span className="block text-[13px] text-muted line-clamp-1 mt-0.5">{r.description}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Modules */}
      <section className="mb-14">
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="kicker mb-1">The modules</div>
            <h2 className="font-display text-2xl font-semibold text-ink">Browse by theme</h2>
          </div>
          <button onClick={() => go('explore')} className="text-[13px] font-semibold text-accent hover:underline hidden sm:block">
            View all
          </button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {categories.slice(0, 6).map((c) => {
            const Icon = getCategoryIcon(c.iconName);
            const count = getTopicsByCategory(c.id).length;
            const accent = CATEGORY_ACCENT[c.id] ?? '#14120f';
            return (
              <button key={c.id} onClick={() => onOpenCategory(c.id)} className="card p-5 text-left group">
                <div className="flex items-center justify-between mb-3">
                  <span className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: `${accent}14`, color: accent }}>
                    <Icon className="w-[18px] h-[18px]" />
                  </span>
                  <span className="text-[11px] font-semibold text-muted tabular-nums">{count}</span>
                </div>
                <h3 className="font-display text-[17px] font-semibold text-ink group-hover:text-accent transition-colors">{c.title}</h3>
                <p className="mt-1 text-[13px] text-muted leading-relaxed line-clamp-2">{c.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      {/* Daily fact + tools */}
      <section className="grid md:grid-cols-3 gap-4">
        {dailyFact && (
          <div className="md:col-span-2 card p-6">
            <div className="kicker mb-3 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-accent" /> Fact of the day
            </div>
            <button onClick={() => onOpenFact(dailyFact.id)} className="text-left group">
              <h3 className="font-display text-[21px] font-semibold text-ink leading-snug group-hover:text-accent transition-colors">
                {dailyFact.title}
              </h3>
              <p className="mt-3 text-[14px] text-ink-soft leading-relaxed line-clamp-3">{dailyFact.summary}</p>
            </button>
          </div>
        )}
        <div className="card p-6 flex flex-col justify-between gap-6">
          <div>
            <div className="kicker mb-2">Tools</div>
            <p className="text-[13px] text-muted leading-relaxed">
              See how every concept connects in the interactive map, or browse quotes by theme.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <button onClick={() => go('visualize')} className="btn btn-ghost justify-between w-full">
              Open the map <ArrowRight className="w-4 h-4" />
            </button>
            <button onClick={() => go('quotes')} className="btn btn-ghost justify-between w-full">
              Read quotes <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
