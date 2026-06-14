import { useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { topicsData } from '../data/topics';
import { useSEO } from '../hooks/useSEO';
import { Navbar } from '../components/layout/Navbar';
import { TargetCode } from '../components/TargetCode';
import { TypingArea } from '../components/TypingArea';
import { StatsBar } from '../components/StatsBar';
import { ResultsAnalysis } from '../components/ResultsAnalysis';
import { useAlgorithm } from '../context/AlgorithmContext';
import { useTyping } from '../context/TypingContext';
import { useSettings } from '../context/SettingsContext';
import { AmbientSoundPlayer } from '../components/AmbientSoundPlayer';
import { BookOpenIcon, ClockIcon, CodeIcon, CpuIcon, Loader2Icon, ArrowRightIcon } from 'lucide-react';

export const TopicPage = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const topic = topicsData.find(t => t.id === topicId);

  const {
    currentAlgorithm,
    setSelectedCategory,
    displayCode,
    language,
    setLanguage
  } = useAlgorithm();

  const { isCompleted, currentIndex } = useTyping();
  const { settings } = useSettings();
  const isTypewriter = settings.visualTheme === 'typewriter';

  useSEO({
    title: topic ? `${topic.title} - DSA Typing Practice & Interview Questions` : 'DSA Topic Not Found',
    description: topic 
      ? `Learn ${topic.title}. Practice typing algorithms, understand time complexity, and prepare for coding interviews.`
      : 'Topic not found on DSA Typing Test.',
    canonicalPath: `/${topicId}`,
  });

  // Set category on mount based on topic
  useEffect(() => {
    if (topic) {
      setSelectedCategory(topic.practiceCategory);
    }
  }, [topic, setSelectedCategory]);

  if (!topic) {
    return <Navigate to="/practice" replace />;
  }

  return (
    <div className="min-h-screen text-foreground flex flex-col">
      <Navbar />

      <div className="flex-1 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          
          {/* SEO Optimized Header Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-foreground mb-4">
              {topic.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
              {topic.definition}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="p-4 rounded-xl border border-border bg-card shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-primary">
                  <ClockIcon size={18} />
                  <h3 className="font-semibold text-foreground">Time Complexity</h3>
                </div>
                <p className="text-muted-foreground text-sm font-mono">{topic.timeComplexity}</p>
              </div>
              <div className="p-4 rounded-xl border border-border bg-card shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-secondary">
                  <CpuIcon size={18} />
                  <h3 className="font-semibold text-foreground">Space Complexity</h3>
                </div>
                <p className="text-muted-foreground text-sm font-mono">{topic.spaceComplexity}</p>
              </div>
            </div>

            <div className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <BookOpenIcon size={20} className="text-primary" />
                <h2 className="text-xl font-bold text-foreground">Top Interview Questions</h2>
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {topic.interviewQuestions.map((q, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg border border-border/50">
                    <ArrowRightIcon size={14} className="text-primary/70 shrink-0" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <hr className="border-border/50 mb-10" />

          {/* Practice Section */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground mb-2 flex items-center gap-2">
              <CodeIcon size={24} className="text-primary" />
              Typing Practice: {topic.title}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Improve your muscle memory for {topic.title} algorithms.
            </p>

            <div className="flex gap-2 mb-4">
              {['Java', 'C++', 'Python', 'SQL'].map(lang => (
                <button
                  key={lang}
                  onClick={() => setLanguage(lang as any)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                    language === lang
                      ? 'bg-card text-foreground border border-border shadow-sm'
                      : 'text-muted-foreground hover:text-foreground bg-muted/50 border border-transparent'
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>

            {currentAlgorithm && displayCode && (
              <ProgressBar current={currentIndex} total={displayCode.length} isTypewriter={isTypewriter} />
            )}

            {currentAlgorithm && displayCode ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 h-[400px]">
                <div className="relative h-full w-full">
                  <div className={`absolute top-2 right-2 z-10 flex items-center gap-1 text-xs text-muted-foreground backdrop-blur-sm px-2 py-1 rounded border border-border ${
                    isTypewriter ? 'bg-[var(--card)]/80' : 'bg-card/80'
                  }`}>
                    <CodeIcon size={12} /> Target
                  </div>
                  <TargetCode code={displayCode} isFocusMode={false} />
                </div>

                <div className="relative h-full">
                  <div className={`absolute top-2 right-2 z-10 flex items-center gap-1 text-xs text-muted-foreground backdrop-blur-sm px-2 py-1 rounded border border-border ${
                    isTypewriter ? 'bg-[var(--card)]/80' : 'bg-card/80'
                  }`}>
                    Your Input
                  </div>
                  <TypingArea targetCode={displayCode} />
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-muted-foreground bg-muted/20 rounded-xl border border-border">
                <Loader2Icon size={24} className="animate-spin mr-2" />
                Loading practice snippet…
              </div>
            )}
            
            <div className="mt-4">
               <StatsBar />
            </div>
            
            {isCompleted && <ResultsAnalysis />}
          </div>

        </div>
      </div>
      <AmbientSoundPlayer />
    </div>
  );
};

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
