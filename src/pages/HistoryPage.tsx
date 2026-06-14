import { Navbar } from '../components/layout/Navbar';
import { useSEO } from '../hooks/useSEO';
import { HistorySection } from '../components/HistorySection';
import { useTyping } from '../context/TypingContext';
import { Link } from 'react-router-dom';
import { HistoryIcon, ZapIcon } from 'lucide-react';

export const HistoryPage = () => {
  const { history } = useTyping();

  useSEO({
    title: 'History',
    description: 'Review your full CodeType typing history with progress charts and best scores.',
    canonicalPath: '/history',
  });

  return (
    <div className="min-h-screen text-foreground">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <HistoryIcon size={26} className="text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Typing History</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {history.length} session{history.length !== 1 ? 's' : ''} recorded
            </p>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="bg-card border border-border rounded-xl p-16 text-center">
            <HistoryIcon size={40} className="text-muted-foreground/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">No history yet</h2>
            <p className="text-muted-foreground text-sm mb-6">Complete a typing session to see your history here.</p>
            <Link
              to="/practice"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              <ZapIcon size={16} />
              Start Practicing
            </Link>
          </div>
        ) : (
          <HistorySection />
        )}
      </div>
    </div>
  );
};
