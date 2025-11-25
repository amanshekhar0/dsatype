import { useState, useEffect } from 'react';
import { Hero } from './components/Hero';
import { TypingSection } from './components/TypingSection';
import { HistorySection } from './components/HistorySection';
import { AlgorithmProvider } from './context/AlgorithmContext';
import { TypingProvider } from './context/TypingContext';

export function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(!isDark);

  return <div className="min-h-screen bg-background text-foreground flex flex-col transition-colors duration-300">
    <AlgorithmProvider>
      <TypingProvider>
        <Hero isDark={isDark} toggleTheme={toggleTheme} />
        <TypingSection />
        <HistorySection />
      </TypingProvider>
    </AlgorithmProvider>
  </div>;
}