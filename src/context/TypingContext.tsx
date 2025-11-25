import React, { useCallback, useEffect, useState, useRef, createContext, useContext, ReactNode } from 'react';
import { useAlgorithm } from './AlgorithmContext';
import { useTypingHistory } from '../hooks/useTypingHistory';
import { TypingAttempt } from '../types';

interface TypingContextType {
  typedText: string;
  setTypedText: (text: string) => void;
  isRunning: boolean;
  setIsRunning: (isRunning: boolean) => void;
  startTime: Date | null;
  setStartTime: (date: Date) => void;
  endTime: Date | null;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  mistakesCount: number;
  correctCharsCount: number;
  elapsedTime: number;
  wpm: number;
  cpm: number;
  accuracy: number;
  isCompleted: boolean;
  checkCompletion: () => void;
  resetTyping: () => void;
  scrollToTypingSection: () => void;
  wpmHistory: { time: number; wpm: number }[];
  typingSectionRef: React.RefObject<HTMLElement>;
  history: TypingAttempt[];
  clearHistory: () => void;
}

const TypingContext = createContext<TypingContextType | undefined>(undefined);

export const TypingProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const [typedText, setTypedText] = useState<string>('');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [mistakesCount, setMistakesCount] = useState<number>(0);
  const [correctCharsCount, setCorrectCharsCount] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [wpm, setWpm] = useState<number>(0);
  const [cpm, setCpm] = useState<number>(0);
  const [accuracy, setAccuracy] = useState<number>(100);
  const [wpmHistory, setWpmHistory] = useState<{ time: number; wpm: number }[]>([]);

  const typingSectionRef = useRef<HTMLElement>(null);

  const {
    currentAlgorithm
  } = useAlgorithm();

  const { history, addAttempt, clearHistory } = useTypingHistory();

  const checkCompletion = useCallback(() => {
    // Prevent multiple triggers if already completed
    if (isCompleted) return;

    if (currentAlgorithm && currentIndex >= currentAlgorithm.code.length) {
      setIsCompleted(true);
      const end = new Date();
      setEndTime(end);
      setIsRunning(false);

      // Calculate final stats
      if (startTime) {
        const elapsed = end.getTime() - startTime.getTime();
        const timeInSeconds = Math.floor(elapsed / 1000);
        const minutes = elapsed / 60000;
        const charCount = typedText.length;
        const words = charCount / 5;
        const finalWpm = minutes > 0 ? words / minutes : 0;

        // Calculate mistakes and accuracy
        let mistakes = 0;
        const minLength = Math.min(typedText.length, currentAlgorithm.code.length);
        for (let i = 0; i < minLength; i++) {
          if (typedText[i] !== currentAlgorithm.code[i]) {
            mistakes++;
          }
        }
        // Add extra characters as mistakes if typedText is longer
        if (typedText.length > currentAlgorithm.code.length) {
          mistakes += typedText.length - currentAlgorithm.code.length;
        }

        const finalAccuracy = charCount > 0 ? Math.max(0, ((charCount - mistakes) / charCount) * 100) : 100;
        const finalCpm = minutes > 0 ? charCount / minutes : 0;

        setMistakesCount(mistakes);
        setAccuracy(finalAccuracy);

        addAttempt({
          timestamp: end.getTime(),
          algorithmTitle: currentAlgorithm.title,
          category: currentAlgorithm.category,
          difficulty: currentAlgorithm.difficulty,
          wpm: Math.round(finalWpm),
          cpm: Math.round(finalCpm),
          accuracy: finalAccuracy,
          mistakeCount: mistakes,
          timeTakenInSeconds: timeInSeconds
        });
      }
    }
  }, [currentIndex, currentAlgorithm, startTime, typedText, addAttempt, isCompleted]);

  // Trigger checkCompletion when currentIndex changes
  useEffect(() => {
    checkCompletion();
  }, [checkCompletion]);

  const resetTyping = useCallback(() => {
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
    setTypedText('');
    setIsRunning(false);
  }, []);

  const scrollToTypingSection = useCallback(() => {
    typingSectionRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, []);

  // Update timer and WPM history
  useEffect(() => {
    let interval: NodeJS.Timeout;
    let historyInterval: NodeJS.Timeout;

    if (isRunning && startTime) {
      // Update elapsed time for UI every 100ms
      interval = setInterval(() => {
        const currentTime = new Date();
        const elapsed = currentTime.getTime() - startTime.getTime();
        setElapsedTime(elapsed);
      }, 100);

      // Track WPM history every 1 second
      historyInterval = setInterval(() => {
        const currentTime = new Date();
        const elapsed = currentTime.getTime() - startTime.getTime();
        const timeInSeconds = Math.floor(elapsed / 1000);

        // Calculate current WPM
        const minutes = elapsed / 60000;
        const charCount = typedText.length;
        const words = charCount / 5;
        const currentWpm = minutes > 0 ? words / minutes : 0;

        setWpmHistory(prev => [...prev, { time: timeInSeconds, wpm: Math.round(currentWpm) }]);
        setWpm(Math.round(currentWpm));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
      if (historyInterval) clearInterval(historyInterval);
    };
  }, [isRunning, startTime, typedText.length]);

  // Reset typing when algorithm changes
  useEffect(() => {
    resetTyping();
  }, [currentAlgorithm, resetTyping]);

  return <TypingContext.Provider value={{
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
    checkCompletion,
    resetTyping,
    scrollToTypingSection,
    typingSectionRef,
    wpmHistory,
    history,
    clearHistory
  }}>
    {children}
  </TypingContext.Provider>;
};

export const useTyping = () => {
  const context = useContext(TypingContext);
  if (context === undefined) {
    throw new Error('useTyping must be used within a TypingProvider');
  }
  return context;
};