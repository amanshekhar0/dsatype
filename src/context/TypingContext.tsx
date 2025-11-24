import React, { useCallback, useEffect, useState, useRef, createContext, useContext, memo } from 'react';
import { useAlgorithm } from './AlgorithmContext';
import { useTypingHistory } from '../hooks/useTypingHistory';
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
  typingSectionRef: React.RefObject<HTMLElement>;
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
  const typingSectionRef = useRef<HTMLElement>(null);
  const {
    currentAlgorithm
  } = useAlgorithm();
  const {
    addAttempt
  } = useTypingHistory();
  // Calculate metrics - memoized
  const calculateMetrics = useCallback(() => {
    if (!startTime) {
      setWpm(0);
      setCpm(0);
      return;
    }
    const currentTime = endTime || new Date();
    const elapsed = currentTime.getTime() - startTime.getTime();
    const minutes = elapsed / 60000;
    const charCount = typedText.length;
    // Calculate WPM (5 characters = 1 word)
    const words = charCount / 5;
    const calculatedWpm = minutes > 0 ? words / minutes : 0;
    // Calculate CPM
    const calculatedCpm = minutes > 0 ? charCount / minutes : 0;
    setWpm(calculatedWpm);
    setCpm(calculatedCpm);
  }, [startTime, endTime, typedText.length]);
  // Calculate accuracy and count mistakes - memoized
  const calculateAccuracy = useCallback(() => {
    if (!currentAlgorithm || typedText.length === 0) {
      setAccuracy(100);
      setCorrectCharsCount(0);
      setMistakesCount(0);
      return;
    }
    let correct = 0;
    let mistakes = 0;
    const targetText = currentAlgorithm.code;
    const minLength = Math.min(typedText.length, targetText.length);
    for (let i = 0; i < minLength; i++) {
      if (typedText[i] === targetText[i]) {
        correct++;
      } else {
        mistakes++;
      }
    }
    setCorrectCharsCount(correct);
    setMistakesCount(mistakes);
    setAccuracy(correct / typedText.length * 100 || 100);
  }, [currentAlgorithm, typedText]);
  // Update metrics when relevant state changes
  useEffect(() => {
    calculateMetrics();
    calculateAccuracy();
  }, [calculateMetrics, calculateAccuracy]);
  // Check if typing is complete - memoized
  const checkCompletion = useCallback(() => {
    if (!currentAlgorithm) return;
    if (typedText.length === currentAlgorithm.code.length) {
      setIsRunning(false);
      const completionTime = new Date();
      setEndTime(completionTime);
      setIsCompleted(true);
      // Calculate final metrics
      const finalElapsed = completionTime.getTime() - (startTime?.getTime() || 0);
      const timeTaken = finalElapsed / 1000;
      // Save attempt to history
      addAttempt({
        timestamp: completionTime.getTime(),
        algorithmTitle: currentAlgorithm.title,
        category: currentAlgorithm.category,
        difficulty: currentAlgorithm.difficulty,
        wpm,
        cpm,
        accuracy,
        mistakeCount: mistakesCount,
        timeTakenInSeconds: Math.floor(timeTaken)
      });
    }
  }, [currentAlgorithm, typedText.length, startTime, wpm, cpm, accuracy, mistakesCount, addAttempt]);
  // Reset typing state - memoized
  const resetTyping = useCallback(() => {
    setTypedText('');
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
  }, []);
  // Scroll to typing section - memoized
  const scrollToTypingSection = useCallback(() => {
    typingSectionRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, []);
  // Update timer every 100ms while running
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning && startTime) {
      interval = setInterval(() => {
        const currentTime = new Date();
        const elapsed = currentTime.getTime() - startTime.getTime();
        setElapsedTime(elapsed);
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, startTime]);
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
    typingSectionRef
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