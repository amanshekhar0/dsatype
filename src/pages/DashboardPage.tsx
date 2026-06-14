import { Link } from 'react-router-dom';
import { useTyping } from '../context/TypingContext';
import { useAuth } from '../context/AuthContext';
import { useUserStats } from '../hooks/useUserStats';
import { ACHIEVEMENTS, xpForLevel } from '../data/achievements';
import { Navbar } from '../components/layout/Navbar';
import { useSEO } from '../hooks/useSEO';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  ZapIcon,
  TrophyIcon,
  FlameIcon,
  ClockIcon,
  BarChart2Icon,
  LockIcon,
  ZapOffIcon,
} from 'lucide-react';

export const DashboardPage = () => {
  const { history } = useTyping();
  const { user } = useAuth();
  const stats = useUserStats(history);

  useSEO({
    title: 'Dashboard',
    description: 'Your CodeType dashboard — track WPM, accuracy, streaks, XP, level, and achievements.',
    canonicalPath: '/dashboard',
  });

  const recentChart = history
    .slice(0, 30)
    .reverse()
    .map((h, i) => ({ session: i + 1, wpm: h.wpm, acc: Math.round(h.accuracy) }));

  const xpProgress = stats.totalXP - xpForLevel(stats.level - 1);
  const xpNeeded = xpForLevel(stats.level) - xpForLevel(stats.level - 1);
  const xpPct = Math.min(100, Math.round((xpProgress / Math.max(xpNeeded, 1)) * 100));

  const formatTime = (s: number) => {
    if (s < 60) return `${s}s`;
    if (s < 3600) return `${Math.floor(s / 60)}m`;
    return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
  };

  const statCards = [
    { label: 'Sessions', value: stats.totalSessions, icon: <BarChart2Icon size={18} className="text-blue-400" /> },
    { label: 'Best WPM', value: stats.bestWpm, icon: <ZapIcon size={18} className="text-primary" /> },
    { label: 'Avg WPM', value: Math.round(stats.averageWpm), icon: <ZapOffIcon size={18} className="text-purple-400" /> },
    { label: 'Avg Accuracy', value: `${Math.round(stats.averageAccuracy)}%`, icon: <TrophyIcon size={18} className="text-green-400" /> },
    { label: 'Streak', value: `${stats.currentStreak}d`, icon: <FlameIcon size={18} className="text-orange-400" /> },
    { label: 'Time Practiced', value: formatTime(stats.totalTimeSeconds), icon: <ClockIcon size={18} className="text-cyan-400" /> },
  ];

  if (!user) {
    return (
      <div className="min-h-screen text-foreground">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
          <p className="text-muted-foreground">Please log in to view your dashboard.</p>
          <Link to="/login" className="bg-primary text-primary-foreground px-6 py-2.5 rounded-lg font-medium">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-foreground">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            {user.picture && (
              <img
                src={user.picture}
                alt={user.username}
                className="w-14 h-14 rounded-full object-cover border-2 border-primary/35 shadow-md shadow-primary/5"
                referrerPolicy="no-referrer"
              />
            )}
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Welcome back, <span className="text-primary">{user.username}</span>
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                {stats.totalSessions === 0 ? 'No sessions yet — start practicing!' : `${stats.totalSessions} sessions completed`}
              </p>
            </div>
          </div>
          <Link
            to="/practice"
            className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg font-semibold hover:opacity-90 transition-opacity shrink-0"
          >
            <ZapIcon size={16} />
            Practice Now
          </Link>
        </div>

        {/* Level + XP */}
        <div className="glass rounded-xl p-5 mb-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center font-black text-xl text-primary">
                {stats.level}
              </div>
              <div>
                <div className="font-bold text-foreground">Level {stats.level}</div>
                <div className="text-xs text-muted-foreground">{stats.totalXP} XP total</div>
              </div>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <div>{xpProgress} / {xpNeeded} XP</div>
              <div className="text-xs">to Level {stats.level + 1}</div>
            </div>
          </div>
          <div className="h-2.5 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-700"
              style={{ width: `${xpPct}%` }}
            />
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {statCards.map(c => (
            <div key={c.label} className="glass rounded-xl p-4 flex flex-col items-center gap-2">
              {c.icon}
              <div className="text-2xl font-bold font-mono text-foreground">{c.value}</div>
              <div className="text-xs text-muted-foreground">{c.label}</div>
            </div>
          ))}
        </div>

        {/* WPM chart */}
        {recentChart.length > 1 && (
          <div className="glass rounded-xl p-5 mb-6">
            <h2 className="text-sm font-semibold text-muted-foreground mb-4">WPM — Last 30 Sessions</h2>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={recentChart} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                  <XAxis dataKey="session" tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: 'var(--muted-foreground)', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }}
                    labelStyle={{ color: 'var(--muted-foreground)', fontSize: 11 }}
                    itemStyle={{ color: 'var(--primary)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="wpm"
                    stroke="var(--primary)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Achievements */}
        <div className="glass rounded-xl p-5">
          <h2 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
            <TrophyIcon size={16} />
            Achievements ({stats.unlockedAchievements.length}/{ACHIEVEMENTS.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {ACHIEVEMENTS.map(a => {
              const unlocked = stats.unlockedAchievements.includes(a.id);
              return (
                <div
                  key={a.id}
                  className={`rounded-lg border p-3 flex flex-col gap-1 transition-colors ${
                    unlocked
                      ? 'bg-primary/5 border-primary/30'
                      : 'bg-background border-border opacity-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xl">{a.icon}</span>
                    {!unlocked && <LockIcon size={12} className="text-muted-foreground" />}
                  </div>
                  <div className="text-xs font-semibold text-foreground">{a.title}</div>
                  <div className="text-xs text-muted-foreground leading-tight">{a.description}</div>
                  <div className="text-xs text-primary font-medium mt-1">+{a.xpReward} XP</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
