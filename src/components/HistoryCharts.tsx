import { TypingAttempt } from '../types';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatDateShort } from '../utils/formatters';
export const HistoryCharts = ({
  history
}: {
  history: TypingAttempt[];
}) => {
  // Prepare data for charts
  const chartData = history.map(attempt => ({
    date: formatDateShort(attempt.timestamp),
    wpm: Math.round(attempt.wpm),
    accuracy: Number(attempt.accuracy.toFixed(1)),
    difficulty: attempt.difficulty
  }));
  // Custom tooltip
  const CustomTooltip = ({
    active,
    payload,
    label
  }: any) => {
    if (active && payload && payload.length) {
      return <div className="bg-gray-800 p-2 border border-gray-700 rounded-md shadow-lg">
        <p className="text-gray-300">{`Date: ${label}`}</p>
        {payload.map((entry: any, index: number) => <p key={index} className={entry.dataKey === 'wpm' ? 'text-blue-400' : 'text-green-400'}>
          {`${entry.dataKey === 'wpm' ? 'WPM' : 'Accuracy'}: ${entry.value}${entry.dataKey === 'accuracy' ? '%' : ''}`}
        </p>)}
      </div>;
    }
    return null;
  };
  return <div className="space-y-8">
    <div>
      <h3 className="text-xl font-semibold mb-4">
        Words Per Minute Over Time
      </h3>
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{
            top: 5,
            right: 20,
            left: 0,
            bottom: 5
          }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" tick={{
              fill: '#9CA3AF'
            }} />
            <YAxis stroke="#9CA3AF" tick={{
              fill: '#9CA3AF'
            }} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="wpm" stroke="#3B82F6" strokeWidth={2} dot={{
              fill: '#3B82F6',
              r: 4
            }} activeDot={{
              r: 6
            }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
    <div>
      <h3 className="text-xl font-semibold mb-4">Accuracy Over Time</h3>
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{
            top: 5,
            right: 20,
            left: 0,
            bottom: 5
          }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9CA3AF" tick={{
              fill: '#9CA3AF'
            }} />
            <YAxis stroke="#9CA3AF" tick={{
              fill: '#9CA3AF'
            }} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="accuracy" stroke="#10B981" strokeWidth={2} dot={{
              fill: '#10B981',
              r: 4
            }} activeDot={{
              r: 6
            }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  </div>;
};