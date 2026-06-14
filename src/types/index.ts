export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Language = 'Java' | 'C++' | 'Python' | 'SQL' | 'Theory';
export type VisualTheme = 'typewriter' | 'midnight' | 'daylight' | 'forest' | 'sakura';
export type AmbientSound = 'none' | 'typewriter' | 'rain' | 'cafe' | 'lofi';
export type Company = 'Google' | 'Amazon' | 'Meta' | 'Microsoft' | 'Apple' | 'Netflix' | 'Goldman Sachs' | 'Uber';

export interface AlgorithmSnippet {
  id: string;
  title: string;
  category: string;
  difficulty: Difficulty;
  language: string;
  description: string;
  code: string;
  codeCpp?: string;
  estimatedTime?: number;
  isGenerated?: boolean;
  isCustom?: boolean;
  companies?: Company[];
}

export interface TypingAttempt {
  id: string;
  timestamp: number;
  algorithmTitle: string;
  category: string;
  difficulty: string;
  language: string;
  wpm: number;
  cpm: number;
  accuracy: number;
  mistakeCount: number;
  timeTakenInSeconds: number;
  userId?: string;
  company?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: number;
  picture?: string;
}

export interface UserStats {
  totalSessions: number;
  totalTimeSeconds: number;
  averageWpm: number;
  bestWpm: number;
  averageAccuracy: number;
  currentStreak: number;
  longestStreak: number;
  totalXP: number;
  level: number;
  unlockedAchievements: string[];
  lastActiveDate: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  check: (stats: UserStats, history: TypingAttempt[]) => boolean;
}

export interface LeaderboardEntry {
  userId: string;
  username: string;
  bestWpm: number;
  averageWpm: number;
  totalSessions: number;
  averageAccuracy: number;
  totalXP: number;
  level: number;
  isCurrentUser?: boolean;
  picture?: string;
}

export interface KeyAccuracy {
  key: string;
  correct: number;
  incorrect: number;
  total: number;
  accuracy: number;
}

export interface AppSettings {
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  theme: 'dark' | 'light';
  visualTheme: VisualTheme;
  soundEffects: boolean;
  typingFeedback: boolean;
  showLineNumbers: boolean;
  caretStyle: 'line' | 'block' | 'underline';
  countdownDuration: number;
  grokApiKey: string;
  ambientSound: AmbientSound;
  showKeyboardHeatmap: boolean;
  smoothCaret: boolean;
}
