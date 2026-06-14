import React, { useEffect, useRef, useCallback } from 'react';
import { useTyping } from '../context/TypingContext';
import { useSettings } from '../context/SettingsContext';

export const TypingArea = ({ targetCode }: { targetCode: string }) => {
  const {
    typedText,
    setTypedText,
    isRunning,
    setIsRunning,
    setStartTime,
    setCurrentIndex,
    isCompleted,
    focusMode,
  } = useTyping();
  const { settings } = useSettings();

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isTypewriter = settings.visualTheme === 'typewriter';

  useEffect(() => {
    textareaRef.current?.focus();
  }, [targetCode, focusMode]);

  const playTypewriterSound = useCallback((correct: boolean) => {
    if (!settings.soundEffects) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (isTypewriter) {
        // Typewriter mechanical clack sound
        const bufferSize = ctx.sampleRate * 0.05;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
          const t = i / ctx.sampleRate;
          // Short burst of noise that decays quickly
          data[i] = (Math.random() * 2 - 1) * Math.exp(-t * 80) * (correct ? 0.3 : 0.15);
        }

        const source = ctx.createBufferSource();
        source.buffer = buffer;

        const filter = ctx.createBiquadFilter();
        filter.type = correct ? 'bandpass' : 'lowpass';
        filter.frequency.value = correct ? 2500 : 600;
        filter.Q.value = correct ? 1 : 0.5;

        source.connect(filter);
        filter.connect(ctx.destination);
        source.start();
        setTimeout(() => {
          try { ctx.close(); } catch { /* ignore */ }
        }, 100);
        return;
      }

      // Standard sound
      osc.type = 'sine';
      osc.frequency.value = correct ? 700 : 280;
      gain.gain.value = 0.08;
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      osc.stop(ctx.currentTime + 0.1);
    } catch {
      // AudioContext not available
    }
  }, [settings.soundEffects, isTypewriter]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (isCompleted) return;
    const value = e.target.value;

    if (!isRunning) {
      setIsRunning(true);
      setStartTime(new Date());
    }

    if (settings.soundEffects && value.length > typedText.length) {
      const newChar = value[value.length - 1];
      const expected = targetCode[value.length - 1];
      playTypewriterSound(newChar === expected);
    }

    setTypedText(value);
    setCurrentIndex(value.length);
  };

  const handlePaste = () => {
    // Allow pasting — it just gets typed in as if user typed it fast
    // The handleChange will process it normally
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isCompleted) return;
    if (e.key !== 'Enter') return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const pos = textarea.selectionStart ?? typedText.length;
    if (pos > targetCode.length || targetCode[pos] !== '\n') {
      e.preventDefault();
      return;
    }

    e.preventDefault();

    if (!isRunning) {
      setIsRunning(true);
      setStartTime(new Date());
    }

    const nextLine = pos + 1;
    let spaces = 0;
    for (let i = nextLine; i < targetCode.length; i++) {
      if (targetCode[i] === ' ' || targetCode[i] === '\t') spaces++;
      else break;
    }
    const indent = spaces > 0 ? targetCode.slice(nextLine, nextLine + spaces) : '';
    const newValue = typedText.slice(0, pos) + '\n' + indent + typedText.slice(textarea.selectionEnd ?? pos);
    const newPos = pos + 1 + indent.length;

    setTypedText(newValue);
    setCurrentIndex(newPos);

    // Play carriage return sound for typewriter
    if (settings.soundEffects && isTypewriter) {
      try {
        const ctx = new AudioContext();
        const bufferSize = ctx.sampleRate * 0.15;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          const t = i / ctx.sampleRate;
          // Carriage return "ding" + slide
          data[i] = Math.sin(2 * Math.PI * 1200 * t) * Math.exp(-t * 20) * 0.15 +
                     (Math.random() * 2 - 1) * Math.exp(-t * 15) * 0.08;
        }
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(ctx.destination);
        source.start();
        setTimeout(() => { try { ctx.close(); } catch { /* ignore */ } }, 200);
      } catch { /* ignore */ }
    }

    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = newPos;
        textareaRef.current.selectionEnd = newPos;
      }
    }, 0);
  };

  // Compute per-line accuracy for border color feedback
  const accuracyClass = (() => {
    if (!settings.typingFeedback || typedText.length === 0) return '';
    let errors = 0;
    for (let i = 0; i < typedText.length; i++) {
      if (typedText[i] !== targetCode[i]) errors++;
    }
    const pct = (errors / typedText.length) * 100;
    if (pct === 0) return isTypewriter ? 'border-[#2d7a3a]/50' : 'border-green-500/50';
    if (pct < 5) return isTypewriter ? 'border-[#a0760a]/50' : 'border-yellow-500/50';
    return isTypewriter ? 'border-[#a83232]/50' : 'border-red-500/50';
  })();

  const placeholderText = isTypewriter
    ? 'Place your fingers on the keys and begin typing...'
    : 'Click here and start typing…';

  return (
    <div className="h-full flex flex-col">
      <textarea
        ref={textareaRef}
        value={typedText}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
        disabled={isCompleted}
        className={`w-full h-full text-foreground rounded-lg border p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary leading-6 transition-colors ${
          isTypewriter
            ? 'paper-panel bg-transparent'
            : 'bg-card'
        } ${
          accuracyClass || 'border-border'
        } disabled:opacity-60 disabled:cursor-not-allowed`}
        style={isTypewriter ? {
          textShadow: '0.5px 0.5px 0px rgba(26, 18, 9, 0.1)',
          caretColor: 'var(--typewriter-ribbon)',
        } : undefined}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        placeholder={placeholderText}
      />
    </div>
  );
};
