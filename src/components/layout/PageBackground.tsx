/**
 * Fixed, non-interactive decorative layer rendered behind all content.
 * Theme-specific backgrounds: typewriter paper, midnight blobs, forest scanlines, sakura petals.
 */
import { useSettings } from '../../context/SettingsContext';
import { useMemo } from 'react';

export const PageBackground = () => {
  const { settings } = useSettings();
  const theme = settings.visualTheme;

  // Generate sakura petal positions
  const petals = useMemo(() => {
    if (theme !== 'sakura') return [];
    return Array.from({ length: 12 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      delay: `${Math.random() * 15}s`,
      duration: `${10 + Math.random() * 10}s`,
      size: 8 + Math.random() * 10,
    }));
  }, [theme]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* base */}
      <div className="absolute inset-0 bg-background" />

      {/* ── Typewriter: subtle paper texture ──────────────────────── */}
      {theme === 'typewriter' && (
        <>
          {/* Aged paper overlay */}
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `
                radial-gradient(circle at 20% 50%, rgba(139, 69, 19, 0.03) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(139, 69, 19, 0.04) 0%, transparent 40%),
                radial-gradient(circle at 50% 80%, rgba(139, 69, 19, 0.02) 0%, transparent 60%)
              `,
            }}
          />
          {/* Faint ruled lines */}
          <div
            className="absolute inset-0 opacity-15"
            style={{
              backgroundImage: `repeating-linear-gradient(
                transparent,
                transparent 31px,
                #c9b896 31px,
                #c9b896 32px
              )`,
            }}
          />
        </>
      )}

      {/* ── Midnight: gradient blobs + grid ──────────────────────── */}
      {theme === 'midnight' && (
        <>
          <div className="absolute inset-0 app-grid" />
          <div
            className="blob animate-float"
            style={{
              top: '-8rem',
              left: '-6rem',
              width: '32rem',
              height: '32rem',
              background: 'radial-gradient(circle, var(--primary-glow), transparent 70%)',
            }}
          />
          <div
            className="blob animate-float"
            style={{
              bottom: '-10rem',
              right: '-8rem',
              width: '36rem',
              height: '36rem',
              background: 'radial-gradient(circle, var(--secondary-glow), transparent 70%)',
              animationDelay: '5s',
            }}
          />
        </>
      )}

      {/* ── Daylight: soft warm gradient ──────────────────────────── */}
      {theme === 'daylight' && (
        <>
          <div
            className="absolute inset-0 opacity-40"
            style={{
              background: `
                radial-gradient(ellipse at 20% 0%, rgba(217, 119, 6, 0.08) 0%, transparent 50%),
                radial-gradient(ellipse at 80% 100%, rgba(99, 102, 241, 0.06) 0%, transparent 50%)
              `,
            }}
          />
          <div className="absolute inset-0 app-grid opacity-20" />
        </>
      )}

      {/* ── Forest: matrix scanline + green glow ─────────────────── */}
      {theme === 'forest' && (
        <>
          <div className="absolute inset-0 app-grid opacity-30" />
          <div
            className="blob animate-float"
            style={{
              top: '-10rem',
              left: '20%',
              width: '30rem',
              height: '30rem',
              background: 'radial-gradient(circle, var(--primary-glow), transparent 70%)',
            }}
          />
          <div
            className="blob animate-float"
            style={{
              bottom: '-8rem',
              right: '10%',
              width: '25rem',
              height: '25rem',
              background: 'radial-gradient(circle, var(--secondary-glow), transparent 70%)',
              animationDelay: '7s',
            }}
          />
          {/* CRT scanline overlay */}
          <div className="forest-scanline" />
        </>
      )}

      {/* ── Sakura: floating petals ───────────────────────────────── */}
      {theme === 'sakura' && (
        <>
          <div
            className="absolute inset-0 opacity-30"
            style={{
              background: `
                radial-gradient(ellipse at 30% 20%, rgba(219, 39, 119, 0.06) 0%, transparent 50%),
                radial-gradient(ellipse at 70% 80%, rgba(167, 139, 250, 0.06) 0%, transparent 50%)
              `,
            }}
          />
          {petals.map(petal => (
            <div
              key={petal.id}
              className="sakura-petal"
              style={{
                left: petal.left,
                width: `${petal.size}px`,
                height: `${petal.size}px`,
                animationDelay: petal.delay,
                animationDuration: petal.duration,
              }}
            />
          ))}
        </>
      )}
    </div>
  );
};
