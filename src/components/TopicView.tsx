import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Bookmark, Share2, Clock, List, X, Quote as QuoteIcon, AlertTriangle, ShieldCheck, Lightbulb, BookOpen } from 'lucide-react';
import { TopicId, UserStats } from '../types';
import { getTopicById, getCategoryById, getTopicsByCategory, getRelatedTopics, getAllCategories } from '../content/content-index';
import { motion, useScroll, useSpring } from 'motion/react';

const LEAD_TITLES = ['Introduction', 'Quick Understanding', 'Overview', 'The Basics'];
const isExample = (t: string) => /example|scenario|phrase|conversation|script/i.test(t);
const isTakeaway = (t: string) => /key takeaway|key insight|bottom line|summary/i.test(t);
const isWarning = (t: string) => /warning|red flag|mistake|risk/i.test(t);
const isProtection = (t: string) => /protection|defence|defense|how to respond|counter/i.test(t);

export function TopicView({
  topicId,
  onBack,
  stats,
  toggleBookmark,
  onOpenTopic,
  addReadingTime,
}: {
  topicId: TopicId;
  onBack: () => void;
  stats: UserStats;
  toggleBookmark: (id: TopicId) => void;
  onOpenTopic: (id: TopicId) => void;
  addReadingTime?: (minutes: number) => void;
}) {
  const topic = getTopicById(topicId);
  const [toc, setToc] = useState(false);
  const counted = useRef(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      if (v > 0.92 && !counted.current && topic && addReadingTime) {
        counted.current = true;
        addReadingTime(topic.readTime);
      }
    });
    return () => unsub();
  }, [scrollYProgress, topic, addReadingTime]);

  useEffect(() => { counted.current = false; window.scrollTo({ top: 0 }); }, [topicId]);

  const related = useMemo(() => (topic ? getRelatedTopics(topic) : []), [topic]);
  if (!topic) return null;

  const category = getCategoryById(topic.category);
  const isSaved = stats.bookmarkedTopics.includes(topic.id);
  const moduleNo = getAllCategories().findIndex((c) => c.id === topic.category) + 1;

  const siblings = getTopicsByCategory(topic.category);
  const idx = siblings.findIndex((t) => t.id === topic.id);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx < siblings.length - 1 ? siblings[idx + 1] : null;

  const share = async () => {
    try { await navigator.share({ title: topic.title, text: topic.description, url: window.location.href }); } catch { /* cancelled */ }
  };

  const lead = topic.sections.find((s) => LEAD_TITLES.includes(s.title));
  const body = topic.sections.filter((s) => s !== lead);

  const renderSection = (section: { title: string; content: string | string[] }, n: number, i: number) => {
    const arr = Array.isArray(section.content) ? section.content : null;

    if (isExample(section.title)) {
      return (
        <section key={i} id={`s-${i}`} className="my-12">
          <div className="flex items-baseline gap-3 mb-5">
            <span className="sec-num">{String(n).padStart(2, '0')}</span>
            <h2 className="font-display text-[23px] font-medium text-ink flex items-center gap-2">
              <QuoteIcon className="w-4 h-4 text-accent" /> {section.title}
            </h2>
          </div>
          <div className="space-y-5">
            {(arr ?? [section.content as string]).map((ex, k) => (
              <blockquote key={k} className="border-l-2 border-accent pl-6 py-1 font-body italic text-[18.5px] leading-relaxed text-ink-soft">
                {ex}
              </blockquote>
            ))}
          </div>
        </section>
      );
    }

    if (isTakeaway(section.title)) {
      return (
        <section key={i} id={`s-${i}`} className="my-12 border-y-2 border-accent/70 py-7">
          <h2 className="font-display text-[16px] font-medium text-accent mb-3 flex items-center gap-2 uppercase tracking-wider">
            <Lightbulb className="w-4 h-4" /> {section.title}
          </h2>
          <p className="font-display text-[24px] leading-snug text-ink font-medium">
            {arr ? arr.join(' ') : section.content}
          </p>
        </section>
      );
    }

    const warn = isWarning(section.title);
    const prot = isProtection(section.title);

    return (
      <section key={i} id={`s-${i}`} className="my-12">
        <div className="flex items-baseline gap-3 mb-4">
          <span className="sec-num">{String(n).padStart(2, '0')}</span>
          <h2 className="font-display text-[25px] font-medium text-ink flex items-center gap-2.5">
            {warn && <AlertTriangle className="w-5 h-5 text-accent" />}
            {prot && <ShieldCheck className="w-5 h-5 text-accent" />}
            {section.title}
          </h2>
        </div>
        {arr ? (
          <ul className="space-y-3.5">
            {arr.map((item, k) => (
              <li key={k} className="flex items-start gap-3.5 font-body text-[18.5px] leading-relaxed text-ink-soft">
                <span className="mt-2.5 w-1.5 h-1.5 rounded-full shrink-0 bg-accent" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-body text-[18.5px] leading-[1.8] text-ink-soft">{section.content}</p>
        )}
      </section>
    );
  };

  return (
    <article className="relative">
      <motion.div className="fixed top-0 left-0 right-0 h-[3px] origin-left z-50 bg-accent" style={{ scaleX }} />

      <div className="sticky top-[62px] md:top-[104px] z-30 bg-paper border-b hairline">
        <div className="max-w-3xl mx-auto px-5 md:px-8 h-12 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 font-mono text-[10.5px] tracking-[0.16em] uppercase text-muted hover:text-accent transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> {category?.title ?? 'Back'}
          </button>
          <div className="flex items-center gap-1">
            <button onClick={() => setToc((v) => !v)} className="p-2 text-muted hover:text-ink transition-colors" aria-label="Contents"><List className="w-4 h-4" /></button>
            <button onClick={share} className="p-2 text-muted hover:text-ink transition-colors" aria-label="Share"><Share2 className="w-4 h-4" /></button>
            <button onClick={() => toggleBookmark(topic.id)} className="p-2 transition-colors" aria-label="Bookmark">
              <Bookmark className={`w-4 h-4 ${isSaved ? 'text-accent fill-current' : 'text-muted hover:text-ink'}`} />
            </button>
          </div>
        </div>
      </div>

      {toc && (
        <div className="fixed inset-0 z-40 flex justify-end" onClick={() => setToc(false)}>
          <div className="absolute inset-0 bg-ink/25" />
          <motion.aside
            initial={{ x: 40, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
            className="relative w-80 max-w-[86vw] h-full bg-surface border-l hairline p-7 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <span className="kicker">Contents</span>
              <button onClick={() => setToc(false)} className="text-muted hover:text-ink"><X className="w-4 h-4" /></button>
            </div>
            <ol className="space-y-3.5">
              {topic.sections.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-mono text-[11px] text-accent tnum pt-0.5">{String(i + 1).padStart(2, '0')}</span>
                  <a href={`#s-${i}`} onClick={() => setToc(false)} className="font-body text-[14.5px] text-ink-soft hover:text-accent leading-snug">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </motion.aside>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-5 md:px-8 pt-10 pb-24">
        <header className="mb-10">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5 font-mono text-[10.5px] tracking-[0.16em] uppercase">
            <span className="text-accent">{category?.title}</span>
            <span className="text-line-strong">/</span>
            <span className="text-faint">Module {String(moduleNo).padStart(2, '0')}</span>
            <span className="text-line-strong">/</span>
            <span className="text-muted flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {topic.readTime} min</span>
            {topic.difficulty && <><span className="text-line-strong">/</span><span className="text-muted">{topic.difficulty}</span></>}
          </div>
          <h1 className="font-display text-[44px] sm:text-[54px] leading-[1.02] font-semibold tracking-tight text-ink">
            {topic.title}
          </h1>
          <p className="standfirst mt-5">{topic.description}</p>
          <div className="mt-9 ornament"><span className="text-[13px] tracking-widest">❦</span></div>
        </header>

        <div className="reading">
          {lead && <p className="dropcap">{Array.isArray(lead.content) ? lead.content.join(' ') : lead.content}</p>}
          {body.map((s, i) => renderSection(s, i + 2, i))}
        </div>

        {topic.references && topic.references.length > 0 && (
          <section className="mt-14 pt-7 border-t hairline">
            <div className="kicker mb-4 flex items-center gap-2"><BookOpen className="w-3.5 h-3.5" /> Sources</div>
            <ul className="space-y-2.5">
              {topic.references.map((r, i) => (
                <li key={i} className="font-body text-[14px] text-ink-soft leading-snug">{r}</li>
              ))}
            </ul>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-14 pt-7 border-t hairline">
            <div className="kicker mb-2">Related reading</div>
            <div className="rule">
              {related.map((r) => (
                <button key={r.id} onClick={() => onOpenTopic(r.id)} className="w-full flex items-baseline justify-between gap-4 py-3.5 border-b hairline text-left group">
                  <span className="font-display text-[18px] font-medium text-ink group-hover:text-accent transition-colors">{r.title}</span>
                  <ArrowRight className="w-4 h-4 text-faint group-hover:text-accent transition-colors shrink-0" />
                </button>
              ))}
            </div>
          </section>
        )}

        <nav className="mt-12 pt-7 border-t hairline flex items-center justify-between gap-4">
          {prev ? (
            <button onClick={() => onOpenTopic(prev.id)} className="group text-left min-w-0">
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-faint flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5" /> Previous</span>
              <span className="font-display text-[17px] font-medium text-ink group-hover:text-accent transition-colors line-clamp-1">{prev.title}</span>
            </button>
          ) : <span />}
          {next ? (
            <button onClick={() => onOpenTopic(next.id)} className="group text-right min-w-0">
              <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-faint flex items-center gap-1 justify-end">Next <ArrowRight className="w-3.5 h-3.5" /></span>
              <span className="font-display text-[17px] font-medium text-ink group-hover:text-accent transition-colors line-clamp-1">{next.title}</span>
            </button>
          ) : <span />}
        </nav>
      </div>
    </article>
  );
}
