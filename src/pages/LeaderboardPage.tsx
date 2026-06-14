import { useMemo } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { useSEO } from '../hooks/useSEO';
import { useAuth } from '../context/AuthContext';
import { useTyping } from '../context/TypingContext';
import { useUserStats } from '../hooks/useUserStats';
import { LeaderboardEntry } from '../types';
import { TrophyIcon, ZapIcon, BarChart2Icon } from 'lucide-react';

const MOCK_USERS: LeaderboardEntry[] = [
  { userId: 'm1', username: 'CodeNinja', bestWpm: 134, averageWpm: 98, totalSessions: 412, averageAccuracy: 97.8, totalXP: 15200, level: 17 },
  { userId: 'm2', username: 'TypeMaster', bestWpm: 121, averageWpm: 91, totalSessions: 289, averageAccuracy: 96.5, totalXP: 10800, level: 15 },
  { userId: 'm3', username: 'AlgoQueen', bestWpm: 115, averageWpm: 87, totalSessions: 347, averageAccuracy: 95.1, totalXP: 9600, level: 14 },
  { userId: 'm4', username: 'ByteWizard', bestWpm: 108, averageWpm: 82, totalSessions: 201, averageAccuracy: 94.3, totalXP: 7400, level: 12 },
  { userId: 'm5', username: 'RecursiveRaj', bestWpm: 99, averageWpm: 76, totalSessions: 178, averageAccuracy: 93.7, totalXP: 6100, level: 11 },
  { userId: 'm6', username: 'SyntaxSally', bestWpm: 94, averageWpm: 72, totalSessions: 156, averageAccuracy: 92.0, totalXP: 5200, level: 10 },
  { userId: 'm7', username: 'LoopLegend', bestWpm: 88, averageWpm: 67, totalSessions: 134, averageAccuracy: 91.5, totalXP: 4300, level: 9 },
  { userId: 'm8', username: 'StackSurfer', bestWpm: 82, averageWpm: 63, totalSessions: 98, averageAccuracy: 90.2, totalXP: 3500, level: 8 },
];

const medal: Record<number, string> = { 0: '🥇', 1: '🥈', 2: '🥉' };

export const LeaderboardPage = () => {
  const { user } = useAuth();
  const { history } = useTyping();
  const userStats = useUserStats(history);

  useSEO({
    title: 'Leaderboard',
    description: 'See how you rank against other developers on the CodeType global leaderboard by best WPM.',
    canonicalPath: '/leaderboard',
  });

  const entries = useMemo<LeaderboardEntry[]>(() => {
    const list: LeaderboardEntry[] = [...MOCK_USERS];
    if (user && history.length > 0) {
      list.push({
        userId: user.id,
        username: user.username,
        bestWpm: userStats.bestWpm,
        averageWpm: Math.round(userStats.averageWpm),
        totalSessions: userStats.totalSessions,
        averageAccuracy: userStats.averageAccuracy,
        totalXP: userStats.totalXP,
        level: userStats.level,
        isCurrentUser: true,
        picture: user.picture,
      });
    }
    return list.sort((a, b) => b.bestWpm - a.bestWpm);
  }, [user, history, userStats]);

  return (
    <div className="min-h-screen text-foreground">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <TrophyIcon size={28} className="text-primary" />
          <div>
            <h1 className="text-3xl font-bold text-foreground">Leaderboard</h1>
            <p className="text-muted-foreground text-sm mt-0.5">Top coders ranked by best WPM</p>
          </div>
        </div>

        {/* Table */}
        <div className="glass rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">#</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground">User</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground">
                    <span className="flex items-center justify-end gap-1">
                      <ZapIcon size={12} />Best WPM
                    </span>
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground hidden sm:table-cell">Avg WPM</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground hidden md:table-cell">Accuracy</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground hidden md:table-cell">
                    <span className="flex items-center justify-end gap-1">
                      <BarChart2Icon size={12} />Sessions
                    </span>
                  </th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground">XP</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e, i) => (
                  <tr
                    key={e.userId}
                    className={`border-b border-border last:border-0 transition-colors ${
                      e.isCurrentUser
                        ? 'bg-primary/5 hover:bg-primary/10'
                        : 'hover:bg-muted/30'
                    }`}
                  >
                    <td className="py-3.5 px-4 text-sm text-muted-foreground font-mono">
                      {medal[i] ?? i + 1}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        {e.picture ? (
                          <img
                            src={e.picture}
                            alt={e.username}
                            className="w-8 h-8 rounded-full object-cover border border-border/40"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-sm font-bold text-primary">
                            {e.username[0].toUpperCase()}
                          </div>
                        )}
                        <div>
                          <span className={`text-sm font-semibold ${e.isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                            {e.username}
                            {e.isCurrentUser && (
                              <span className="ml-1.5 text-xs bg-primary/15 text-primary px-1.5 py-0.5 rounded-full font-normal">
                                you
                              </span>
                            )}
                          </span>
                          <div className="text-xs text-muted-foreground">Lv {e.level}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-primary text-base">
                      {e.bestWpm}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-sm text-foreground hidden sm:table-cell">
                      {Math.round(e.averageWpm)}
                    </td>
                    <td className="py-3.5 px-4 text-right text-sm text-foreground hidden md:table-cell">
                      {e.averageAccuracy.toFixed(1)}%
                    </td>
                    <td className="py-3.5 px-4 text-right text-sm text-muted-foreground hidden md:table-cell">
                      {e.totalSessions}
                    </td>
                    <td className="py-3.5 px-4 text-right text-sm font-mono text-muted-foreground">
                      {e.totalXP.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {!user && (
          <p className="text-center text-sm text-muted-foreground mt-6">
            <a href="/signup" className="text-primary hover:underline">Sign up</a>{' '}
            to appear on the leaderboard!
          </p>
        )}
      </div>
    </div>
  );
};
