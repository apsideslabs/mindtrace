import { useState, useEffect } from 'react';
import { UserStats, TopicId } from './types';

const STATS_KEY = 'mindtrace_user_stats';

const DEFAULT_STATS: UserStats = {
  topicsRead: [],
  readingTimeMinutes: 0,
  bookmarkedTopics: [],
};

function load(): UserStats {
  try {
    const saved = localStorage.getItem(STATS_KEY);
    if (saved) return { ...DEFAULT_STATS, ...JSON.parse(saved) };
  } catch {
    /* ignore malformed state */
  }
  return DEFAULT_STATS;
}

export function useUserStats() {
  const [stats, setStats] = useState<UserStats>(load);

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
