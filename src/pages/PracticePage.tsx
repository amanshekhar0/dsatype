import { useState } from 'react';
import { useAlgorithm } from '../context/AlgorithmContext';
import { useTyping } from '../context/TypingContext';
import { useSettings } from '../context/SettingsContext';
import { Navbar } from '../components/layout/Navbar';
import { TargetCode } from '../components/TargetCode';
import { TypingArea } from '../components/TypingArea';
import { StatsBar } from '../components/StatsBar';
import { ResultsAnalysis } from '../components/ResultsAnalysis';
import { PasteCodeModal } from '../components/PasteCodeModal';
import { AmbientSoundPlayer } from '../components/AmbientSoundPlayer';
import {
  RefreshCwIcon,
  SparklesIcon,
  EyeIcon,
  EyeOffIcon,
  ClockIcon,
  Loader2Icon,
  CodeIcon,
  BookOpenIcon,
  AlertCircleIcon,
  ClipboardPasteIcon,
  BuildingIcon,
  BriefcaseIcon,
} from 'lucide-react';
import { Difficulty, Language } from '../types';
import { useSEO } from '../hooks/useSEO';

const LANGS: Language[] = ['Java', 'C++', 'Python', 'SQL'];
const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard'];
const COUNTDOWN_OPTIONS = [
  { label: 'Off', value: 0 },
  { label: '15s', value: 15 },
  { label: '30s', value: 30 },
  { label: '1m', value: 60 },
  { label: '2m', value: 120 },
  { label: '3m', value: 180 },
];

const diffColor: Record<Difficulty, string> = {
  Easy: 'bg-green-500/15 text-green-400 border-green-500/30',
  Medium: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  Hard: 'bg-red-500/15 text-red-400 border-red-500/30',
};

// Company logo colors & emojis
const COMPANY_META: Record<string, { emoji: string; color: string }> = {
  'Google': { emoji: '🔵', color: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  'Amazon': { emoji: '📦', color: 'bg-orange-500/10 text-orange-400 border-orange-500/30' },
  'Meta': { emoji: '🔷', color: 'bg-blue-600/10 text-blue-500 border-blue-600/30' },
  'Microsoft': { emoji: '🟦', color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
  'Apple': { emoji: '🍎', color: 'bg-gray-500/10 text-gray-400 border-gray-500/30' },
  'Netflix': { emoji: '🎬', color: 'bg-red-500/10 text-red-400 border-red-500/30' },
  'Goldman Sachs': { emoji: '🏦', color: 'bg-yellow-600/10 text-yellow-500 border-yellow-600/30' },
  'Uber': { emoji: '🚗', color: 'bg-gray-600/10 text-gray-300 border-gray-600/30' },
  'All': { emoji: '🌐', color: 'bg-primary/10 text-primary border-primary/30' },
};

export const PracticePage = () => {
  const {
    currentAlgorithm,
    categories,
    selectedCategory,
    selectedDifficulty,
    setSelectedCategory,
    setSelectedDifficulty,
    fetchRandomAlgorithm,
    language,
    setLanguage,
    isGenerating,
    generationError,
    generateWithAI,
    displayCode,
    setCustomCode,
    isCustomMode,
    selectedCompany,
    setSelectedCompany,
    availableCompanies,
    isInterviewMode,
    setIsInterviewMode,
  } = useAlgorithm();

  const { isCompleted, resetTyping, focusMode, setFocusMode, currentIndex } = useTyping();
  const { settings, updateSettings } = useSettings();
  const [showPasteModal, setShowPasteModal] = useState(false);

  const isTypewriter = settings.visualTheme === 'typewriter';

  useSEO({
    title: `Practice ${language} — ${selectedDifficulty}${selectedCompany !== 'All' ? ` · ${selectedCompany}` : ''}`,
    description:
      'Practice typing real DSA algorithms in Java, C++, Python, and SQL. Track WPM and accuracy live with company-specific questions, AI-generated questions, and focus mode.',
    canonicalPath: '/practice',
  });

  const handleRefresh = () => {
    fetchRandomAlgorithm();
  };

  const handlePasteSubmit = (code: string, title: string, lang?: Language) => {
    setCustomCode(code, title, lang);
    resetTyping();
  };

  const companyMeta = COMPANY_META[selectedCompany] || COMPANY_META['All'];

  return (
    <div className={`min-h-screen text-foreground flex flex-col ${focusMode ? 'overflow-hidden' : ''}`}>
      <Navbar />

      {/* Focus mode overlay controls */}
      {focusMode && (
        <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3 backdrop-blur-md border border-border rounded-full px-5 py-2.5 shadow-xl ${
          isTypewriter ? 'bg-[var(--card)]/90' : 'bg-card/90'
        }`}>
          <span className="text-xs text-muted-foreground">Focus Mode</span>
          <button
            onClick={() => setFocusMode(false)}
            className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium"
          >
            <EyeIcon size={14} />
            Exit Focus
          </button>
        </div>
      )}

      <div className={`flex-1 ${focusMode ? 'py-8' : 'py-6'} px-4 sm:px-6 lg:px-8`}>
        <div className="max-w-7xl mx-auto">

          {/* ═══ Interview Mode Banner ═══ */}
          {isInterviewMode && !focusMode && (
            <div className={`mb-4 rounded-xl border p-4 flex items-center gap-3 animate-fade-up ${
              isTypewriter
                ? 'bg-[#e6dcc3] border-[#c9b896]'
                : 'bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 border-primary/20'
            }`}>
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <BriefcaseIcon size={20} />
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-foreground flex items-center gap-2">
                  🎯 Interview Prep Mode
                  {selectedCompany !== 'All' && (
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${companyMeta.color}`}>
                      {companyMeta.emoji} {selectedCompany}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Practicing company-specific DSA questions. {selectedCompany !== 'All' ? `Showing ${selectedCompany} interview questions.` : 'Showing questions from all top companies.'}
                </p>
              </div>
              <button
                onClick={() => { setIsInterviewMode(false); setSelectedCompany('All'); }}
                className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded hover:bg-muted transition-colors"
              >
                Exit
              </button>
            </div>
          )}

          {/* Controls bar */}
          {!focusMode && (
            <div className="mb-5 space-y-3">
              {/* Language + Difficulty + Category */}
              <div className="flex flex-wrap gap-2 items-center">
                {/* Language tabs */}
                <div className="flex bg-muted rounded-lg p-0.5">
                  {LANGS.map(lang => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        language === lang
                          ? 'bg-card text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                {/* Difficulty */}
                <div className="flex bg-muted rounded-lg p-0.5">
                  {DIFFICULTIES.map(d => (
                    <button
                      key={d}
                      onClick={() => setSelectedDifficulty(d)}
                      className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                        selectedDifficulty === d
                          ? 'bg-card text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>

                {/* Category */}
                <select
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                  className="bg-muted text-foreground py-2 px-3 rounded-lg text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {categories.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                {/* Countdown */}
                <div className="flex items-center gap-1.5 bg-muted rounded-lg p-0.5">
                  <ClockIcon size={14} className="text-muted-foreground ml-2" />
                  {COUNTDOWN_OPTIONS.map(o => (
                    <button
                      key={o.value}
                      onClick={() => updateSettings({ countdownDuration: o.value })}
                      className={`px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                        settings.countdownDuration === o.value
                          ? 'bg-card text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ═══ Company Selector Row ═══ */}
              <div className="flex flex-wrap gap-2 items-center">
                <div className="flex items-center gap-1.5 mr-1">
                  <BuildingIcon size={14} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground font-medium">Company:</span>
                </div>

                {/* Company pills */}
                <div className="flex flex-wrap gap-1.5">
                  {availableCompanies.map(company => {
                    const meta = COMPANY_META[company] || COMPANY_META['All'];
                    return (
                      <button
                        key={company}
                        onClick={() => {
                          setSelectedCompany(company);
                          if (company !== 'All') setIsInterviewMode(true);
                          else if (!isInterviewMode) setIsInterviewMode(false);
                        }}
                        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                          selectedCompany === company
                            ? `${meta.color} shadow-sm`
                            : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted'
                        }`}
                      >
                        <span>{meta.emoji}</span>
                        {company}
                      </button>
                    );
                  })}
                </div>

                {/* Interview mode toggle */}
                <button
                  onClick={() => setIsInterviewMode(!isInterviewMode)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ml-auto ${
                    isInterviewMode
                      ? 'bg-primary/10 text-primary border-primary/30 shadow-sm'
                      : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <BriefcaseIcon size={12} />
                  Interview Prep
                </button>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2 items-center">
                <button
                  onClick={handleRefresh}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 px-3 py-2 bg-card border border-border rounded-lg text-sm hover:bg-muted transition-colors disabled:opacity-50"
                >
                  <RefreshCwIcon size={14} />
                  Random
                </button>
                <button
                  onClick={() => generateWithAI()}
                  disabled={isGenerating}
                  className="flex items-center gap-1.5 px-3 py-2 bg-primary/10 border border-primary/30 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors disabled:opacity-50 font-medium"
                >
                  {isGenerating ? (
                    <Loader2Icon size={14} className="animate-spin" />
                  ) : (
                    <SparklesIcon size={14} />
                  )}
                  {isGenerating ? 'Generating…' : 'Generate with AI'}
                </button>


                {/* PASTE CODE BUTTON */}
                <button
                  onClick={() => setShowPasteModal(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-secondary/10 border border-secondary/30 text-secondary rounded-lg text-sm hover:bg-secondary/20 transition-colors font-medium"
                >
                  <ClipboardPasteIcon size={14} />
                  Paste Code
                </button>

                <button
                  onClick={resetTyping}
                  className="flex items-center gap-1.5 px-3 py-2 bg-card border border-border rounded-lg text-sm hover:bg-muted transition-colors"
                >
                  Restart
                </button>
                <button
                  onClick={() => setFocusMode(true)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-card border border-border rounded-lg text-sm hover:bg-muted transition-colors ml-auto"
                >
                  <EyeOffIcon size={14} />
                  Focus Mode
                </button>
              </div>

              {/* Generation error */}
              {generationError && (
                <div className="flex items-center gap-2 text-sm text-yellow-400 bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-3 py-2">
                  <AlertCircleIcon size={14} />
                  {generationError}
                </div>
              )}
            </div>
          )}

          {/* Algorithm info */}
          {currentAlgorithm && !focusMode && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold text-foreground">{currentAlgorithm.title}</h2>
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${diffColor[currentAlgorithm.difficulty as Difficulty]}`}>
                {currentAlgorithm.difficulty}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                {currentAlgorithm.category}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                <CodeIcon size={10} className="inline mr-1" />
                {language}
              </span>
              {currentAlgorithm.isGenerated && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <SparklesIcon size={10} className="inline mr-1" />
                  AI Generated
                </span>
              )}
              {isCustomMode && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                  <ClipboardPasteIcon size={10} className="inline mr-1" />
                  Pasted
                </span>
              )}

              {/* Company tags */}
              {currentAlgorithm.companies && currentAlgorithm.companies.length > 0 && (
                <div className="flex items-center gap-1 ml-1">
                  {currentAlgorithm.companies.map(company => {
                    const meta = COMPANY_META[company];
                    return (
                      <span
                        key={company}
                        className={`text-xs px-2 py-0.5 rounded-full border font-medium ${meta?.color || 'bg-muted text-muted-foreground border-border'}`}
                        title={`Asked at ${company}`}
                      >
                        {meta?.emoji} {company}
                      </span>
                    );
                  })}
                </div>
              )}

              {currentAlgorithm.estimatedTime && (
                <span className="text-xs text-muted-foreground flex items-center gap-1 ml-auto">
                  <ClockIcon size={12} />
                  ~{currentAlgorithm.estimatedTime}s
                </span>
              )}
            </div>
          )}

          {currentAlgorithm && !focusMode && (
            <p className="text-sm text-muted-foreground mb-5 flex items-center gap-1.5">
              <BookOpenIcon size={14} />
              {currentAlgorithm.description}
            </p>
          )}

          {/* Progress bar */}
          {currentAlgorithm && displayCode && !focusMode && (
            <ProgressBar current={currentIndex} total={displayCode.length} isTypewriter={isTypewriter} />
          )}

          {/* Main practice area */}
          {currentAlgorithm && displayCode ? (
            <div
              className={`relative ${
                focusMode 
                  ? 'h-[calc(100vh-12rem)] w-full max-w-4xl mx-auto mt-4 cursor-text' 
                  : 'grid grid-cols-1 lg:grid-cols-2 gap-4 h-[420px]'
              }`}
              onClick={() => {
                if (focusMode) {
                  document.querySelector('textarea')?.focus();
                }
              }}
            >
              <div className={`relative h-full w-full ${focusMode ? 'text-lg lg:text-xl' : ''}`}>
                {!focusMode && (
                  <div className={`absolute top-2 right-2 z-10 flex items-center gap-1 text-xs text-muted-foreground backdrop-blur-sm px-2 py-1 rounded border border-border ${
                    isTypewriter ? 'bg-[var(--card)]/80' : 'bg-card/80'
                  }`}>
                    <CodeIcon size={12} />
                    {isTypewriter ? 'Manuscript' : 'Target'}
                  </div>
                )}
                <TargetCode code={displayCode} isFocusMode={focusMode} />
              </div>

              <div className={focusMode ? 'absolute inset-0 opacity-0 z-20 pointer-events-none' : 'relative h-full'}>
                {!focusMode && (
                  <div className={`absolute top-2 right-2 z-10 flex items-center gap-1 text-xs text-muted-foreground backdrop-blur-sm px-2 py-1 rounded border border-border ${
                    isTypewriter ? 'bg-[var(--card)]/80' : 'bg-card/80'
                  }`}>
                    {isTypewriter ? '🖋️ Your Typing' : 'Your Input'}
                  </div>
                )}
                <TypingArea targetCode={displayCode} />
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              <Loader2Icon size={24} className="animate-spin mr-2" />
              Loading snippet…
            </div>
          )}

          {/* Stats */}
          <StatsBar />

          {/* Results overlay */}
          {isCompleted && <ResultsAnalysis />}
        </div>
      </div>

      {/* Paste Code Modal */}
      <PasteCodeModal
        isOpen={showPasteModal}
        onClose={() => setShowPasteModal(false)}
        onSubmit={handlePasteSubmit}
      />

      {/* Ambient Sound Player */}
      <AmbientSoundPlayer />
    </div>
  );
};

// ── Progress Bar component ─────────────────────────────────────────────────────
function ProgressBar({
  current,
  total,
  isTypewriter,
}: {
  current: number;
  total: number;
  isTypewriter: boolean;
}) {
  const pct = total > 0 ? Math.min(100, (current / total) * 100) : 0;
  const pctRounded = Math.round(pct);

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-muted-foreground font-medium">Progress</span>
        <span className={`text-xs font-mono font-semibold ${
          pct >= 100
            ? isTypewriter ? 'text-[#2d7a3a]' : 'text-green-400'
            : 'text-muted-foreground'
        }`}>
          {pctRounded}%
        </span>
      </div>
      <div className={`w-full h-1.5 rounded-full overflow-hidden ${
        isTypewriter ? 'bg-[var(--border)]' : 'bg-muted'
      }`}>
        <div
          className={`h-full rounded-full transition-all duration-300 ease-out ${
            pct >= 100
              ? isTypewriter ? 'bg-[#2d7a3a]' : 'bg-green-400'
              : isTypewriter ? 'bg-[#8b4513]' : 'bg-primary'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
