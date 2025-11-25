import { TypingAttempt } from '../types';
export const HistoryStats = ({
  history
}: {
  history: TypingAttempt[];
}) => {
  // Get best scores by difficulty
  const getBestByDifficulty = (difficulty: string) => {
    const filtered = history.filter(attempt => attempt.difficulty === difficulty);
    if (filtered.length === 0) return null;
    const bestWpm = Math.max(...filtered.map(attempt => attempt.wpm));
    const bestWpmAttempt = filtered.find(attempt => attempt.wpm === bestWpm);
    const bestAccuracy = Math.max(...filtered.map(attempt => attempt.accuracy));
    const bestAccuracyAttempt = filtered.find(attempt => attempt.accuracy === bestAccuracy);
    return {
      bestWpm,
      bestWpmAlgorithm: bestWpmAttempt?.algorithmTitle || '',
      bestAccuracy,
      bestAccuracyAlgorithm: bestAccuracyAttempt?.algorithmTitle || ''
    };
  };
  const easyStats = getBestByDifficulty('Easy');
  const mediumStats = getBestByDifficulty('Medium');
  const hardStats = getBestByDifficulty('Hard');
  const renderDifficultyStats = (difficulty: string, stats: ReturnType<typeof getBestByDifficulty>, bgClass: string, textClass: string) => {
    if (!stats) return null;
    return <div className={`${bgClass} rounded-lg p-6`}>
      <h3 className={`text-xl font-bold ${textClass} mb-4`}>{difficulty}</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-300">Best WPM</span>
            <span className="font-mono text-xl">
              {Math.round(stats.bestWpm)}
            </span>
          </div>
          <p className="text-sm text-gray-400 truncate">
            Algorithm: {stats.bestWpmAlgorithm}
          </p>
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-300">Best Accuracy</span>
            <span className="font-mono text-xl">
              {stats.bestAccuracy.toFixed(1)}%
            </span>
          </div>
          <p className="text-sm text-gray-400 truncate">
            Algorithm: {stats.bestAccuracyAlgorithm}
          </p>
        </div>
      </div>
    </div>;
  };
  return <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {renderDifficultyStats('Easy', easyStats, 'bg-green-900 bg-opacity-20 border border-green-800', 'text-green-400')}
    {renderDifficultyStats('Medium', mediumStats, 'bg-yellow-900 bg-opacity-20 border border-yellow-800', 'text-yellow-400')}
    {renderDifficultyStats('Hard', hardStats, 'bg-red-900 bg-opacity-20 border border-red-800', 'text-red-400')}
  </div>;
};