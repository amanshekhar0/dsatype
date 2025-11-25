import { useState } from 'react';
import { useTyping } from '../context/TypingContext';
import { useAlgorithm } from '../context/AlgorithmContext';
import { MoonIcon, SunIcon, InfoIcon } from 'lucide-react';
import { AboutModal } from './AboutModal';

interface HeroProps {
  isDark: boolean;
  toggleTheme: () => void;
}

export const Hero = ({ isDark, toggleTheme }: HeroProps) => {
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const { scrollToTypingSection } = useTyping();
  const { language, setLanguage } = useAlgorithm();

  return <section className="w-full py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center relative">
    <div className="absolute top-4 right-4 flex items-center gap-2">
      <div className="flex items-center bg-muted rounded-lg p-1 mr-2">
        <button
          onClick={() => setLanguage('Java')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${language === 'Java'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          Java
        </button>
        <button
          onClick={() => setLanguage('C++')}
          className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${language === 'C++'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
            }`}
        >
          C++
        </button>
      </div>

      <button
        onClick={() => setIsAboutOpen(true)}
        className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground flex items-center gap-2"
        title="About"
      >
        <span className="text-sm font-medium hidden sm:inline">About</span>
        <InfoIcon size={24} />
      </button>
      <button
        onClick={toggleTheme}
        className="p-2 rounded-full hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDark ? <SunIcon size={24} /> : <MoonIcon size={24} />}
      </button>
    </div>

    <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />


    <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-foreground">
      Type DSA, <span className="text-primary">Code Faster.</span>
    </h1>
    <p className="text-xl text-muted-foreground max-w-2xl mb-8">
      Practice your typing with real {language} DSA algorithms. Improve your coding
      speed and revise algorithms at the same time.
    </p>
    <button onClick={scrollToTypingSection} className="bg-primary text-primary-foreground hover:opacity-90 font-medium py-3 px-6 rounded-md transition-all duration-200 transform hover:scale-105 shadow-lg">
      Start with an Easy Algorithm
    </button>
  </section>;
};