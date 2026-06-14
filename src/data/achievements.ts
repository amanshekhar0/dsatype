import { Achievement, UserStats, TypingAttempt } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_session',
    title: 'First Steps',
    description: 'Complete your very first typing session.',
    icon: '🎯',
    xpReward: 50,
    check: (stats: UserStats, _: TypingAttempt[]) => stats.totalSessions >= 1,
  },
  {
    id: 'speed_50',
    title: 'Speed Demon',
    description: 'Reach 50 WPM in a single session.',
    icon: '⚡',
    xpReward: 75,
    check: (_: UserStats, history: TypingAttempt[]) => history.some(h => h.wpm >= 50),
  },
  {
    id: 'speed_80',
    title: 'Lightning Fast',
    description: 'Reach 80 WPM in a single session.',
    icon: '🔥',
    xpReward: 150,
    check: (_: UserStats, history: TypingAttempt[]) => history.some(h => h.wpm >= 80),
  },
  {
    id: 'speed_100',
    title: 'The Flash',
    description: 'Reach 100 WPM in a single session.',
    icon: '💫',
    xpReward: 300,
    check: (_: UserStats, history: TypingAttempt[]) => history.some(h => h.wpm >= 100),
  },
  {
    id: 'accuracy_99',
    title: 'Precision Master',
    description: 'Achieve 99%+ accuracy in a session.',
    icon: '🎯',
    xpReward: 100,
    check: (_: UserStats, history: TypingAttempt[]) => history.some(h => h.accuracy >= 99),
  },
  {
    id: 'perfect_accuracy',
    title: 'Perfect Score',
    description: 'Complete a session with 100% accuracy.',
    icon: '💯',
    xpReward: 200,
    check: (_: UserStats, history: TypingAttempt[]) => history.some(h => h.accuracy >= 100),
  },
  {
    id: 'sessions_10',
    title: 'Getting Consistent',
    description: 'Complete 10 typing sessions.',
    icon: '📈',
    xpReward: 100,
    check: (stats: UserStats, _: TypingAttempt[]) => stats.totalSessions >= 10,
  },
  {
    id: 'sessions_50',
    title: 'Dedicated Developer',
    description: 'Complete 50 typing sessions.',
    icon: '🏆',
    xpReward: 250,
    check: (stats: UserStats, _: TypingAttempt[]) => stats.totalSessions >= 50,
  },
  {
    id: 'sessions_100',
    title: 'Code Master',
    description: 'Complete 100 typing sessions.',
    icon: '👑',
    xpReward: 500,
    check: (stats: UserStats, _: TypingAttempt[]) => stats.totalSessions >= 100,
  },
  {
    id: 'streak_3',
    title: 'Streak Starter',
    description: 'Maintain a 3-day practice streak.',
    icon: '🔥',
    xpReward: 75,
    check: (stats: UserStats, _: TypingAttempt[]) => stats.longestStreak >= 3,
  },
  {
    id: 'streak_7',
    title: 'Weekly Warrior',
    description: 'Maintain a 7-day practice streak.',
    icon: '🌟',
    xpReward: 200,
    check: (stats: UserStats, _: TypingAttempt[]) => stats.longestStreak >= 7,
  },
  {
    id: 'hard_difficulty',
    title: 'Hard Mode Hero',
    description: 'Complete a Hard difficulty snippet.',
    icon: '💪',
    xpReward: 100,
    check: (_: UserStats, history: TypingAttempt[]) => history.some(h => h.difficulty === 'Hard'),
  },
  {
    id: 'polyglot',
    title: 'Polyglot Programmer',
    description: 'Practice in 3 different programming languages.',
    icon: '🌍',
    xpReward: 150,
    check: (_: UserStats, history: TypingAttempt[]) => {
      const langs = new Set(history.map(h => h.language));
      return langs.size >= 3;
    },
  },
  {
    id: 'speed_accuracy_combo',
    title: 'Efficient Coder',
    description: 'Achieve 70+ WPM with 95%+ accuracy in one session.',
    icon: '⚡🎯',
    xpReward: 200,
    check: (_: UserStats, history: TypingAttempt[]) =>
      history.some(h => h.wpm >= 70 && h.accuracy >= 95),
  },
];

export function calculateSessionXP(wpm: number, accuracy: number, difficulty: string): number {
  const base = 10;
  const wpmBonus = Math.floor(wpm / 5);
  const accBonus = Math.floor(accuracy / 10);
  const mult = difficulty === 'Hard' ? 2 : difficulty === 'Medium' ? 1.5 : 1;
  return Math.floor((base + wpmBonus + accBonus) * mult);
}

export function calculateLevel(totalXP: number): number {
  return Math.max(1, Math.floor(1 + Math.sqrt(totalXP / 50)));
}

export function xpForLevel(level: number): number {
  return 50 * level * level;
}
