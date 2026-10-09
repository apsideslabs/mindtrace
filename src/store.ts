import { useState, useEffect, useCallback } from 'react';
import { UserStats, TopicId, Note } from './types';

const STATS_KEY = 'mindtrace_user_stats';
const NOTES_KEY = 'mindtrace_notes';

const DEFAULT_STATS: UserStats = {
  topicsRead: [],
  readingTimeMinutes: 0,
  bookmarkedTopics: [],
};

function loadStats(): UserStats {
  try {
    const saved = localStorage.getItem(STATS_KEY);
    if (saved) return { ...DEFAULT_STATS, ...JSON.parse(saved) };
  } catch {
    /* ignore malformed state */
  }
  return DEFAULT_STATS;
}

export function useUserStats() {
  const [stats, setStats] = useState<UserStats>(loadStats);

  useEffect(() => {
    try {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    } catch {
      /* storage may be unavailable */
    }
  }, [stats]);

  const toggleBookmark = (topicId: TopicId) =>
    setStats((prev) => {
      const has = prev.bookmarkedTopics.includes(topicId);
      return {
        ...prev,
        bookmarkedTopics: has
          ? prev.bookmarkedTopics.filter((id) => id !== topicId)
          : [...prev.bookmarkedTopics, topicId],
      };
    });

  const markTopicRead = (topicId: TopicId) =>
    setStats((prev) =>
      prev.topicsRead.includes(topicId) ? prev : { ...prev, topicsRead: [...prev.topicsRead, topicId] },
    );

  const addReadingTime = (minutes: number) =>
    setStats((prev) => ({ ...prev, readingTimeMinutes: prev.readingTimeMinutes + minutes }));

  const clearStats = () => setStats(DEFAULT_STATS);

  return { stats, toggleBookmark, markTopicRead, addReadingTime, clearStats };
}

function loadNotes(): Note[] {
  try {
    const saved = localStorage.getItem(NOTES_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {
    /* ignore malformed state */
  }
  return [];
}

const uid = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>(loadNotes);

  useEffect(() => {
    try {
      localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch {
      /* storage may be unavailable */
    }
  }, [notes]);

  const addNote = useCallback((topicId: TopicId, quote: string, body: string, color?: string) => {
    const trimmedBody = body.trim();
    const trimmedQuote = quote.trim();
    if (!trimmedBody && !trimmedQuote) return null;
    const note: Note = { id: uid(), topicId, quote: trimmedQuote, body: trimmedBody, color, createdAt: Date.now() };
    setNotes((prev) => [note, ...prev]);
    return note;
  }, []);

  const removeNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const clearNotes = useCallback(() => setNotes([]), []);

  const notesFor = useCallback((topicId: TopicId) => notes.filter((n) => n.topicId === topicId), [notes]);

  return { notes, addNote, removeNote, clearNotes, notesFor };
}
