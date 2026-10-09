import React, { useMemo } from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { CategoryId, TopicId } from '../types';
import { getAllCategories, getTopicsByCategory, getTopicById, getRelatedTopics, getTopicCount } from '../content/content-index';
import { allCollections } from '../content/facts';

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

  const edition = useMemo(() => {
    if (!featured) return [];
    const picks = [
      ...getRelatedTopics(featured),
      getTopicsByCategory('persuasion')[0],
      getTopicsByCategory('relationships')[0],
      getTopicsByCategory('cognitive-biases')[0],
    ].filter(Boolean).filter((t) => t!.id !== featured.id);
    const seen = new Set<string>();
    return picks.filter((t) => (seen.has(t!.id) ? false : (seen.add(t!.id), true))).slice(0, 4);
  }, [featured]);

  const briefs = useMemo(() => {
    if (!featured) return [];
    return [getTopicsByCategory('social-psychology')[0], getTopicsByCategory('power-dynamics')[0], getTopicsByCategory('deception-detection')[0]]
      .filter(Boolean)
      .filter((t) => t!.id !== featured.id);
  }, [featured]);

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

  const featuredCat = featured ? categories.find((c) => c.id === featured.category) : null;

  return (
    <div className="max-w-6xl mx-auto px-5 md:px-8 pt-6 md:pt-8 pb-20">
      {/* ---- Lead ---- */}
      <section className="rule-red pt-7 grid md:grid-cols-12 gap-x-12 gap-y-10">
        <div className="md:col-span-8">
          {featured && (
            <>
              <div className="kicker kicker-accent mb-5">Lead entry — {featuredCat?.title}</div>
              <button onClick={() => onOpenTopic(featured.id)} className="block text-left group">
                <h1 className="font-display text-[46px] sm:text-[62px] md:text-[70px] leading-[0.98] font-semibold tracking-tight text-ink group-hover:text-accent transition-colors">
                  {featured.title}
                </h1>
                <p className="standfirst mt-6 max-w-2xl">{featured.description}</p>
                <span className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase text-accent">
                  Read the entry <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
            </>
          )}

          {lastRead && (
            <div className="mt-6 rule pt-5 flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="kicker">Continue</span>
              <button onClick={() => onOpenTopic(lastRead.id)} className="link font-display text-[18px] font-medium">
                {lastRead.title}
              </button>
              <span className="font-mono text-[11px] text-faint flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {lastRead.readTime} min
              </span>
            </div>
          )}
          {briefs.length > 0 && (
            <div className="mt-7 rule pt-5">
              <div className="kicker mb-1">Also worth reading</div>
              {briefs.map((t) => (
                <button key={t!.id} onClick={() => onOpenTopic(t!.id)} className="w-full flex items-baseline justify-between gap-4 py-3 border-b hairline text-left group">
                  <span className="min-w-0">
                    <span className="font-display text-[17px] font-medium text-ink group-hover:text-accent transition-colors">{t!.title}</span>
                    <span className="block font-mono text-[10px] tracking-[0.14em] uppercase text-faint mt-1">{categories.find((c) => c.id === t!.category)?.title}</span>
                  </span>
                  <ArrowRight className="w-4 h-4 text-faint group-hover:text-accent transition-colors shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* In this edition */}
        <aside className="md:col-span-4 md:border-l hairline md:pl-10">
          <div className="kicker mb-4">In this edition</div>
          <ol className="rule">
            {edition.map((t, i) => (
              <li key={t!.id} className="border-b hairline">
                <button onClick={() => onOpenTopic(t!.id)} className="w-full flex items-baseline gap-3 py-4 text-left group">
                  <span className="font-mono text-[11px] text-faint tnum shrink-0">{String(i + 1).padStart(2, '0')}</span>
                  <span className="min-w-0">
                    <span className="block font-display text-[17px] font-medium text-ink group-hover:text-accent transition-colors leading-snug">
                      {t!.title}
                    </span>
                    <span className="block font-mono text-[10px] tracking-[0.14em] uppercase text-faint mt-1">
                      {categories.find((c) => c.id === t!.category)?.title}
                    </span>
                  </span>
                </button>
              </li>
            ))}
          </ol>
          <button onClick={() => go('explore')} className="mt-5 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase text-ink hover:text-accent transition-colors">
            Full catalogue <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </aside>
      </section>

      {/* ---- The catalogue ---- */}
      <section className="rule-ink pt-7 mt-8">
        <div className="flex items-end justify-between mb-2">
          <h2 className="font-display text-[30px] font-semibold text-ink">The catalogue</h2>
          <span className="kicker">{totalTopics} entries · {categories.length} modules</span>
        </div>
        <div className="grid sm:grid-cols-2 gap-x-12">
          {categories.map((c, i) => {
            const count = getTopicsByCategory(c.id).length;
            return (
              <button key={c.id} onClick={() => onOpenCategory(c.id)} className="group flex items-baseline gap-4 py-3.5 text-left border-b hairline">
                <span className="font-mono text-[12px] text-accent tnum w-6 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-display text-[18px] font-medium text-ink group-hover:text-accent transition-colors shrink-0">
                  {c.title}
                </span>
                <span className="flex-1 border-b border-dotted border-line-strong translate-y-[-4px] min-w-4" />
                <span className="font-mono text-[11px] text-faint tnum shrink-0">{count}</span>
              </button>
            );
          })}
        </div>
      </section>

      {/* ---- Research note + tools ---- */}
      <section className="rule-ink pt-7 mt-12 grid md:grid-cols-12 gap-x-12 gap-y-8">
        {dailyFact && (
          <div className="md:col-span-8">
            <div className="kicker kicker-accent mb-4">Research note</div>
            <button onClick={() => onOpenFact(dailyFact.id)} className="text-left group block">
              <h3 className="font-display text-[28px] sm:text-[34px] leading-[1.12] font-semibold text-ink group-hover:text-accent transition-colors">
                {dailyFact.title}
              </h3>
              <p className="standfirst mt-4 max-w-2xl line-clamp-3">{dailyFact.summary}</p>
            </button>
          </div>
        )}
        <div className="md:col-span-4 md:border-l hairline md:pl-10">
          <div className="kicker mb-4">Reference tools</div>
          <div className="rule">
            <button onClick={() => go('visualize')} className="w-full flex items-center justify-between py-3.5 border-b hairline group">
              <span className="font-display text-[17px] font-medium text-ink group-hover:text-accent transition-colors">The map</span>
              <ArrowRight className="w-4 h-4 text-faint group-hover:text-accent transition-colors" />
            </button>
            <button onClick={() => go('quotes')} className="w-full flex items-center justify-between py-3.5 border-b hairline group">
              <span className="font-display text-[17px] font-medium text-ink group-hover:text-accent transition-colors">Quotes</span>
              <ArrowRight className="w-4 h-4 text-faint group-hover:text-accent transition-colors" />
            </button>
            <button onClick={() => go('facts-home')} className="w-full flex items-center justify-between py-3.5 border-b hairline group">
              <span className="font-display text-[17px] font-medium text-ink group-hover:text-accent transition-colors">Facts</span>
              <ArrowRight className="w-4 h-4 text-faint group-hover:text-accent transition-colors" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
