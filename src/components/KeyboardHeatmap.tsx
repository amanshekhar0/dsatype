import { useMemo } from 'react';
import { KeyAccuracy } from '../types';

interface KeyboardHeatmapProps {
  keyAccuracyMap: Record<string, KeyAccuracy>;
}

// Standard QWERTY keyboard layout
const KEYBOARD_ROWS = [
  ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
  ['space'],
];

const ROW_OFFSETS = [0, 0.5, 0.75, 1.25, 3.5]; // em offset per row for stagger

function getHeatColor(accuracy: number, total: number): string {
  if (total === 0) return 'rgba(128, 128, 128, 0.15)';
  if (accuracy >= 98) return 'rgba(34, 197, 94, 0.6)';
  if (accuracy >= 95) return 'rgba(34, 197, 94, 0.35)';
  if (accuracy >= 90) return 'rgba(234, 179, 8, 0.4)';
  if (accuracy >= 80) return 'rgba(249, 115, 22, 0.5)';
  return 'rgba(239, 68, 68, 0.55)';
}

function getTextColor(accuracy: number, total: number): string {
  if (total === 0) return 'var(--muted-foreground)';
  if (accuracy >= 90) return 'var(--foreground)';
  if (accuracy >= 80) return '#fbbf24';
  return '#f87171';
}

export const KeyboardHeatmap = ({ keyAccuracyMap }: KeyboardHeatmapProps) => {
  const totalKeys = useMemo(
    () => Object.values(keyAccuracyMap).reduce((sum, k) => sum + k.total, 0),
    [keyAccuracyMap]
  );

  if (totalKeys === 0) return null;

  // Find most problematic keys
  const problemKeys = useMemo(() => {
    return Object.values(keyAccuracyMap)
      .filter(k => k.total >= 3 && k.accuracy < 90)
      .sort((a, b) => a.accuracy - b.accuracy)
      .slice(0, 5);
  }, [keyAccuracyMap]);

  const getKeyData = (key: string): KeyAccuracy => {
    const lower = key.toLowerCase();
    return keyAccuracyMap[lower] || { key: lower, correct: 0, incorrect: 0, total: 0, accuracy: 0 };
  };

  return (
    <div className="bg-background rounded-lg border border-border p-4">
      <h3 className="text-sm font-semibold text-muted-foreground mb-4 flex items-center gap-2">
        ⌨️ Keyboard Accuracy Heatmap
      </h3>

      {/* Keyboard visual */}
      <div className="flex flex-col items-center gap-1 mb-4">
        {KEYBOARD_ROWS.map((row, rowIdx) => (
          <div
            key={rowIdx}
            className="flex gap-1"
            style={{ paddingLeft: `${ROW_OFFSETS[rowIdx]}em` }}
          >
            {row.map(key => {
              const data = getKeyData(key);
              const isSpace = key === 'space';
              const displayKey = isSpace ? '␣' : key;

              return (
                <div
                  key={key}
                  className="keyboard-key"
                  style={{
                    background: getHeatColor(data.accuracy, data.total),
                    color: getTextColor(data.accuracy, data.total),
                    minWidth: isSpace ? '200px' : '36px',
                    borderColor: data.total > 0 && data.accuracy < 80
                      ? 'rgba(239, 68, 68, 0.4)'
                      : 'var(--border)',
                  }}
                  title={
                    data.total > 0
                      ? `${key}: ${data.accuracy.toFixed(0)}% (${data.correct}/${data.total})`
                      : `${key}: no data`
                  }
                >
                  {displayKey}
                  {data.total > 0 && (
                    <span className="key-accuracy">
                      {data.accuracy.toFixed(0)}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground mb-3">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(34, 197, 94, 0.5)' }} />
          <span>95%+</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(234, 179, 8, 0.4)' }} />
          <span>90-95%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(249, 115, 22, 0.5)' }} />
          <span>80-90%</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-sm" style={{ background: 'rgba(239, 68, 68, 0.55)' }} />
          <span>&lt;80%</span>
        </div>
      </div>

      {/* Problem keys summary */}
      {problemKeys.length > 0 && (
        <div className="bg-muted rounded-lg p-3">
          <div className="text-xs font-semibold text-muted-foreground mb-2">
            🔴 Keys to Practice
          </div>
          <div className="flex flex-wrap gap-2">
            {problemKeys.map(k => (
              <div
                key={k.key}
                className="flex items-center gap-1.5 bg-background rounded-md px-2.5 py-1 border border-border text-xs"
              >
                <span className="font-mono font-bold text-foreground">
                  {k.key === ' ' ? 'Space' : k.key.toUpperCase()}
                </span>
                <span className={k.accuracy < 80 ? 'text-red-400' : 'text-yellow-400'}>
                  {k.accuracy.toFixed(0)}%
                </span>
                <span className="text-muted-foreground">
                  ({k.incorrect} errors)
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
