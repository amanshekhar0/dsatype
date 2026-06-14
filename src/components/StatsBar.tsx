import { useTyping } from '../context/TypingContext';
import { useSettings } from '../context/SettingsContext';
import { ClockIcon, ZapIcon, PercentIcon, AlertTriangleIcon, TimerIcon } from 'lucide-react';

export const StatsBar = () => {
  const { isRunning, elapsedTime, wpm, accuracy, mistakesCount, countdownRemaining } = useTyping();
  const { settings } = useSettings();

  if (!isRunning && elapsedTime === 0) return null;

  const isTypewriter = settings.visualTheme === 'typewriter';

  const secs = Math.floor(elapsedTime / 1000);
  const mins = Math.floor(secs / 60);
  const remSecs = secs % 60;
  const timeStr = mins > 0 ? `${mins}:${String(remSecs).padStart(2, '0')}` : `${secs}s`;

  const isCountdownLow =
    countdownRemaining !== null && countdownRemaining <= 10 && countdownRemaining > 0;

  return (
    <div className={`mt-4 rounded-lg border border-border p-4 animate-fade-up ${
      isTypewriter ? 'paper-panel' : 'bg-card'
    }`}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <ClockIcon size={14} />
            <span>{isTypewriter ? 'Duration' : 'TIME'}</span>
          </div>
          <span className="text-2xl font-mono font-bold text-foreground">{timeStr}</span>
        </div>

        {/* WPM Circular Gauge */}
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <ZapIcon size={14} />
            <span>{isTypewriter ? 'Speed' : 'WPM'}</span>
          </div>
          <WpmGauge wpm={Math.round(wpm)} isTypewriter={isTypewriter} />
        </div>

        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <PercentIcon size={14} />
            <span>{isTypewriter ? 'Precision' : 'ACCURACY'}</span>
          </div>
          <span
            className={`text-2xl font-mono font-bold ${
              accuracy >= 95
                ? isTypewriter ? 'text-[#2d7a3a]' : 'text-green-400'
                : accuracy >= 85
                ? isTypewriter ? 'text-[#a0760a]' : 'text-yellow-400'
                : isTypewriter ? 'text-[#a83232]' : 'text-red-400'
            }`}
          >
            {accuracy.toFixed(1)}%
          </span>
        </div>

        <div className="flex flex-col items-center gap-1">
          {countdownRemaining !== null ? (
            <>
              <div
                className={`flex items-center gap-1.5 text-xs ${
                  isCountdownLow
                    ? isTypewriter ? 'text-[#a83232] animate-pulse' : 'text-red-400 animate-pulse'
                    : 'text-muted-foreground'
                }`}
              >
                <TimerIcon size={14} />
                <span>COUNTDOWN</span>
              </div>
              <span
                className={`text-2xl font-mono font-bold ${
                  isCountdownLow
                    ? isTypewriter ? 'text-[#a83232] animate-pulse' : 'text-red-400 animate-pulse'
                    : 'text-foreground'
                }`}
              >
                {countdownRemaining}s
              </span>
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
                <AlertTriangleIcon size={14} />
                <span>{isTypewriter ? 'Mistakes' : 'ERRORS'}</span>
              </div>
              <span className="text-2xl font-mono font-bold text-foreground">{mistakesCount}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

// ── Circular WPM gauge ────────────────────────────────────────────────────────
const MAX_WPM = 120;
const RADIUS = 22;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function WpmGauge({ wpm, isTypewriter }: { wpm: number; isTypewriter: boolean }) {
  const clampedWpm = Math.min(wpm, MAX_WPM);
  const progress = clampedWpm / MAX_WPM;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  const trackColor = isTypewriter ? '#c9b896' : 'var(--border)';
  const fillColor =
    wpm >= 80
      ? isTypewriter ? '#2d7a3a' : '#4ade80'
      : wpm >= 50
      ? isTypewriter ? '#8b4513' : 'var(--primary)'
      : isTypewriter ? '#a89878' : 'var(--primary)';

  return (
    <div className="relative flex items-center justify-center" style={{ width: 60, height: 60 }}>
      <svg width="60" height="60" style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx="30"
          cy="30"
          r={RADIUS}
          fill="none"
          stroke={trackColor}
          strokeWidth="4"
          opacity="0.4"
        />
        {/* Fill arc */}
        <circle
          cx="30"
          cy="30"
          r={RADIUS}
          fill="none"
          stroke={fillColor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={dashOffset}
          style={{ transition: 'stroke-dashoffset 0.6s ease, stroke 0.4s ease' }}
        />
      </svg>
      <span
        className="absolute font-mono font-bold text-foreground"
        style={{ fontSize: wpm >= 100 ? 13 : 15 }}
      >
        {wpm}
      </span>
    </div>
  );
}
