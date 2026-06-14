import { Link } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { useSettings } from '../context/SettingsContext';
import { useSEO } from '../hooks/useSEO';
import {
  ZapIcon,
  TrophyIcon,
  BarChart3Icon,
  CodeIcon,
  SparklesIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  CheckIcon,
  PaletteIcon,
  ClipboardPasteIcon,
} from 'lucide-react';

const features = [
  {
    icon: <CodeIcon size={20} />,
    title: 'Multi-Language Support',
    desc: 'Practice with Java, C++, Python, and SQL — real algorithms, not Lorem Ipsum.',
  },
  {
    icon: <SparklesIcon size={20} />,
    title: 'AI Question Generation',
    desc: 'Use Grok AI to generate fresh coding questions on demand. Never type the same snippet twice.',
  },
  {
    icon: <ClipboardPasteIcon size={20} />,
    title: 'Paste Your Own Code',
    desc: 'Paste any code snippet and practice typing it. Perfect for drilling your own projects.',
  },
  {
    icon: <PaletteIcon size={20} />,
    title: '5 Visual Themes',
    desc: 'Typewriter, Midnight, Daylight, Forest, and Sakura — each with unique vibes and effects.',
  },
  {
    icon: <ZapIcon size={20} />,
    title: 'Real-Time Metrics',
    desc: 'Track WPM, accuracy, error patterns, and session duration live as you type.',
  },
  {
    icon: <BarChart3Icon size={20} />,
    title: 'Keyboard Heatmap',
    desc: 'See your accuracy per key on a visual keyboard. Identify and train your weak spots.',
  },
  {
    icon: <TrophyIcon size={20} />,
    title: 'Achievements & Streaks',
    desc: 'Unlock 14 achievements, maintain daily streaks, and climb the global leaderboard.',
  },
  {
    icon: <ShieldCheckIcon size={20} />,
    title: 'Ambient Sounds',
    desc: 'Rain, café, lo-fi, or typewriter ambience. Set the perfect mood for deep focus.',
  },
];

const langCards = [
  { lang: 'Java', dot: 'bg-orange-400', sample: 'public int binarySearch(int[] a, int t) {' },
  { lang: 'Python', dot: 'bg-blue-400', sample: 'def binary_search(arr, target):' },
  { lang: 'C++', dot: 'bg-purple-400', sample: 'int binarySearch(vector<int>& a, int t) {' },
  { lang: 'SQL', dot: 'bg-emerald-400', sample: 'SELECT u.name, COUNT(o.id) AS orders' },
];

const stats = [
  { value: '5', label: 'Themes' },
  { value: '50+', label: 'Algorithms' },
  { value: '14', label: 'Achievements' },
  { value: '∞', label: 'AI Questions' },
];

export const HomePage = () => {
  const { settings } = useSettings();
  const isTypewriter = settings.visualTheme === 'typewriter';

  useSEO({
    title: 'CodeType — Master Coding Speed | Typing Practice for Developers',
    description:
      'Improve your coding typing speed with real DSA algorithms in Java, C++, Python, and SQL. Track WPM, accuracy, and progress with AI-generated questions, achievements, and leaderboards.',
    canonicalPath: '/',
  });

  return (
    <div className="min-h-screen text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative max-w-5xl mx-auto px-4 pt-20 pb-16 text-center">
        <div className={`inline-flex items-center gap-2 glass text-primary text-sm px-4 py-1.5 rounded-full mb-7 font-medium animate-fade-up ${
          isTypewriter ? 'font-[var(--font-display)]' : ''
        }`}>
          {isTypewriter ? '🖋️' : <SparklesIcon size={14} />}
          {isTypewriter ? 'Typewriter-Grade Coding Practice' : 'AI-Powered Coding Typing Practice'}
        </div>

        <h1 className="font-display text-5xl sm:text-7xl font-extrabold leading-[1.05] mb-6 animate-fade-up delay-100">
          {isTypewriter ? (
            <>
              Type Code.
              <br />
              <span className="text-gradient">Like a Master.</span>
            </>
          ) : (
            <>
              Type Code.
              <br />
              <span className="text-gradient">Think Faster.</span>
            </>
          )}
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-9 animate-fade-up delay-200">
          {isTypewriter
            ? 'The typewriter-inspired coding platform. Drill real DSA algorithms on aged paper with ink effects, ambient sounds, and five stunning visual themes.'
            : 'The typing practice platform built for developers. Drill real DSA algorithms across four languages, track every keystroke, and compete with coders worldwide.'
          }
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up delay-300">
          <Link to="/practice" className="btn btn-primary px-8 py-3.5 text-base">
            {isTypewriter ? '🖋️ Start Typing' : 'Start Practicing'}
            <ArrowRightIcon size={18} />
          </Link>
          <Link to="/signup" className="btn btn-ghost px-8 py-3.5 text-base">
            Create Free Account
          </Link>
        </div>

        {/* Stat row */}
        <div className="grid grid-cols-4 gap-3 max-w-2xl mx-auto mt-16 animate-fade-up delay-400">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <div className="font-display text-3xl sm:text-4xl font-bold text-gradient-amber">
                {s.value}
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Code preview mockup */}
      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className={`rounded-2xl overflow-hidden shadow-2xl animate-fade-up ${
          isTypewriter ? 'paper-panel border border-border' : 'glass-strong'
        }`}>
          <div className={`flex items-center gap-2 px-4 py-3 border-b border-border/60 ${
            isTypewriter ? 'bg-[#ddd3b8]' : ''
          }`}>
            <span className={`w-3 h-3 rounded-full ${isTypewriter ? 'bg-[#a83232]/80' : 'bg-red-400/80'}`} />
            <span className={`w-3 h-3 rounded-full ${isTypewriter ? 'bg-[#a0760a]/80' : 'bg-yellow-400/80'}`} />
            <span className={`w-3 h-3 rounded-full ${isTypewriter ? 'bg-[#2d7a3a]/80' : 'bg-green-400/80'}`} />
            <span className="ml-3 text-xs text-muted-foreground font-mono">
              {isTypewriter ? 'manuscript.py' : 'binary_search.py'}
            </span>
          </div>
          <div className="p-6 font-mono text-sm leading-relaxed overflow-x-auto">
            <div><span className="text-purple-400">def</span> <span className="text-primary">binary_search</span>(arr, target):</div>
            <div className="pl-4"><span className="text-muted-foreground">left, right</span> = <span className="text-emerald-400">0</span>, <span className="text-muted-foreground">len</span>(arr) - <span className="text-emerald-400">1</span></div>
            <div className="pl-4"><span className="text-purple-400">while</span> left &lt;= right:</div>
            <div className="pl-8">mid = (left + right) // <span className="text-emerald-400">2</span></div>
            <div className="pl-8"><span className="text-purple-400">if</span> arr[mid] == target:</div>
            <div className="pl-12"><span className="text-purple-400">return</span> mid<span className="inline-block w-2 h-4 bg-primary ml-0.5 align-middle animate-pulse" /></div>
          </div>
        </div>
      </section>

      {/* Language cards */}
      <section className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {langCards.map(c => (
            <div key={c.lang} className={`rounded-xl p-4 hover-lift hover:border-primary/30 ${
              isTypewriter ? 'paper-panel border border-border' : 'glass'
            }`}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                <span className="font-semibold text-foreground">{c.lang}</span>
              </div>
              <code className="text-xs text-muted-foreground font-mono break-all">{c.sample}</code>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-5xl mx-auto px-4 py-16 border-t border-border/60">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">
            Everything you need to <span className="text-gradient-amber">level up</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A complete toolkit to measure, track, and accelerate your coding speed.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(f => (
            <div key={f.title} className={`rounded-2xl p-6 hover-lift hover:border-primary/30 ${
              isTypewriter ? 'paper-panel border border-border' : 'glass'
            }`}>
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-3xl mx-auto px-4 py-20">
        <div className={`rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden ${
          isTypewriter ? 'paper-panel border border-border' : 'glass-strong'
        }`}>
          <div
            className="absolute inset-0 -z-10 opacity-60"
            style={{
              background:
                'radial-gradient(circle at 50% 0%, var(--primary-glow), transparent 60%)',
            }}
          />
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
            {isTypewriter ? 'Ready to type like a pro?' : 'Ready to code faster?'}
          </h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            Join developers improving their coding speed every day. No credit card, no setup.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mb-8 text-sm text-muted-foreground">
            {['Free forever', 'No installation', 'Works in your browser'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckIcon size={15} className="text-success" />
                {t}
              </span>
            ))}
          </div>
          <Link to="/practice" className="btn btn-primary px-8 py-3.5 text-base">
            <ZapIcon size={18} />
            Start for Free
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/60 py-8 text-center text-sm text-muted-foreground">
        <p>
          <span className="font-display font-semibold text-foreground">CodeType</span> — built for
          developers who type code, not Lorem Ipsum.
        </p>
      </footer>
    </div>
  );
};
