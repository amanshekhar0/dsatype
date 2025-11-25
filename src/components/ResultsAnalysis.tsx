import { useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Area,
    ReferenceLine,
    Legend,
    Brush,
    Label
} from 'recharts';
import { RefreshCwIcon, TrophyIcon, ActivityIcon, ClockIcon, SlidersIcon } from 'lucide-react';
import { useTyping } from '../context/TypingContext';
import { useAlgorithm } from '../context/AlgorithmContext';

export const ResultsAnalysis = () => {
    const {
        wpm,
        accuracy,
        elapsedTime,
        wpmHistory,
        resetTyping
    } = useTyping();

    const {
        currentAlgorithm,
        fetchRandomAlgorithm,
        resetFilters
    } = useAlgorithm();

    const handleRetry = () => {
        resetTyping();
    };

    const handleNext = () => {
        fetchRandomAlgorithm();
        resetTyping();
    };

    const handleChangeDifficulty = () => {
        resetFilters();
        resetTyping();
    };

    // Prepare chart data (ensure at least one point so chart renders nicely)
    const chartData = useMemo(() => {
        if (!wpmHistory || wpmHistory.length === 0) {
            return [{ time: 0, wpm: Math.round(wpm) || 0 }];
        }
        // Ensure points are unique and sorted by time
        const unique = Array.from(
            new Map(wpmHistory.map(p => [p.time, p])).values()
        ).sort((a, b) => a.time - b.time);

        // Smooth small gaps by linear interpolation (optional): keep as-is for now
        return unique.map(p => ({ time: p.time, wpm: p.wpm }));
    }, [wpmHistory, wpm]);

    // nice time formatter for X axis (seconds -> mm:ss when needed)
    const formatTime = (seconds: number) => {
        if (!seconds || seconds < 60) return `${seconds}s`;
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60)
            .toString()
            .padStart(2, '0');
        return `${mins}:${secs}`;
    };

    // Custom tooltip to show time nicely and WPM with units
    const CustomTooltip = ({ active, payload }: any) => {
        if (!active || !payload || !payload.length) return null;
        const point = payload[0].payload as { time: number; wpm: number };
        return (
            <div className="bg-card text-card-foreground p-2 rounded border border-border text-sm shadow-lg">
                <div className="font-medium text-xs text-muted-foreground">Time</div>
                <div className="mb-1">{formatTime(point.time)}</div>
                <div className="font-medium text-xs text-muted-foreground">Speed</div>
                <div>{point.wpm} WPM</div>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-card rounded-xl border border-border w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-border flex justify-between items-center bg-muted/30">
                    <div>
                        <h2 className="text-3xl font-bold text-foreground mb-1">Session Complete!</h2>
                        <p className="text-muted-foreground flex items-center gap-2">
                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-sm border border-primary/20">
                                {currentAlgorithm?.title}
                            </span>
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleRetry}
                            className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors"
                        >
                            <RefreshCwIcon size={18} />
                            Retry
                        </button>
                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors font-medium"
                        >
                            Next Algorithm
                        </button>
                        <button
                            onClick={handleChangeDifficulty}
                            className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors"
                        >
                            <SlidersIcon size={18} />
                            Change Difficulty
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-card p-6 rounded-xl border border-border flex flex-col items-center justify-center hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                <TrophyIcon size={20} className="text-primary" />
                                <span className="font-medium">WPM</span>
                            </div>
                            <span className="text-5xl font-bold text-foreground font-mono">
                                {Math.round(wpm)}
                            </span>
                        </div>

                        <div className="bg-card p-6 rounded-xl border border-border flex flex-col items-center justify-center hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                <ActivityIcon size={20} className="text-green-500" />
                                <span className="font-medium">Accuracy</span>
                            </div>
                            <span className="text-5xl font-bold text-foreground font-mono">
                                {Math.round(accuracy)}%
                            </span>
                        </div>

                        <div className="bg-card p-6 rounded-xl border border-border flex flex-col items-center justify-center hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-2 text-muted-foreground mb-2">
                                <ClockIcon size={20} className="text-blue-500" />
                                <span className="font-medium">Time</span>
                            </div>
                            <span className="text-5xl font-bold text-foreground font-mono">
                                {(elapsedTime / 1000).toFixed(1)}s
                            </span>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="bg-card p-6 rounded-xl border border-border">
                        <h3 className="text-lg font-semibold text-muted-foreground mb-6 flex items-center gap-2">
                            <ActivityIcon size={18} />
                            Speed vs Time
                        </h3>

                        <div className="h-[340px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart
                                    data={chartData}
                                    margin={{ top: 10, right: 20, left: 0, bottom: 30 }}
                                >
                                    {/* gradient for area under the line */}
                                    <defs>
                                        <linearGradient id="wpmGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.28} />
                                            <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.06} />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
                                    <XAxis
                                        dataKey="time"
                                        tickFormatter={formatTime}
                                        stroke="var(--muted-foreground)"
                                        tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                                        tickLine={{ stroke: 'var(--border)' }}
                                        axisLine={{ stroke: 'var(--border)' }}
                                        padding={{ left: 10, right: 10 }}
                                    >
                                        <Label value="Time" position="bottom" offset={8} fill="#6B7280" />
                                    </XAxis>

                                    <YAxis
                                        stroke="var(--muted-foreground)"
                                        tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
                                        tickLine={{ stroke: 'var(--border)' }}
                                        axisLine={{ stroke: 'var(--border)' }}
                                        allowDecimals={false}
                                        width={60}
                                    >
                                        <Label value="WPM" angle={-90} position="insideLeft" fill="#6B7280" />
                                    </YAxis>

                                    <Tooltip content={<CustomTooltip />} />

                                    {/* Area to give a soft filled look */}
                                    <Area
                                        type="monotone"
                                        dataKey="wpm"
                                        stroke="none"
                                        fill="url(#wpmGradient)"
                                        activeDot={false}
                                        isAnimationActive={true}
                                        animationDuration={800}
                                    />

                                    {/* Main line */}
                                    <Line
                                        type="monotone"
                                        dataKey="wpm"
                                        stroke="var(--primary)"
                                        strokeWidth={3}
                                        dot={{ r: 3, fill: 'var(--primary)' }}
                                        activeDot={{ r: 6, stroke: '#1D4ED8', strokeWidth: 2 }}
                                        isAnimationActive={true}
                                        animationDuration={1000}
                                    />

                                    {/* Reference: average WPM line */}
                                    {chartData.length > 0 && (
                                        <ReferenceLine
                                            y={Math.round(chartData.reduce((s, p) => s + p.wpm, 0) / chartData.length)}
                                            stroke="#F59E0B"
                                            strokeDasharray="4 4"
                                            label={{
                                                value: `Avg ${Math.round(
                                                    chartData.reduce((s, p) => s + p.wpm, 0) / chartData.length
                                                )} WPM`,
                                                position: 'top',
                                                fill: '#FBBF24',
                                                fontSize: 12
                                            }}
                                        />
                                    )}

                                    <Legend
                                        verticalAlign="top"
                                        align="right"
                                        wrapperStyle={{ top: -8, right: 0, color: '#9CA3AF' }}
                                    />

                                    {/* Brush for long sessions (optional) */}
                                    {chartData.length > 20 && <Brush dataKey="time" height={30} stroke="var(--primary)" />}
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
