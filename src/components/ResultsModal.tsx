import { useTyping } from '../context/TypingContext';
import { useAlgorithm } from '../context/AlgorithmContext';
import { ClockIcon, ZapIcon, PercentIcon, AlertTriangleIcon, RefreshCwIcon, ShuffleIcon, SlidersIcon } from 'lucide-react';
export const ResultsModal = () => {
  const {
    wpm,
    accuracy,
    mistakesCount,
    elapsedTime,
    resetTyping
  } = useTyping();
  const {
    currentAlgorithm,
    fetchRandomAlgorithm,
    resetFilters
  } = useAlgorithm();
  const handleRetrySame = () => {
    resetTyping();
  };
  const handleRandomAlgorithm = () => {
    fetchRandomAlgorithm();
    resetTyping();
  };
  const handleChangeDifficulty = () => {
    resetFilters();
    resetTyping();
  };
  return <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
    <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 max-w-md w-full">
      <h2 className="text-2xl font-bold mb-1">Completed!</h2>
      <div className="mb-4">
        <h3 className="text-xl">{currentAlgorithm?.title}</h3>
        <div className="flex gap-2 text-sm">
          <span className={`px-2 py-0.5 rounded-full ${currentAlgorithm?.difficulty === 'Easy' ? 'bg-green-900 text-green-300' : currentAlgorithm?.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' : 'bg-red-900 text-red-300'}`}>
            {currentAlgorithm?.difficulty}
          </span>
          <span className="bg-gray-700 px-2 py-0.5 rounded-full">
            {currentAlgorithm?.category}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-700 p-3 rounded-lg flex flex-col items-center">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <ZapIcon size={16} />
            <span>WPM</span>
          </div>
          <span className="text-2xl font-mono">{Math.round(wpm)}</span>
        </div>
        <div className="bg-gray-700 p-3 rounded-lg flex flex-col items-center">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <PercentIcon size={16} />
            <span>Accuracy</span>
          </div>
          <span className="text-2xl font-mono">{accuracy.toFixed(1)}%</span>
        </div>
        <div className="bg-gray-700 p-3 rounded-lg flex flex-col items-center">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <AlertTriangleIcon size={16} />
            <span>Mistakes</span>
          </div>
          <span className="text-2xl font-mono">{mistakesCount}</span>
        </div>
        <div className="bg-gray-700 p-3 rounded-lg flex flex-col items-center">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <ClockIcon size={16} />
            <span>Time</span>
          </div>
          <span className="text-2xl font-mono">
            {Math.floor(elapsedTime / 1000)}s
          </span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button onClick={handleRetrySame} className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2">
          <RefreshCwIcon size={18} />
          Retry Same Algorithm
        </button>
        <button onClick={handleRandomAlgorithm} className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2">
          <ShuffleIcon size={18} />
          New Random Algorithm
        </button>
        <button onClick={handleChangeDifficulty} className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center justify-center gap-2">
          <SlidersIcon size={18} />
          Change Difficulty
        </button>
      </div>
    </div>
  </div>;
};