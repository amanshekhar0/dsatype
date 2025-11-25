import React, { useState } from 'react';
import { useTypingHistory } from '../hooks/useTypingHistory';
import { HistoryTable } from './HistoryTable';
import { HistoryCharts } from './HistoryCharts';
import { HistoryStats } from './HistoryStats';
import { TableIcon, TrendingUpIcon, BarChart3Icon } from 'lucide-react';
export const HistorySection = () => {
  const {
    history
  } = useTypingHistory();
  const [activeTab, setActiveTab] = useState('table');
  if (history.length === 0) return null;
  return <section className="w-full py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Your History</h2>
        <div className="flex border-b border-gray-700 mb-6">
          <button className={`py-2 px-4 flex items-center gap-2 ${activeTab === 'table' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-gray-200'}`} onClick={() => setActiveTab('table')}>
            <TableIcon size={18} />
            Recent Attempts
          </button>
          <button className={`py-2 px-4 flex items-center gap-2 ${activeTab === 'charts' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-gray-200'}`} onClick={() => setActiveTab('charts')}>
            <TrendingUpIcon size={18} />
            Progress Charts
          </button>
          <button className={`py-2 px-4 flex items-center gap-2 ${activeTab === 'stats' ? 'border-b-2 border-blue-500 text-blue-400' : 'text-gray-400 hover:text-gray-200'}`} onClick={() => setActiveTab('stats')}>
            <BarChart3Icon size={18} />
            Best Scores
          </button>
        </div>
        {activeTab === 'table' && <HistoryTable history={history} />}
        {activeTab === 'charts' && <HistoryCharts history={history} />}
        {activeTab === 'stats' && <HistoryStats history={history} />}
      </div>
    </section>;
};