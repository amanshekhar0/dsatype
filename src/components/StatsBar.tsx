import { useTyping } from '../context/TypingContext';
import { ClockIcon, ZapIcon, PercentIcon, AlertTriangleIcon } from 'lucide-react';
export const StatsBar = () => {
  const {
    isRunning,
    elapsedTime,
    wpm,
    accuracy,
    mistakesCount
  } = useTyping();
  if (!isRunning && elapsedTime === 0) return null;
  return <div className="mt-6 bg-gray-800 rounded-lg border border-gray-700 p-4">
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2 text-gray-400 mb-1">
          <ClockIcon size={16} />
          <span>Time</span>
        </div>
        <span className="text-xl font-mono">
          {Math.floor(elapsedTime / 1000)}s
        </span>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2 text-gray-400 mb-1">
          <ZapIcon size={16} />
          <span>WPM</span>
        </div>
        <span className="text-xl font-mono">{Math.round(wpm)}</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2 text-gray-400 mb-1">
          <PercentIcon size={16} />
          <span>Accuracy</span>
        </div>
        <span className="text-xl font-mono">{accuracy.toFixed(1)}%</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2 text-gray-400 mb-1">
          <AlertTriangleIcon size={16} />
          <span>Mistakes</span>
        </div>
        <span className="text-xl font-mono">{mistakesCount}</span>
      </div>
    </div>
  </div>;
};