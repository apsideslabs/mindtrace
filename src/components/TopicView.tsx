import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Bookmark, Share2, Clock, List, X, Quote as QuoteIcon, AlertTriangle, ShieldCheck, Lightbulb, StickyNote, Highlighter, Trash2 } from 'lucide-react';
import { TopicId, UserStats, Note } from '../types';
import { getTopicById, getCategoryById, getTopicsByCategory, getRelatedTopics, CATEGORY_ACCENT } from '../content/content-index';
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
  notes,
  onAddNote,
  onDeleteNote,
}: {
  topicId: TopicId;
  onBack: () => void;
  stats: UserStats;
  toggleBookmark: (id: TopicId) => void;
  onOpenTopic: (id: TopicId) => void;
  addReadingTime?: (minutes: number) => void;
  notes?: Note[];
  onAddNote?: (topicId: TopicId, quote: string, body: string) => void;
  onDeleteNote?: (id: string) => void;
}) {
  const topic = getTopicById(topicId);
  const [toc, setToc] = useState(false);
  const counted = useRef(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Notes / highlight state
  const [sel, setSel] = useState<{ text: string; x: number; y: number } | null>(null);
  const [composer, setComposer] = useState<{ quote: string } | null>(null);
  const [draft, setDraft] = useState('');
  const [savedFlash, setSavedFlash] = useState(false);
  const composerRef = useRef<HTMLTextAreaElement>(null);

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

  useEffect(() => {
    counted.current = false;
    setSel(null);
    setComposer(null);
    window.scrollTo({ top: 0 });
  }, [topicId]);

  // Clear the floating highlight button on scroll / resize
  useEffect(() => {
    const clear = () => setSel(null);
    window.addEventListener('scroll', clear, { passive: true });
    window.addEventListener('resize', clear);
    return () => {
      window.removeEventListener('scroll', clear);
      window.removeEventListener('resize', clear);
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (composer) setComposer(null);
      else setSel(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [composer]);

  useEffect(() => {
    if (composer) composerRef.current?.focus();
  }, [composer]);

  const related = useMemo(() => (topic ? getRelatedTopics(topic) : []), [topic]);
  if (!topic) return null;

  const category = getCategoryById(topic.category);
  const accent = CATEGORY_ACCENT[topic.category] ?? '#14120f';
  const isSaved = stats.bookmarkedTopics.includes(topic.id);
  const topicNotes = (notes ?? []).filter((n) => n.topicId === topic.id);

  const siblings = getTopicsByCategory(topic.category);
  const idx = siblings.findIndex((t) => t.id === topic.id);
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx < siblings.length - 1 ? siblings[idx + 1] : null;

  const share = async () => {
    try {
      await navigator.share({ title: topic.title, text: topic.description, url: window.location.href });
    } catch {
      /* user cancelled or unsupported */
    }
  };

  const handleSelection = () => {
    const s = window.getSelection();
    if (!s || s.isCollapsed) return;
    const text = s.toString().trim();
    if (text.length < 4) return;
    const range = s.getRangeAt(0);
    const node = range.commonAncestorContainer;
    const el = node.nodeType === 1 ? (node as Element) : node.parentElement;
    if (!el || !contentRef.current?.contains(el)) return;
    const rect = range.getBoundingClientRect();
    setSel({ text, x: Math.min(Math.max(rect.left + rect.width / 2, 80), window.innerWidth - 80), y: Math.max(rect.top - 12, 70) });
  };

  const openComposer = (quote: string) => {
    setSel(null);
    setDraft('');
    setComposer({ quote });
  };

  const saveNote = () => {
    if (!composer || !onAddNote) return;
    onAddNote(topic.id, composer.quote, draft);
    setComposer(null);
    setDraft('');
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2200);
  };

  const lead = topic.sections.find((s) => LEAD_TITLES.includes(s.title));
  const body = topic.sections.filter((s) => s !== lead);

  const renderSection = (section: { title: string; content: string | string[] }, i: number) => {
    const arr = Array.isArray(section.content) ? section.content : null;

    if (isExample(section.title)) {
      return (
        <section key={i} id={`s-${i}`} className="my-10">
          <h2 className="font-display text-[19px] font-semibold text-ink mb-4 flex items-center gap-2">
            <QuoteIcon className="w-4 h-4 text-accent" /> {section.title}
          </h2>
          <div className="space-y-4">
            {(arr ?? [section.content as string]).map((ex, k) => (
              <blockquote key={k} className="border-l-2 pl-5 py-1 italic text-[16px] text-ink-soft" style={{ borderColor: accent }}>
                {ex}
              </blockquote>
            ))}
          </div>
        </section>
      );
    }

    if (isTakeaway(section.title)) {
      return (
        <section key={i} id={`s-${i}`} className="my-10 rounded-2xl border hairline bg-paper p-6">
          <h2 className="font-display text-[16px] font-semibold text-ink mb-2 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-accent" /> {section.title}
          </h2>
          <p className="font-display text-[18px] leading-relaxed text-ink">
            {arr ? arr.join(' ') : section.content}
          </p>
        </section>
      );
    }

    const warn = isWarning(section.title);
    const prot = isProtection(section.title);

    return (
      <section key={i} id={`s-${i}`} className="my-10">
        <h2 className="font-display text-[22px] font-semibold text-ink mb-4 flex items-center gap-2">
          {warn && <AlertTriangle className="w-5 h-5 text-bad" />}
          {prot && <ShieldCheck className="w-5 h-5 text-good" />}
          {section.title}
        </h2>
        {arr ? (
          <ul className="space-y-3">
            {arr.map((item, k) => (
              <li key={k} className="flex items-start gap-3 text-[16.5px] leading-relaxed text-ink-soft">
                <span
                  className="mt-2 w-1.5 h-1.5 rounded-full shrink-0"
                  style={{ background: warn ? '#b23a2a' : prot ? '#2f7d5f' : accent }}
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-[17px] leading-[1.75] text-ink-soft">{section.content}</p>
        )}
      </section>
    );
  };

  return (
    <article className="relative">
      <motion.div className="fixed top-0 left-0 right-0 h-[3px] origin-left z-50" style={{ scaleX, background: accent }} />

      <div className="sticky top-16 z-30 bg-paper/90 backdrop-blur-md border-b hairline">
        <div className="max-w-3xl mx-auto px-5 md:px-8 h-12 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center gap-2 text-[13px] font-medium text-muted hover:text-ink transition-colors">
            <ArrowLeft className="w-4 h-4" /> {category?.title ?? 'Back'}
          </button>
          <div className="flex items-center gap-1">
            <button onClick={() => openComposer('')} className="p-2 rounded-full text-muted hover:text-ink transition-colors" aria-label="Add a note">
              <StickyNote className="w-4 h-4" />
            </button>
            <button onClick={() => setToc((v) => !v)} className="p-2 rounded-full text-muted hover:text-ink transition-colors" aria-label="Contents">
              <List className="w-4 h-4" />
            </button>
            <button onClick={share} className="p-2 rounded-full text-muted hover:text-ink transition-colors" aria-label="Share">
              <Share2 className="w-4 h-4" />
            </button>
            <button onClick={() => toggleBookmark(topic.id)} className="p-2 rounded-full transition-colors" aria-label="Bookmark">
              <Bookmark className={`w-4 h-4 ${isSaved ? 'text-accent fill-current' : 'text-muted hover:text-ink'}`} />
            </button>
          </div>
        </div>
      </div>

      {toc && (
        <div className="fixed inset-0 z-40 flex justify-end" onClick={() => setToc(false)}>
          <div className="absolute inset-0 bg-ink/20" />
          <motion.aside
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="relative w-72 max-w-[85vw] h-full bg-surface border-l hairline p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <span className="kicker">Contents</span>
              <button onClick={() => setToc(false)} className="text-muted hover:text-ink" aria-label="Close contents"><X className="w-4 h-4" /></button>
            </div>
            <ul className="space-y-3">
              {topic.sections.map((s, i) => (
                <li key={i}>
                  <a href={`#s-${i}`} onClick={() => setToc(false)} className="text-[13.5px] text-ink-soft hover:text-accent leading-snug block">
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </motion.aside>
        </div>
      )}

      <div className="max-w-2xl mx-auto px-5 md:px-8 pt-12 pb-24">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="kicker" style={{ color: accent }}>{category?.title}</span>
            <span className="text-faint">·</span>
            <span className="text-[12px] text-muted flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {topic.readTime} min read
            </span>
            {topic.difficulty && (
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted border hairline rounded-full px-2 py-0.5">
                {topic.difficulty}
              </span>
            )}
          </div>
          <h1 className="font-display text-[38px] sm:text-[46px] leading-[1.08] font-semibold tracking-tight text-ink">
            {topic.title}
          </h1>
          <p className="mt-5 text-[18px] leading-relaxed text-ink-soft">{topic.description}</p>
        </header>

        <div className="reading" ref={contentRef} onMouseUp={handleSelection} onTouchEnd={handleSelection}>
          {lead && (
            <p className="dropcap text-[18.5px] leading-[1.8] text-ink mb-8">
              {Array.isArray(lead.content) ? lead.content.join(' ') : lead.content}
            </p>
          )}
          {body.map((s, i) => renderSection(s, i))}
        </div>

        {/* Notes on this entry */}
        {(topicNotes.length > 0 || savedFlash) && (
          <section className="mt-14 pt-8 border-t hairline">
            <div className="flex items-center justify-between mb-4">
              <div className="kicker flex items-center gap-2">
                <StickyNote className="w-3.5 h-3.5" /> Your notes on this entry
              </div>
              {savedFlash && <span className="font-mono text-[11px] uppercase tracking-wider text-accent">Saved</span>}
            </div>
            <ul className="space-y-5">
              {topicNotes.map((n) => (
                <li key={n.id} className="group flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    {n.quote && (
                      <blockquote className="border-l-2 border-accent pl-4 italic text-[15px] text-ink-soft mb-2">{n.quote}</blockquote>
                    )}
                    {n.body && <p className="text-[15px] text-ink leading-relaxed whitespace-pre-wrap">{n.body}</p>}
                    <span className="mt-1.5 block font-mono text-[10.5px] uppercase tracking-wider text-faint">
                      {new Date(n.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <button onClick={() => onDeleteNote?.(n.id)} aria-label="Delete note" className="p-2 text-faint hover:text-accent transition-colors shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-14 pt-8 border-t hairline">
            <div className="kicker mb-4">Related reading</div>
            <div className="grid sm:grid-cols-2 gap-3">
              {related.map((r) => (
                <button key={r.id} onClick={() => onOpenTopic(r.id)} className="card p-4 text-left group">
                  <span className="font-display text-[16px] font-semibold text-ink group-hover:text-accent transition-colors">{r.title}</span>
                  <span className="block text-[12.5px] text-muted line-clamp-2 mt-1">{r.description}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        <nav className="mt-12 pt-8 border-t hairline flex items-center justify-between gap-4">
          {prev ? (
            <button onClick={() => onOpenTopic(prev.id)} className="group text-left min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-faint flex items-center gap-1"><ArrowLeft className="w-3.5 h-3.5" /> Previous</span>
              <span className="font-display text-[15px] font-semibold text-ink group-hover:text-accent transition-colors line-clamp-1">{prev.title}</span>
            </button>
          ) : <span />}
          {next ? (
            <button onClick={() => onOpenTopic(next.id)} className="group text-right min-w-0">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-faint flex items-center gap-1 justify-end">Next <ArrowRight className="w-3.5 h-3.5" /></span>
              <span className="font-display text-[15px] font-semibold text-ink group-hover:text-accent transition-colors line-clamp-1">{next.title}</span>
            </button>
          ) : <span />}
        </nav>
      </div>

      {/* Floating highlight button */}
      {sel && (
        <button
          onClick={() => openComposer(sel.text)}
          style={{ left: sel.x, top: sel.y }}
          className="fixed -translate-x-1/2 -translate-y-full z-40 flex items-center gap-1.5 bg-ink text-paper text-[12px] font-semibold px-3 py-2 rounded-full shadow-xl hover:bg-accent transition-colors"
        >
          <Highlighter className="w-3.5 h-3.5" /> Highlight
        </button>
      )}

      {/* Note composer */}
      {composer && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Add a note">
          <div className="absolute inset-0 bg-ink/30" onClick={() => setComposer(null)} />
          <div className="relative w-full max-w-lg bg-surface border hairline rounded-2xl shadow-2xl p-5 mt-fade">
            <div className="flex items-center justify-between mb-3">
              <span className="kicker flex items-center gap-2"><StickyNote className="w-3.5 h-3.5" /> New note</span>
              <button onClick={() => setComposer(null)} className="text-muted hover:text-ink" aria-label="Close"><X className="w-4 h-4" /></button>
            </div>
            {composer.quote && (
              <blockquote className="border-l-2 border-accent pl-4 italic text-[14px] text-ink-soft mb-3 max-h-24 overflow-y-auto">
                {composer.quote}
              </blockquote>
            )}
            <textarea
              ref={composerRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={3}
              placeholder="Add your note…"
              className="w-full bg-paper border hairline rounded-lg p-3 text-[14px] text-ink placeholder:text-faint outline-none focus:border-accent resize-y"
            />
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setComposer(null)} className="btn btn-ghost">Cancel</button>
              <button onClick={saveNote} className="btn btn-accent">Save note</button>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
