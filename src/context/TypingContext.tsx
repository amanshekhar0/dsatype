import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  createContext,
  useContext,
  ReactNode,
} from 'react';
import { useAlgorithm } from './AlgorithmContext';
import { useTypingHistory } from '../hooks/useTypingHistory';
import { useSettings } from './SettingsContext';
import { useAuth } from './AuthContext';
import { TypingAttempt, KeyAccuracy } from '../types';

interface TypingContextType {
  typedText: string;
  setTypedText: (text: string) => void;
  isRunning: boolean;
  setIsRunning: (v: boolean) => void;
  startTime: Date | null;
  setStartTime: (d: Date) => void;
  endTime: Date | null;
  currentIndex: number;
  setCurrentIndex: (i: number) => void;
  mistakesCount: number;
  correctCharsCount: number;
  elapsedTime: number;
  wpm: number;
  cpm: number;
  accuracy: number;
  isCompleted: boolean;
  resetTyping: () => void;
  scrollToTypingSection: () => void;
  wpmHistory: { time: number; wpm: number }[];
  typingSectionRef: React.RefObject<HTMLElement>;
  history: TypingAttempt[];
  clearHistory: () => void;
  countdownRemaining: number | null;
  focusMode: boolean;
  setFocusMode: (v: boolean) => void;
  keyAccuracyMap: Record<string, KeyAccuracy>;
}

const TypingContext = createContext<TypingContextType | undefined>(undefined);

export const TypingProvider = ({ children }: { children: ReactNode }) => {
  const [typedText, setTypedTextRaw] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mistakesCount, setMistakesCount] = useState(0);
  const [correctCharsCount, setCorrectCharsCount] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [cpm, setCpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [wpmHistory, setWpmHistory] = useState<{ time: number; wpm: number }[]>([]);
  const [countdownRemaining, setCountdownRemaining] = useState<number | null>(null);
  const [focusMode, setFocusMode] = useState(false);
  const [keyAccuracyMap, setKeyAccuracyMap] = useState<Record<string, KeyAccuracy>>({});

  const typingSectionRef = useRef<HTMLElement>(null);
  const isCompletedRef = useRef(false);
  const prevTypedLengthRef = useRef(0);

  const { currentAlgorithm, displayCode, language } = useAlgorithm();
  const { history, addAttempt, clearHistory } = useTypingHistory();
  const { settings } = useSettings();
  const { user } = useAuth();

  // Track per-key accuracy when typed text changes
  const setTypedText = useCallback((newText: string) => {
    const prevLen = prevTypedLengthRef.current;
    const newLen = newText.length;

    // Only track new characters (not deletions)
    if (newLen > prevLen && displayCode) {
      for (let i = prevLen; i < newLen; i++) {
        const typed = newText[i];
        const expected = displayCode[i];
        if (expected !== undefined) {
          const keyLower = expected.toLowerCase();
          setKeyAccuracyMap(prev => {
            const existing = prev[keyLower] || { key: keyLower, correct: 0, incorrect: 0, total: 0, accuracy: 0 };
            const isCorrect = typed === expected;
            const updated: KeyAccuracy = {
              key: keyLower,
              correct: existing.correct + (isCorrect ? 1 : 0),
              incorrect: existing.incorrect + (isCorrect ? 0 : 1),
              total: existing.total + 1,
              accuracy: 0,
            };
            updated.accuracy = updated.total > 0 ? (updated.correct / updated.total) * 100 : 0;
            return { ...prev, [keyLower]: updated };
          });
        }
      }
    }

    prevTypedLengthRef.current = newLen;
    setTypedTextRaw(newText);
  }, [displayCode]);

  const finishSession = useCallback(
    (end: Date, typed: string, targetCode: string, elapsed: number) => {
      if (isCompletedRef.current) return;
      isCompletedRef.current = true;

      setIsCompleted(true);
      setEndTime(end);
      setIsRunning(false);

      if (!startTime || !currentAlgorithm) return;

      const minutes = elapsed / 60000;
      const charCount = typed.length;
      const finalWpm = minutes > 0 ? Math.round((charCount / 5) / minutes) : 0;
      const finalCpm = minutes > 0 ? Math.round(charCount / minutes) : 0;

      let mistakes = 0;
      const minLen = Math.min(typed.length, targetCode.length);
      for (let i = 0; i < minLen; i++) {
        if (typed[i] !== targetCode[i]) mistakes++;
      }
      if (typed.length > targetCode.length) mistakes += typed.length - targetCode.length;

      const finalAccuracy =
        charCount > 0 ? Math.max(0, ((charCount - mistakes) / charCount) * 100) : 0;

      setMistakesCount(mistakes);
      setAccuracy(finalAccuracy);

      const attempt: TypingAttempt = {
        id: `attempt_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
        timestamp: end.getTime(),
        algorithmTitle: currentAlgorithm.title,
        category: currentAlgorithm.category,
        difficulty: currentAlgorithm.difficulty,
        language,
        wpm: finalWpm,
        cpm: finalCpm,
        accuracy: finalAccuracy,
        mistakeCount: mistakes,
        timeTakenInSeconds: Math.floor(elapsed / 1000),
        userId: user?.id,
      };
      addAttempt(attempt);
    },
    [startTime, currentAlgorithm, language, user, addAttempt]
  );

  // Check completion when currentIndex reaches end of code
  useEffect(() => {
    if (isCompletedRef.current || !isRunning || !currentAlgorithm) return;
    if (currentIndex >= displayCode.length && displayCode.length > 0) {
      const end = new Date();
      const elapsed = end.getTime() - (startTime?.getTime() ?? end.getTime());
      finishSession(end, typedText, displayCode, elapsed);
    }
  }, [currentIndex, displayCode, isRunning, currentAlgorithm, startTime, typedText, finishSession]);

  // Countdown timer
  useEffect(() => {
    if (!isRunning || isCompletedRef.current || settings.countdownDuration === 0) return;
    if (countdownRemaining === null) {
      setCountdownRemaining(settings.countdownDuration);
      return;
    }
    if (countdownRemaining <= 0) {
      const end = new Date();
      const elapsed = end.getTime() - (startTime?.getTime() ?? end.getTime());
      finishSession(end, typedText, displayCode, elapsed);
      return;
    }
    const timer = setTimeout(() => setCountdownRemaining(r => (r !== null ? r - 1 : null)), 1000);
    return () => clearTimeout(timer);
  }, [isRunning, countdownRemaining, settings.countdownDuration, startTime, typedText, displayCode, finishSession]);

  // Elapsed time + WPM tracking
  useEffect(() => {
    if (!isRunning || !startTime) return;

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime.getTime();
      setElapsedTime(elapsed);
    }, 100);

    const wpmInterval = setInterval(() => {
      const elapsed = Date.now() - startTime.getTime();
      const minutes = elapsed / 60000;
      const currentWpm = minutes > 0 ? Math.round((typedText.length / 5) / minutes) : 0;
      setWpm(currentWpm);
      setCpm(minutes > 0 ? Math.round(typedText.length / minutes) : 0);
      setWpmHistory(prev => [
        ...prev,
        { time: Math.floor(elapsed / 1000), wpm: currentWpm },
      ]);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(wpmInterval);
    };
  }, [isRunning, startTime, typedText.length]);

  const resetTyping = useCallback(() => {
    isCompletedRef.current = false;
    prevTypedLengthRef.current = 0;
    setTypedTextRaw('');
    setIsRunning(false);
    setStartTime(null);
    setEndTime(null);
    setCurrentIndex(0);
    setMistakesCount(0);
    setCorrectCharsCount(0);
    setElapsedTime(0);
    setIsCompleted(false);
    setWpm(0);
    setCpm(0);
    setAccuracy(100);
    setWpmHistory([]);
    setCountdownRemaining(null);
    setKeyAccuracyMap({});
  }, []);

  // Reset when algorithm changes
  useEffect(() => {
    resetTyping();
  }, [currentAlgorithm, resetTyping]);

  const scrollToTypingSection = useCallback(() => {
    typingSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <TypingContext.Provider
      value={{
        typedText,
        setTypedText,
        isRunning,
        setIsRunning,
        startTime,
        setStartTime,
        endTime,
        currentIndex,
        setCurrentIndex,
        mistakesCount,
        correctCharsCount,
        elapsedTime,
        wpm,
        cpm,
        accuracy,
        isCompleted,
        resetTyping,
        scrollToTypingSection,
        typingSectionRef,
        wpmHistory,
        history,
        clearHistory,
        countdownRemaining,
        focusMode,
        setFocusMode,
        keyAccuracyMap,
      }}
    >
      {children}
    </TypingContext.Provider>
  );
};

export const useTyping = () => {
  const ctx = useContext(TypingContext);
  if (!ctx) throw new Error('useTyping must be used within TypingProvider');
  return ctx;
};
