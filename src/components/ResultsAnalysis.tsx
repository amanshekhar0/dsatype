import { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
} from 'recharts';
import { RefreshCwIcon, TrophyIcon, ActivityIcon, ClockIcon, SlidersIcon, SparklesIcon } from 'lucide-react';
import { useTyping } from '../context/TypingContext';
import { useAlgorithm } from '../context/AlgorithmContext';
import { useSettings } from '../context/SettingsContext';
import { KeyboardHeatmap } from './KeyboardHeatmap';

export const ResultsAnalysis = () => {
  const { wpm, accuracy, elapsedTime, wpmHistory, mistakesCount, resetTyping, keyAccuracyMap } = useTyping();
  const { currentAlgorithm, fetchRandomAlgorithm, resetFilters, language } = useAlgorithm();
  const { settings } = useSettings();

  const isTypewriter = settings.visualTheme === 'typewriter';

  const chartData = useMemo(() => {
    if (!wpmHistory || wpmHistory.length === 0) return [{ time: 0, wpm: Math.round(wpm) }];
    const unique = Array.from(new Map(wpmHistory.map(p => [p.time, p])).values()).sort(
      (a, b) => a.time - b.time
    );
    return unique;
  }, [wpmHistory, wpm]);

  const avgWpm = chartData.length > 0
    ? Math.round(chartData.reduce((s, p) => s + p.wpm, 0) / chartData.length)
    : 0;

  const formatTime = (s: number) => {
    if (s < 60) return `${s}s`;
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: { time: number; wpm: number } }[] }) => {
    if (!active || !payload?.length) return null;
    const { time, wpm: w } = payload[0].payload;
    return (
      <div className="bg-card text-foreground p-2 rounded border border-border text-xs shadow-lg">
        <div className="text-muted-foreground">t = {formatTime(time)}</div>
        <div className="font-bold">{w} WPM</div>
      </div>
    );
  };

  const grade = (() => {
    if (wpm >= 100 && accuracy >= 95) return { label: 'S', color: isTypewriter ? 'text-[#8b4513]' : 'text-yellow-400', desc: 'Legendary!' };
    if (wpm >= 70 && accuracy >= 90) return { label: 'A', color: isTypewriter ? 'text-[#2d7a3a]' : 'text-green-400', desc: 'Excellent!' };
    if (wpm >= 50 && accuracy >= 85) return { label: 'B', color: isTypewriter ? 'text-[#1a4d8f]' : 'text-blue-400', desc: 'Great work!' };
    if (wpm >= 30) return { label: 'C', color: isTypewriter ? 'text-[#a0760a]' : 'text-orange-400', desc: 'Keep practicing!' };
    return { label: 'D', color: isTypewriter ? 'text-[#a83232]' : 'text-red-400', desc: 'Room to improve' };
  })();

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`bg-card rounded-xl border border-border w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-in-up ${
        isTypewriter ? 'paper-panel' : ''
      }`}>
        {/* Header */}
        <div className={`p-6 border-b border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${
          isTypewriter ? 'bg-[#e6dcc3]/50' : 'bg-muted/30'
        }`}>
          <div>
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              {isTypewriter ? '📜' : <SparklesIcon size={22} className="text-primary" />}
              {isTypewriter ? 'Session Report' : 'Session Complete!'}
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {currentAlgorithm?.title} ·{' '}
              <span className="text-primary font-medium">{language}</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={resetTyping}
              className="flex items-center gap-1.5 px-3 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-sm transition-colors"
            >
              <RefreshCwIcon size={15} />
              Retry
            </button>
            <button
              onClick={() => { fetchRandomAlgorithm(); resetTyping(); }}
              className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium transition-colors hover:opacity-90"
            >
              Next
            </button>
            <button
              onClick={() => { resetFilters(); resetTyping(); }}
              className="flex items-center gap-1.5 px-3 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-sm transition-colors"
            >
              <SlidersIcon size={15} />
              Change Difficulty
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                label: 'WPM',
                value: Math.round(wpm),
                icon: <TrophyIcon size={18} className="text-primary" />,
                delay: '0.1s',
              },
              {
                label: 'ACCURACY',
                value: `${Math.round(accuracy)}%`,
                icon: <ActivityIcon size={18} className={isTypewriter ? 'text-[#2d7a3a]' : 'text-green-400'} />,
                delay: '0.2s',
              },
              {
                label: 'TIME',
                value: formatTime(Math.floor(elapsedTime / 1000)),
                icon: <ClockIcon size={18} className={isTypewriter ? 'text-[#1a4d8f]' : 'text-blue-400'} />,
                delay: '0.3s',
              },
              {
                label: 'ERRORS',
                value: mistakesCount,
                icon: <SlidersIcon size={18} className={isTypewriter ? 'text-[#a0760a]' : 'text-orange-400'} />,
                delay: '0.4s',
              },
            ].map(card => (
              <div
                key={card.label}
                className="bg-background rounded-lg border border-border p-4 flex flex-col items-center gap-2 animate-count-up"
                style={{ animationDelay: card.delay }}
              >
                {card.icon}
                <span className="text-3xl font-bold font-mono text-foreground">{card.value}</span>
                <span className="text-xs text-muted-foreground">{card.label}</span>
              </div>
            ))}
          </div>

          {/* Grade */}
          <div className="flex items-center justify-center gap-6 py-2">
            <div className="text-center">
              <div
                className={`text-7xl font-black font-mono ${grade.color} animate-grade-reveal`}
                style={{ animationDelay: '0.5s' }}
              >
                {grade.label}
              </div>
              <div className="text-xs text-muted-foreground mt-1">GRADE</div>
              <div className="text-sm font-medium text-foreground mt-1">{grade.desc}</div>
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>S = 100+ WPM, 95%+ accuracy</div>
              <div>A = 70+ WPM, 90%+ accuracy</div>
              <div>B = 50+ WPM, 85%+ accuracy</div>
              <div>C = 30+ WPM</div>
            </div>
          </div>

          {/* Chart */}
          {chartData.length > 1 && (
            <div className="bg-background rounded-lg border border-border p-4">
              <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
                <ActivityIcon size={16} />
                Speed Over Time
              </h3>
              <div className="h-52">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                    <XAxis
                      dataKey="time"
                      tickFormatter={formatTime}
                      tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                      axisLine={{ stroke: 'var(--border)' }}
                      tickLine={false}
                    >
                      <Label value="Time" position="bottom" offset={5} fill="var(--muted-foreground)" fontSize={11} />
                    </XAxis>
                    <YAxis
                      tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine
                      y={avgWpm}
                      stroke="var(--primary)"
                      strokeDasharray="4 4"
                      label={{ value: `avg ${avgWpm}`, position: 'right', fill: 'var(--primary)', fontSize: 11 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="wpm"
                      stroke="var(--primary)"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 4, fill: 'var(--primary)' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Keyboard Heatmap */}
          {settings.showKeyboardHeatmap && (
            <KeyboardHeatmap keyAccuracyMap={keyAccuracyMap} />
          )}
        </div>
      </div>
    </div>
  );
};
