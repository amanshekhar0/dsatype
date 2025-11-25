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
    fetchRandomAlgorithm
  } = useAlgorithm();

  const {
    typingSectionRef,
    isCompleted
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
              className="bg-gray-800 text-gray-200 py-2 px-3 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="bg-gray-800 text-gray-200 py-2 px-3 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

          <button
            type="button"
            onClick={handleRandomClick}
            className="bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium py-2 px-4 rounded-md border border-gray-700 transition-colors duration-200"
          >
            Random Algorithm
          </button>
        </div>

        {/* Algorithm Info */}
        {currentAlgorithm ? (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold">{currentAlgorithm.title}</h2>
              <span
                className={`text-sm px-2 py-1 rounded-full ${currentAlgorithm.difficulty === 'Easy'
                  ? 'bg-green-900 text-green-300'
                  : currentAlgorithm.difficulty === 'Medium'
                    ? 'bg-yellow-900 text-yellow-300'
                    : 'bg-red-900 text-red-300'
                  }`}
              >
                {currentAlgorithm.difficulty}
              </span>
              <span className="text-sm bg-gray-800 px-2 py-1 rounded-full text-gray-300">
                {currentAlgorithm.category}
              </span>
            </div>
            <p className="text-gray-400 flex items-center gap-2">
              <BookOpenIcon size={16} />
              {currentAlgorithm.description}
            </p>
          </div>
        ) : (
          <div className="mb-6 text-gray-400">No algorithm selected.</div>
        )}

        {/* Typing Area */}
        {currentAlgorithm ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute top-2 right-2 flex items-center gap-1 text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                <CodeIcon size={14} /> <span className="ml-1">Target Code</span>
              </div>
              <TargetCode code={currentAlgorithm.code} />
            </div>

            <div className="relative">
              <div className="absolute top-2 right-2 flex items-center gap-1 text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                <MaximizeIcon size={14} /> <span className="ml-1">Your Input</span>
              </div>
              <TypingArea targetCode={currentAlgorithm.code} />
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
