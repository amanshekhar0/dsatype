import { TypingAttempt } from '../types';
import { formatDate } from '../utils/formatters';
export const HistoryTable = ({
  history
}: {
  history: TypingAttempt[];
}) => {
  return <div className="overflow-x-auto">
    <table className="w-full border-collapse">
      <thead>
        <tr className="text-left text-gray-400 border-b border-gray-700">
          <th className="pb-2 pr-4">Date</th>
          <th className="pb-2 px-4">Algorithm</th>
          <th className="pb-2 px-4">Difficulty</th>
          <th className="pb-2 px-4">WPM</th>
          <th className="pb-2 px-4">Accuracy</th>
          <th className="pb-2 pl-4">Time</th>
        </tr>
      </thead>
      <tbody>
        {history.map((attempt, index) => <tr key={index} className="border-b border-gray-800 hover:bg-gray-800">
          <td className="py-3 pr-4">{formatDate(attempt.timestamp)}</td>
          <td className="py-3 px-4 max-w-[200px] truncate">
            {attempt.algorithmTitle}
          </td>
          <td className="py-3 px-4">
            <span className={`px-2 py-0.5 rounded-full text-xs ${attempt.difficulty === 'Easy' ? 'bg-green-900 text-green-300' : attempt.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-300' : 'bg-red-900 text-red-300'}`}>
              {attempt.difficulty}
            </span>
          </td>
          <td className="py-3 px-4 font-mono">{Math.round(attempt.wpm)}</td>
          <td className="py-3 px-4 font-mono">
            {attempt.accuracy.toFixed(1)}%
          </td>
          <td className="py-3 pl-4 font-mono">
            {attempt.timeTakenInSeconds}s
          </td>
        </tr>)}
      </tbody>
    </table>
  </div>;
};