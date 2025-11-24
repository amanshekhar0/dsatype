import React from 'react';
import { Hero } from './components/Hero';
import { TypingSection } from './components/TypingSection';
import { HistorySection } from './components/HistorySection';
import { AlgorithmProvider } from './context/AlgorithmContext';
import { TypingProvider } from './context/TypingContext';
export function App() {
  return <div className="min-h-screen bg-gray-900 text-gray-200 flex flex-col">
      <AlgorithmProvider>
        <TypingProvider>
          <Hero />
          <TypingSection />
          <HistorySection />
        </TypingProvider>
      </AlgorithmProvider>
    </div>;
}