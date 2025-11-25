import React from 'react';
import { useAlgorithm } from '../context/AlgorithmContext';
import { useTyping } from '../context/TypingContext';
import { TargetCode } from './TargetCode';
import { TypingArea } from './TypingArea';
import { StatsBar } from './StatsBar';
import { ResultsAnalysis } from './ResultsAnalysis';
import { BookOpenIcon, CodeIcon, MaximizeIcon } from 'lucide-react';

export const TypingSection: React.FC = () => {
  const {
    currentAlgorithm,
    categories = [],
    difficulties = [],
    selectedCategory,
    selectedDifficulty,
    setSelectedCategory,
    setSelectedDifficulty,
    fetchRandomAlgorithm,
    language
  } = useAlgorithm();

  const {
    typingSectionRef,
    isCompleted,
    resetTyping
  } = useTyping();

  // Safety wrappers so component doesn't crash if context isn't providing setters/arrays
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeDifficulties = Array.isArray(difficulties) ? difficulties : [];

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (typeof setSelectedCategory === 'function') {
      setSelectedCategory(e.target.value);
    }
  };

  const handleDifficultyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (typeof setSelectedDifficulty === 'function') {
      setSelectedDifficulty(e.target.value);
    }
  };

  const handleRandomClick = () => {
    if (typeof fetchRandomAlgorithm === 'function') {
      fetchRandomAlgorithm();
    }
  };

  return (
    <section ref={typingSectionRef} className="w-full py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <label className="sr-only" htmlFor="category-select">Category</label>
            <select
              id="category-select"
              value={selectedCategory ?? 'All'}
              onChange={handleCategoryChange}
              className="bg-card text-foreground py-2 px-3 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="All">All Categories</option>
              {safeCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <label className="sr-only" htmlFor="difficulty-select">Difficulty</label>
            <select
              id="difficulty-select"
              value={selectedDifficulty ?? (safeDifficulties[0] ?? '')}
              onChange={handleDifficultyChange}
              className="bg-card text-foreground py-2 px-3 rounded-md border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {safeDifficulties.length === 0 ? (
                <option value="">No difficulties</option>
              ) : (
                safeDifficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty}
                  </option>
                ))
              )}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={resetTyping}
              className="bg-card hover:bg-muted text-foreground font-medium py-2 px-4 rounded-md border border-border transition-colors duration-200"
            >
              Restart
            </button>
            <button
              type="button"
              onClick={handleRandomClick}
              className="bg-card hover:bg-muted text-foreground font-medium py-2 px-4 rounded-md border border-border transition-colors duration-200"
            >
              Random Algorithm
            </button>
          </div>
        </div>

        {/* Algorithm Info */}
        {currentAlgorithm ? (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold text-foreground">{currentAlgorithm.title}</h2>
              <span
                className={`text-sm px-2 py-1 rounded-full ${currentAlgorithm.difficulty === 'Easy'
                  ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                  : currentAlgorithm.difficulty === 'Medium'
                    ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                    : 'bg-red-500/20 text-red-600 dark:text-red-400'
                  }`}
              >
                {currentAlgorithm.difficulty}
              </span>
              <span className="text-sm bg-card px-2 py-1 rounded-full text-muted-foreground border border-border">
                {currentAlgorithm.category}
              </span>
            </div>
            <p className="text-muted-foreground flex items-center gap-2">
              <BookOpenIcon size={16} />
              {currentAlgorithm.description}
            </p>
          </div>
        ) : (
          <div className="mb-6 text-muted-foreground">No algorithm selected.</div>
        )}

        {/* Typing Area */}
        {currentAlgorithm ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute top-2 right-2 flex items-center gap-1 text-xs text-muted-foreground bg-card px-2 py-1 rounded border border-border">
                <CodeIcon size={14} /> <span className="ml-1">Target Code ({language})</span>
              </div>
              <TargetCode code={(language === 'C++' && currentAlgorithm.codeCpp) ? currentAlgorithm.codeCpp : currentAlgorithm.code} />
            </div>

            <div className="relative">
              <div className="absolute top-2 right-2 flex items-center gap-1 text-xs text-muted-foreground bg-card px-2 py-1 rounded border border-border">
                <MaximizeIcon size={14} /> <span className="ml-1">Your Input</span>
              </div>
              <TypingArea targetCode={(language === 'C++' && currentAlgorithm.codeCpp) ? currentAlgorithm.codeCpp : currentAlgorithm.code} />
            </div>
          </div>
        ) : null}

        {/* Stats Bar */}
        <div className="mt-6">
          <StatsBar />
        </div>

        {/* Results Analysis */}
        {isCompleted && (
          <div className="mt-6">
            <ResultsAnalysis />
          </div>
        )}
      </div>
    </section>
  );
};
