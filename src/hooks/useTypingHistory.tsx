import { useEffect, useState } from 'react';
import { TypingAttempt } from '../types';

const HISTORY_KEY = 'typedsa_history';

function migrateAttempt(raw: Record<string, unknown>): TypingAttempt {
  return {
    id: (raw.id as string) ?? `legacy_${raw.timestamp}`,
    language: (raw.language as string) ?? 'Java',
    timestamp: raw.timestamp as number,
    algorithmTitle: raw.algorithmTitle as string,
    category: raw.category as string,
    difficulty: raw.difficulty as string,
    wpm: raw.wpm as number,
    cpm: raw.cpm as number,
    accuracy: raw.accuracy as number,
    mistakeCount: raw.mistakeCount as number,
    timeTakenInSeconds: raw.timeTakenInSeconds as number,
    userId: raw.userId as string | undefined,
  };
}

export const useTypingHistory = () => {
  const [history, setHistory] = useState<TypingAttempt[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Record<string, unknown>[];
        setHistory(parsed.map(migrateAttempt));
      } catch {
        localStorage.removeItem(HISTORY_KEY);
      }
    }
  }, []);

  const addAttempt = (attempt: TypingAttempt) => {
    setHistory(prev => {
      const updated = [attempt, ...prev].slice(0, 200);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  };

  return { history, addAttempt, clearHistory };
};
