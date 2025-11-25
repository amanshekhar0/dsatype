import React from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { RefreshCwIcon, TrophyIcon, ActivityIcon, ClockIcon } from 'lucide-react';
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
        fetchRandomAlgorithm
    } = useAlgorithm();

    const handleRetry = () => {
        resetTyping();
    };

    const handleNext = () => {
        fetchRandomAlgorithm();
        resetTyping();
    };

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                {/* Header */}
                <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-800/50">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-1">Session Complete!</h2>
                        <p className="text-gray-400 flex items-center gap-2">
                            <span className="bg-blue-900/50 text-blue-200 px-2 py-0.5 rounded text-sm border border-blue-800">
                                {currentAlgorithm?.title}
                            </span>
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={handleRetry}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                        >
                            <RefreshCwIcon size={18} />
                            Retry
                        </button>
                        <button
                            onClick={handleNext}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium"
                        >
                            Next Algorithm
                        </button>
                    </div>
                </div>

                <div className="p-6 space-y-8">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 flex flex-col items-center justify-center hover:bg-gray-800 transition-colors">
                            <div className="flex items-center gap-2 text-gray-400 mb-2">
                                <TrophyIcon size={20} className="text-yellow-500" />
                                <span className="font-medium">WPM</span>
                            </div>
                            <span className="text-5xl font-bold text-white font-mono">
                                {Math.round(wpm)}
                            </span>
                        </div>

                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 flex flex-col items-center justify-center hover:bg-gray-800 transition-colors">
                            <div className="flex items-center gap-2 text-gray-400 mb-2">
                                <ActivityIcon size={20} className="text-green-500" />
                                <span className="font-medium">Accuracy</span>
                            </div>
                            <span className="text-5xl font-bold text-white font-mono">
                                {Math.round(accuracy)}%
                            </span>
                        </div>

                        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 flex flex-col items-center justify-center hover:bg-gray-800 transition-colors">
                            <div className="flex items-center gap-2 text-gray-400 mb-2">
                                <ClockIcon size={20} className="text-blue-500" />
                                <span className="font-medium">Time</span>
                            </div>
                            <span className="text-5xl font-bold text-white font-mono">
                                {(elapsedTime / 1000).toFixed(1)}s
                            </span>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                        <h3 className="text-lg font-semibold text-gray-300 mb-6 flex items-center gap-2">
                            <ActivityIcon size={18} />
                            Speed Analysis
                        </h3>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={wpmHistory}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                                    <XAxis
                                        dataKey="time"
                                        stroke="#9CA3AF"
                                        tick={{ fill: '#9CA3AF' }}
                                        tickLine={{ stroke: '#4B5563' }}
                                        axisLine={{ stroke: '#4B5563' }}
                                        label={{ value: 'Time (s)', position: 'insideBottom', offset: -5, fill: '#6B7280' }}
                                    />
                                    <YAxis
                                        stroke="#9CA3AF"
                                        tick={{ fill: '#9CA3AF' }}
                                        tickLine={{ stroke: '#4B5563' }}
                                        axisLine={{ stroke: '#4B5563' }}
                                        label={{ value: 'WPM', angle: -90, position: 'insideLeft', fill: '#6B7280' }}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#1F2937', borderColor: '#374151', color: '#F3F4F6' }}
                                        itemStyle={{ color: '#60A5FA' }}
                                        labelStyle={{ color: '#9CA3AF' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="wpm"
                                        stroke="#3B82F6"
                                        strokeWidth={3}
                                        dot={false}
                                        activeDot={{ r: 6, fill: '#60A5FA', stroke: '#1D4ED8', strokeWidth: 2 }}
                                        animationDuration={1500}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
