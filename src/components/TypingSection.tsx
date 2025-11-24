import React, { useRef } from 'react';
import { useAlgorithm } from '../context/AlgorithmContext';
import { useTyping } from '../context/TypingContext';
import { TargetCode } from './TargetCode';
import { TypingArea } from './TypingArea';
import { StatsBar } from './StatsBar';
import { ResultsModal } from './ResultsModal';
import { BookOpenIcon, CodeIcon, MaximizeIcon } from 'lucide-react';
export const TypingSection = () => {
  const {
    currentAlgorithm,
    categories,
    difficulties,
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
  return <section ref={typingSectionRef} className="w-full py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} className="bg-gray-800 text-gray-200 py-2 px-3 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="All">All Categories</option>
              {categories.map(category => <option key={category} value={category}>
                  {category}
                </option>)}
            </select>
            <select value={selectedDifficulty} onChange={e => setSelectedDifficulty(e.target.value)} className="bg-gray-800 text-gray-200 py-2 px-3 rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              {difficulties.map(difficulty => <option key={difficulty} value={difficulty}>
                  {difficulty}
                </option>)}
            </select>
          </div>
          <button onClick={fetchRandomAlgorithm} className="bg-gray-800 hover:bg-gray-700 text-gray-200 font-medium py-2 px-4 rounded-md border border-gray-700 transition-colors duration-200">
            Random Algorithm
          </button>
        </div>
        {/* Algorithm Info */}
        {currentAlgorithm && <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <h2 className="text-2xl font-bold">{currentAlgorithm.title}</h2>
              <span className={`text-sm px-2 py-1 rounded-full ${currentAlgorithm.difficulty === 'Easy' ? 'bg-green-900 text-green-300' : currentAlgorithm.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' : 'bg-red-900 text-red-300'}`}>
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
          </div>}
        {/* Typing Area */}
        {currentAlgorithm && <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute top-2 right-2 flex items-center gap-1 text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                <CodeIcon size={14} /> Target Code
              </div>
              <TargetCode code={currentAlgorithm.code} />
            </div>
            <div className="relative">
              <div className="absolute top-2 right-2 flex items-center gap-1 text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">
                <MaximizeIcon size={14} /> Your Input
              </div>
              <TypingArea targetCode={currentAlgorithm.code} />
            </div>
          </div>}
        {/* Stats Bar */}
        <StatsBar />
        {/* Results Modal */}
        {isCompleted && <ResultsModal />}
      </div>
    </section>;
};