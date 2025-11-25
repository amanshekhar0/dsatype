import React, { useMemo } from 'react';
import { TypingAttempt } from '../types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { formatDateShort } from '../utils/formatters';

interface HistoryChartsProps {
  history: TypingAttempt[];
}

/** Tooltip props per recharts */
interface RechartsTooltipProps {
  active?: boolean;
  payload?: Array<{ dataKey?: string; value?: number }>;
  label?: string;
}

const CustomTooltip: React.FC<RechartsTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="bg-gray-800 p-2 border border-gray-700 rounded-md shadow-lg">
      <p className="text-gray-300">{`Date: ${label}`}</p>
      {payload.map((entry, idx) => {
        const key = entry?.dataKey ?? '';
        const value = entry?.value ?? '';
        const isWpm = key === 'wpm';
        return (
          <p key={idx} className={isWpm ? 'text-blue-400' : 'text-green-400'}>
            {`${isWpm ? 'WPM' : 'Accuracy'}: ${value}${key === 'accuracy' ? '%' : ''}`}
          </p>
        );
      })}
    </div>
  );
};

export default function HistoryCharts({ history }: HistoryChartsProps) {
  // make sure history is always an array
  const safeHistory = Array.isArray(history) ? history : [];

  // Prepare data for charts (memoized)
  const chartData = useMemo(
    () =>
      safeHistory.map(attempt => {
        const timestamp = attempt?.timestamp ?? Date.now();
        const rawWpm = typeof attempt?.wpm === 'number' ? attempt.wpm : 0;
        const rawAccuracy = typeof attempt?.accuracy === 'number' ? attempt.accuracy : 0;

        return {
          date: formatDateShort(timestamp),
          wpm: Math.round(rawWpm),
          accuracy: Number(rawAccuracy.toFixed(1)),
          difficulty: attempt?.difficulty ?? 'unknown'
        };
      }),
    [safeHistory]
  );

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-semibold mb-4">Words Per Minute Over Time</h3>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 20,
                left: 0,
                bottom: 5
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
              <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="wpm"
                stroke="#3B82F6"
                strokeWidth={2}
                dot={{ fill: '#3B82F6', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Accuracy Over Time</h3>
        <div className="h-64 sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{
                top: 5,
                right: 20,
                left: 0,
                bottom: 5
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="date" stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
              <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} domain={[0, 100]} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ fill: '#10B981', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
