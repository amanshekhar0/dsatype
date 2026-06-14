import { useMemo } from 'react';
import { TypingAttempt, UserStats } from '../types';
import { ACHIEVEMENTS, calculateLevel, calculateSessionXP } from '../data/achievements';

const DEFAULT_STATS: UserStats = {
  totalSessions: 0,
  totalTimeSeconds: 0,
  averageWpm: 0,
  bestWpm: 0,
  averageAccuracy: 0,
  currentStreak: 0,
  longestStreak: 0,
  totalXP: 0,
  level: 1,
  unlockedAchievements: [],
  lastActiveDate: '',
};

function computeStreak(history: TypingAttempt[]): { currentStreak: number; longestStreak: number } {
  if (history.length === 0) return { currentStreak: 0, longestStreak: 0 };

  const dateSet = new Set(
    history.map(h => new Date(h.timestamp).toISOString().split('T')[0])
  );
  const dates = [...dateSet].sort();

  let longestStreak = 1;
  let tempStreak = 1;

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1]).getTime();
    const curr = new Date(dates[i]).getTime();
    const diffDays = Math.round((curr - prev) / 86400000);
    if (diffDays === 1) {
      tempStreak++;
      longestStreak = Math.max(longestStreak, tempStreak);
    } else {
      tempStreak = 1;
    }
  }

  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const lastDate = dates[dates.length - 1];
  const currentStreak = lastDate === today || lastDate === yesterday ? tempStreak : 0;

  return { currentStreak, longestStreak };
}

export function useUserStats(history: TypingAttempt[]): UserStats {
  return useMemo(() => {
    if (history.length === 0) return DEFAULT_STATS;

    const totalSessions = history.length;
    const totalTimeSeconds = history.reduce((s, h) => s + h.timeTakenInSeconds, 0);
    const averageWpm = Math.round(history.reduce((s, h) => s + h.wpm, 0) / totalSessions);
    const bestWpm = Math.max(...history.map(h => h.wpm));
    const averageAccuracy = history.reduce((s, h) => s + h.accuracy, 0) / totalSessions;
    const { currentStreak, longestStreak } = computeStreak(history);
    const lastActiveDate = new Date(history[0].timestamp).toISOString().split('T')[0];

    const baseStats: UserStats = {
      totalSessions,
      totalTimeSeconds,
      averageWpm,
      bestWpm,
      averageAccuracy,
      currentStreak,
      longestStreak,
      totalXP: 0,
      level: 1,
      unlockedAchievements: [],
      lastActiveDate,
    };

    const unlockedAchievements = ACHIEVEMENTS
      .filter(a => a.check(baseStats, history))
      .map(a => a.id);

    const xpFromSessions = history.reduce(
      (s, h) => s + calculateSessionXP(h.wpm, h.accuracy, h.difficulty),
      0
    );
    const xpFromAchievements = ACHIEVEMENTS
      .filter(a => unlockedAchievements.includes(a.id))
      .reduce((s, a) => s + a.xpReward, 0);

    const totalXP = xpFromSessions + xpFromAchievements;

    return {
      ...baseStats,
      totalXP,
      level: calculateLevel(totalXP),
      unlockedAchievements,
    };
  }, [history]);
}
