import { useCallback, useEffect, useState, createContext, useContext, ReactNode } from 'react';
import { algorithmData } from '../data/algorithms';
import { pythonAlgorithms } from '../data/python';
import { AlgorithmSnippet, Company, Difficulty, Language } from '../types';
import { generateQuestion } from '../services/grokApi';
import { useSettings } from './SettingsContext';

const ALL_COMPANIES: Company[] = ['Google', 'Amazon', 'Meta', 'Microsoft', 'Apple', 'Netflix', 'Goldman Sachs', 'Uber'];

interface AlgorithmContextType {
  currentAlgorithm: AlgorithmSnippet | null;
  categories: string[];
  difficulties: Difficulty[];
  selectedCategory: string;
  selectedDifficulty: Difficulty;
  setSelectedCategory: (c: string) => void;
  setSelectedDifficulty: (d: Difficulty) => void;
  fetchRandomAlgorithm: () => void;
  resetFilters: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isGenerating: boolean;
  generationError: string | null;
  generateWithAI: () => Promise<void>;
  displayCode: string;
  setCustomCode: (code: string, title?: string, language?: Language) => void;
  setQAAlgorithm: (qa: AlgorithmSnippet) => void;
  isCustomMode: boolean;
  // Company filtering
  selectedCompany: Company | 'All';
  setSelectedCompany: (c: Company | 'All') => void;
  availableCompanies: (Company | 'All')[];
  isInterviewMode: boolean;
  setIsInterviewMode: (v: boolean) => void;
}

const AlgorithmContext = createContext<AlgorithmContextType | undefined>(undefined);

function getPool(language: Language): AlgorithmSnippet[] {
  if (language === 'Python') return pythonAlgorithms;
  if (language === 'SQL') return algorithmData.filter(a => a.language === 'SQL');
  // Java & C++ share the same pool (non-SQL snippets)
  return algorithmData.filter(a => a.language !== 'SQL');
}

function getDisplayCode(algo: AlgorithmSnippet, language: Language): string {
  if (language === 'C++' && algo.codeCpp) return algo.codeCpp;
  return algo.code;
}

// Simple language detection heuristic
function detectLanguage(code: string): Language {
  const lower = code.toLowerCase();
  if (lower.includes('def ') && lower.includes(':') && !lower.includes('{')) return 'Python';
  if (lower.includes('select ') && (lower.includes(' from ') || lower.includes('insert '))) return 'SQL';
  if (lower.includes('#include') || lower.includes('std::') || lower.includes('vector<')) return 'C++';
  return 'Java';
}

export const AlgorithmProvider = ({ children }: { children: ReactNode }) => {
  const { settings } = useSettings();

  const [language, setLanguageState] = useState<Language>('Java');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('Easy');
  const [currentAlgorithm, setCurrentAlgorithm] = useState<AlgorithmSnippet | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | 'All'>('All');
  const [isInterviewMode, setIsInterviewMode] = useState(false);

  const pool = getPool(language);

  const categories = [
    'All',
    ...([...new Set(pool.map(a => a.category))] as string[]),
  ];
  const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard'];

  // Available companies from the current pool
  const availableCompanies: (Company | 'All')[] = [
    'All',
    ...ALL_COMPANIES.filter(c =>
      pool.some(a => a.companies?.includes(c))
    ),
  ];

  const fetchRandomAlgorithm = useCallback(() => {
    setIsCustomMode(false);
    const current = getPool(language);
    let filtered = current;

    // Apply company filter
    if (selectedCompany !== 'All') {
      filtered = filtered.filter(a => a.companies?.includes(selectedCompany as Company));
    }

    // In interview mode, prioritize company-tagged questions
    if (isInterviewMode && selectedCompany === 'All') {
      filtered = filtered.filter(a => a.companies && a.companies.length > 0);
    }

    // Apply difficulty filter
    const withDifficulty = filtered.filter(a => a.difficulty === selectedDifficulty);
    if (withDifficulty.length > 0) filtered = withDifficulty;

    // Apply category filter
    if (selectedCategory !== 'All') {
      const withCategory = filtered.filter(a => a.category === selectedCategory);
      if (withCategory.length > 0) filtered = withCategory;
    }

    // Fallback if no matches
    if (filtered.length === 0) filtered = current.filter(a => a.difficulty === selectedDifficulty);
    if (filtered.length === 0) filtered = current;

    setCurrentAlgorithm(filtered[Math.floor(Math.random() * filtered.length)]);
    setGenerationError(null);
  }, [language, selectedCategory, selectedDifficulty, selectedCompany, isInterviewMode]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    setSelectedCategory('All');
    setIsCustomMode(false);
  }, []);

  const resetFilters = useCallback(() => {
    setSelectedCategory('All');
    setSelectedDifficulty('Easy');
    setSelectedCompany('All');
    setIsInterviewMode(false);
    setIsCustomMode(false);
  }, []);

  const setCustomCode = useCallback((code: string, title?: string, lang?: Language) => {
    const detectedLang = lang || detectLanguage(code);
    setLanguageState(detectedLang);
    setIsCustomMode(true);
    setGenerationError(null);

    const customAlgo: AlgorithmSnippet = {
      id: `custom_${Date.now()}`,
      title: title || 'Custom Snippet',
      category: 'Custom',
      difficulty: 'Medium',
      language: detectedLang,
      description: 'Your pasted code snippet',
      code: code,
      isCustom: true,
    };
    setCurrentAlgorithm(customAlgo);
  }, []);

  const setQAAlgorithm = useCallback((qa: AlgorithmSnippet) => {
    setIsCustomMode(true);
    setLanguageState('Theory');
    setCurrentAlgorithm(qa);
  }, []);

  const generateWithAI = useCallback(async () => {
    const apiKey = settings.grokApiKey;
    if (!apiKey) {
      setGenerationError('AI generation is not configured on this server.');
      return;
    }
    setIsGenerating(true);
    setGenerationError(null);
    setIsCustomMode(false);
    const category = selectedCategory === 'All' ? 'General' : selectedCategory;
    const result = await generateQuestion(apiKey, language, selectedDifficulty, category);
    if (result) {
      setCurrentAlgorithm(result);
    } else {
      setGenerationError('AI generation failed — loaded a local question instead.');
      fetchRandomAlgorithm();
    }
    setIsGenerating(false);
  }, [settings.grokApiKey, language, selectedDifficulty, selectedCategory, fetchRandomAlgorithm]);

  // Reload when language or filters change (only if not in custom mode)
  useEffect(() => {
    if (!isCustomMode) {
      fetchRandomAlgorithm();
    }
  }, [fetchRandomAlgorithm, isCustomMode]);

  const displayCode = currentAlgorithm ? getDisplayCode(currentAlgorithm, language) : '';

  return (
    <AlgorithmContext.Provider
      value={{
        currentAlgorithm,
        categories,
        difficulties,
        selectedCategory,
        selectedDifficulty,
        setSelectedCategory,
        setSelectedDifficulty,
        fetchRandomAlgorithm,
        resetFilters,
        language,
        setLanguage,
        isGenerating,
        generationError,
        generateWithAI,
        displayCode,
        setCustomCode,
        setQAAlgorithm,
        isCustomMode,
        selectedCompany,
        setSelectedCompany,
        availableCompanies,
        isInterviewMode,
        setIsInterviewMode,
      }}
    >
      {children}
    </AlgorithmContext.Provider>
  );
};

export const useAlgorithm = () => {
  const ctx = useContext(AlgorithmContext);
  if (!ctx) throw new Error('useAlgorithm must be used within AlgorithmProvider');
  return ctx;
};
