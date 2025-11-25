import { useState } from 'react';
import { useTyping } from '../context/TypingContext';
import { HistoryTable } from './HistoryTable';
import HistoryCharts from './HistoryCharts';
import { HistoryStats } from './HistoryStats';
import { TableIcon, TrendingUpIcon, BarChart3Icon, Trash2Icon } from 'lucide-react';

export const HistorySection = () => {
  const {
    history,
    clearHistory
  } = useTyping();
  const [activeTab, setActiveTab] = useState('table');

  if (history.length === 0) return null;

  return (
    <section className="w-full py-12 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Your History</h2>
          <button
            onClick={clearHistory}
            className="flex items-center gap-2 px-3 py-1.5 bg-red-900/10 text-red-500 hover:bg-red-900/20 rounded-md transition-colors text-sm border border-red-900/20"
          >
            <Trash2Icon size={16} />
            Clear History
          </button>
        </div>
        <div className="flex border-b border-border mb-6">
          <button
            className={`py-2 px-4 flex items-center gap-2 ${activeTab === 'table' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('table')}
          >
            <TableIcon size={18} />
            Recent Attempts
          </button>
          <button
            className={`py-2 px-4 flex items-center gap-2 ${activeTab === 'charts' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('charts')}
          >
            <TrendingUpIcon size={18} />
            Progress Charts
          </button>
          <button
            className={`py-2 px-4 flex items-center gap-2 ${activeTab === 'stats' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            onClick={() => setActiveTab('stats')}
          >
            <BarChart3Icon size={18} />
            Best Scores
          </button>
        </div>
        {activeTab === 'table' && <HistoryTable history={history.slice(0, 5)} />}
        {activeTab === 'charts' && <HistoryCharts history={history} />}
        {activeTab === 'stats' && <HistoryStats history={history} />}
      </div>
    </section>
  );
};