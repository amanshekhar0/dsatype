import { useCallback, useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { algorithmData } from '../data/algorithms';
import { AlgorithmSnippet } from '../types';
interface AlgorithmContextType {
  currentAlgorithm: AlgorithmSnippet | null;
  categories: string[];
  difficulties: string[];
  selectedCategory: string;
  selectedDifficulty: string;
  setSelectedCategory: (category: string) => void;
  setSelectedDifficulty: (difficulty: string) => void;
  fetchRandomAlgorithm: () => void;
  resetFilters: () => void;
}
const AlgorithmContext = createContext<AlgorithmContextType | undefined>(undefined);
export const AlgorithmProvider = ({
  children
}: {
  children: ReactNode;
}) => {
  const [currentAlgorithm, setCurrentAlgorithm] = useState<AlgorithmSnippet | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('Easy');
  // Extract unique categories from data
  const categories = [...new Set(algorithmData.map(algo => algo.category))];
  const difficulties = ['Easy', 'Medium', 'Hard'];
  // Fetch a random algorithm based on selected filters - memoized to prevent infinite loops
  const fetchRandomAlgorithm = useCallback(() => {
    let filtered = [...algorithmData];
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(algo => algo.category === selectedCategory);
    }
    filtered = filtered.filter(algo => algo.difficulty === selectedDifficulty);
    if (filtered.length === 0) {
      // If no algorithms match filters, reset to all algorithms of selected difficulty
      filtered = algorithmData.filter(algo => algo.difficulty === selectedDifficulty);
    }
    // Get a random algorithm from filtered list
    const randomIndex = Math.floor(Math.random() * filtered.length);
    setCurrentAlgorithm(filtered[randomIndex]);
  }, [selectedCategory, selectedDifficulty]);
  // Reset filters to default
  const resetFilters = useCallback(() => {
    setSelectedCategory('All');
    setSelectedDifficulty('Easy');
  }, []);
  // Load initial algorithm on mount and when filters change
  useEffect(() => {
    fetchRandomAlgorithm();
  }, [fetchRandomAlgorithm]);
  return <AlgorithmContext.Provider value={{
    currentAlgorithm,
    categories,
    difficulties,
    selectedCategory,
    selectedDifficulty,
    setSelectedCategory,
    setSelectedDifficulty,
    fetchRandomAlgorithm,
    resetFilters
  }}>
    {children}
  </AlgorithmContext.Provider>;
};
export const useAlgorithm = () => {
  const context = useContext(AlgorithmContext);
  if (context === undefined) {
    throw new Error('useAlgorithm must be used within an AlgorithmProvider');
  }
  return context;
};