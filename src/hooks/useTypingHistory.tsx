import { useEffect, useState } from 'react';
import { TypingAttempt } from '../types';
export const useTypingHistory = () => {
  const [history, setHistory] = useState<TypingAttempt[]>([]);
  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('typedsa_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to parse history from localStorage', error);
        localStorage.removeItem('typedsa_history');
      }
    }
  }, []);
  // Add a new attempt to history
  const addAttempt = (attempt: TypingAttempt) => {
    const updatedHistory = [attempt, ...history].slice(0, 100); // Keep only the last 100 attempts
    setHistory(updatedHistory);
    localStorage.setItem('typedsa_history', JSON.stringify(updatedHistory));
  };
  // Clear history
  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('typedsa_history');
  };
  return {
    history,
    addAttempt,
    clearHistory
  };
};