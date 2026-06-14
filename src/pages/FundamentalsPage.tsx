import { useEffect, useState, useMemo } from 'react';
import { useAlgorithm } from '../context/AlgorithmContext';
import { useTyping } from '../context/TypingContext';
import { useSettings } from '../context/SettingsContext';
import { Navbar } from '../components/layout/Navbar';
import { StatsBar } from '../components/StatsBar';
import { ResultsAnalysis } from '../components/ResultsAnalysis';
import { AmbientSoundPlayer } from '../components/AmbientSoundPlayer';
import { TypingArea } from '../components/TypingArea';
import { fundamentalsData } from '../data/fundamentals';
import { useSEO } from '../hooks/useSEO';
import {
  BookOpenIcon,
  RefreshCwIcon,
  HelpCircleIcon,
  SearchIcon,
  ChevronRightIcon,
  AwardIcon,
  EyeIcon,
  EyeOffIcon,
  CheckIcon,
} from 'lucide-react';
import { Difficulty, AlgorithmSnippet } from '../types';

const CATEGORIES = ['All', 'Operating Systems', 'Computer Networks', 'Database Systems', 'OOP Concepts', 'Algorithms & Structures'];
const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

const diffColor: Record<Difficulty, string> = {
  Easy: 'bg-green-500/15 text-green-400 border-green-500/30',
  Medium: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
  Hard: 'bg-red-500/15 text-red-400 border-red-500/30',
};

const catColor: Record<string, string> = {
  'Operating Systems': 'bg-blue-500/10 text-blue-400',
  'Computer Networks': 'bg-violet-500/10 text-violet-400',
  'Database Systems': 'bg-orange-500/10 text-orange-400',
  'OOP Concepts': 'bg-green-500/10 text-green-400',
  'Algorithms & Structures': 'bg-pink-500/10 text-pink-400',
};

// Renders the answer text with per-character correct/incorrect/untyped highlighting
function TheoryText({ answer, typedText, currentIndex }: { answer: string; typedText: string; currentIndex: number }) {
  return (
    <p className="font-sans text-base leading-8 tracking-wide break-words whitespace-pre-wrap">
      {answer.split('').map((char, idx) => {
        let cls = 'text-muted-foreground/60';
        if (idx < typedText.length) {
          cls = typedText[idx] === char ? 'text-green-400' : 'text-red-400 bg-red-500/20 rounded-sm';
        } else if (idx === currentIndex) {
          cls = 'border-l-2 border-primary text-foreground';
        }
        return (
          <span key={idx} className={cls}>
            {char}
          </span>
        );
      })}
    </p>
  );
}

export const FundamentalsPage = () => {
  const { currentAlgorithm, setQAAlgorithm, displayCode } = useAlgorithm();
  const { isCompleted, resetTyping, typedText, currentIndex } = useTyping();
  const { settings } = useSettings();

  const [selectedCat, setSelectedCat] = useState('All');
  const [selectedDiff, setSelectedDiff] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeId, setActiveId] = useState('');
  const [showAnswer, setShowAnswer] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const isTypewriter = settings.visualTheme === 'typewriter';

  useSEO({
    title: 'CS Fundamentals Typing Practice',
    description: 'Master computer science fundamentals while typing. Practice OS, networking, DBMS, OOP, and algorithms by typing detailed answers.',
    canonicalPath: '/fundamentals',
  });

  const filteredQuestions = useMemo(() => {
    return fundamentalsData.filter(q => {
      const matchCat = selectedCat === 'All' || q.category === selectedCat;
      const matchDiff = selectedDiff === 'All' || q.difficulty === selectedDiff;
      const matchSearch =
        q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchDiff && matchSearch;
    });
  }, [selectedCat, selectedDiff, searchQuery]);

  useEffect(() => {
    if (filteredQuestions.length > 0) {
      const exists = filteredQuestions.some(q => q.id === activeId);
      if (!exists) {
        const first = filteredQuestions[0];
        setActiveId(first.id);
        setQAAlgorithm(first);
      }
    }
  }, [filteredQuestions, activeId, setQAAlgorithm]);

  const handleSelectQuestion = (q: AlgorithmSnippet) => {
    setActiveId(q.id);
    setQAAlgorithm(q);
    resetTyping();
    setShowAnswer(true);
  };

  const pct = displayCode.length > 0 ? Math.min(100, (currentIndex / displayCode.length) * 100) : 0;
  const pctRounded = Math.round(pct);

  return (
    <div className="min-h-screen text-foreground flex flex-col">
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* ═══ Sidebar ═══ */}
        <aside className={`${sidebarOpen ? 'w-72' : 'w-0'} transition-all duration-300 overflow-hidden shrink-0 border-r border-border flex flex-col`}>
          <div className="p-4 space-y-3 overflow-y-auto flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Questions</h2>
              <span className="text-[10px] font-mono bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                {filteredQuestions.length}
              </span>
            </div>

            {/* Search */}
            <div className="relative">
              <SearchIcon size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-background/50 border border-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            {/* Category */}
            <select
              value={selectedCat}
              onChange={e => setSelectedCat(e.target.value)}
              className="w-full bg-background/50 border border-border rounded-lg px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            {/* Difficulty pills */}
            <div className="flex gap-1 flex-wrap">
              {DIFFICULTIES.map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDiff(d)}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold border transition-all ${
                    selectedDiff === d
                      ? 'bg-primary/15 text-primary border-primary/30'
                      : 'border-border text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            {/* Questions list */}
            <div className="space-y-1.5">
              {filteredQuestions.length > 0 ? filteredQuestions.map(q => (
                <button
                  key={q.id}
                  onClick={() => handleSelectQuestion(q)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex flex-col gap-1 ${
                    activeId === q.id
                      ? 'bg-primary/10 border-primary/30 shadow-sm'
                      : 'border-transparent hover:bg-muted/40 hover:border-border/50'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-semibold text-foreground line-clamp-2 leading-tight">{q.title}</span>
                    {activeId === q.id && <ChevronRightIcon size={12} className="text-primary shrink-0" />}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded border font-semibold ${diffColor[q.difficulty as Difficulty]}`}>
                      {q.difficulty}
                    </span>
                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-medium ${catColor[q.category] || 'bg-muted text-muted-foreground'}`}>
                      {q.category}
                    </span>
                  </div>
                </button>
              )) : (
                <p className="text-xs text-muted-foreground text-center py-6">No questions found.</p>
              )}
            </div>
          </div>
        </aside>

        {/* ═══ Main Content ═══ */}
        <main className="flex-1 overflow-y-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto space-y-5">

            {/* Header row */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                title={sidebarOpen ? 'Hide sidebar' : 'Show sidebar'}
                className="p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                <BookOpenIcon size={16} />
              </button>
              <div>
                <h1 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <AwardIcon className="text-primary" size={20} />
                  CS Fundamentals Q&A
                </h1>
                <p className="text-xs text-muted-foreground">
                  Read the question, then type the answer in the text area below.
                </p>
              </div>
            </div>

            {currentAlgorithm ? (
              <>
                {/* Question Card */}
                <div className="glass rounded-2xl p-5 border border-primary/20 relative overflow-hidden shadow-lg">
                  <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-primary/30 rounded-l-2xl" />
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <HelpCircleIcon size={16} />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Theory Question</p>
                        <h2 className="text-base font-bold text-foreground">{currentAlgorithm.title}</h2>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${diffColor[currentAlgorithm.difficulty as Difficulty]}`}>
                        {currentAlgorithm.difficulty}
                      </span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${catColor[currentAlgorithm.category] || 'bg-muted text-muted-foreground'}`}>
                        {currentAlgorithm.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-foreground text-base font-medium leading-relaxed pl-10">
                    {currentAlgorithm.description}
                  </p>
                </div>

                {/* Answer + Typing Controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={resetTyping}
                    className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <RefreshCwIcon size={12} />
                    Restart
                  </button>

                  <button
                    onClick={() => setShowAnswer(!showAnswer)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 border rounded-lg text-xs font-medium transition-all ${
                      showAnswer
                        ? 'border-primary/30 bg-primary/10 text-primary hover:bg-primary/20'
                        : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted'
                    }`}
                  >
                    {showAnswer ? <EyeIcon size={12} /> : <EyeOffIcon size={12} />}
                    {showAnswer ? 'Answer Visible' : 'Answer Hidden'}
                  </button>

                  {/* Progress */}
                  <div className="flex-1 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${pct >= 100 ? 'bg-green-400' : 'bg-primary'}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className={`text-xs font-mono font-bold ${pct >= 100 ? 'text-green-400' : 'text-muted-foreground'}`}>
                      {pct >= 100 ? <CheckIcon size={14} className="inline" /> : `${pctRounded}%`}
                    </span>
                  </div>
                </div>

                {/* Answer Target — styled readable text view */}
                {showAnswer && (
                  <div className={`glass rounded-2xl border border-border overflow-hidden transition-all duration-300`}>
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
                      <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                        <BookOpenIcon size={12} />
                        Answer to type
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">{displayCode.length} chars</span>
                    </div>
                    <div className="p-5">
                      <TheoryText
                        answer={displayCode}
                        typedText={typedText}
                        currentIndex={currentIndex}
                      />
                    </div>
                  </div>
                )}

                {/* Typing Input Area */}
                <div className={`glass rounded-2xl border border-border overflow-hidden`}>
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/30">
                    <span className="text-xs font-semibold text-muted-foreground">
                      🖋️ Type here
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">{typedText.length} / {displayCode.length}</span>
                  </div>
                  <div className="h-52 p-1">
                    <TypingArea targetCode={displayCode} />
                  </div>
                </div>

                {/* Live stats */}
                <StatsBar />

                {/* Completion overlay */}
                {isCompleted && <ResultsAnalysis />}
              </>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
                Select a question from the sidebar to begin.
              </div>
            )}
          </div>
        </main>
      </div>

      <AmbientSoundPlayer />
    </div>
  );
};
