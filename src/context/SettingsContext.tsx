import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppSettings, VisualTheme } from '../types';

const ENV_GROK_API_KEY = (import.meta as any).env?.VITE_GROK_API_KEY ?? '';

const DEFAULT_SETTINGS: AppSettings = {
  fontSize: 'md',
  theme: 'dark',
  visualTheme: 'typewriter',
  soundEffects: true,
  typingFeedback: true,
  showLineNumbers: true,
  caretStyle: 'line',
  countdownDuration: 0,
  grokApiKey: ENV_GROK_API_KEY,
  ambientSound: 'none',
  showKeyboardHeatmap: true,
  smoothCaret: true,
};

const SETTINGS_KEY = 'codetype_settings';

// Map visual themes to legacy dark/light theme for compatibility
const THEME_IS_DARK: Record<VisualTheme, boolean> = {
  typewriter: false,
  midnight: true,
  daylight: false,
  forest: true,
  sakura: false,
};

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  resetSettings: () => void;
  isDark: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) {
        const parsed: Partial<AppSettings> = JSON.parse(saved);
        // If no key was manually saved, fall back to the env variable
        if (!parsed.grokApiKey) parsed.grokApiKey = ENV_GROK_API_KEY;
        // Migrate: if old settings had no visualTheme, default to typewriter
        if (!parsed.visualTheme) {
          parsed.visualTheme = 'typewriter';
        }
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
      return DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const isDark = THEME_IS_DARK[settings.visualTheme];

  useEffect(() => {
    const root = document.documentElement;

    // Apply visual theme as data attribute
    root.setAttribute('data-theme', settings.visualTheme);

    // Keep legacy dark class for tailwind compatibility
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Sync the legacy theme field
    const legacyTheme = isDark ? 'dark' : 'light';
    if (settings.theme !== legacyTheme) {
      setSettings(prev => ({ ...prev, theme: legacyTheme }));
    }

    // Apply font size class to root
    const fsMap: Record<AppSettings['fontSize'], string> = {
      sm: 'fs-sm',
      md: 'fs-md',
      lg: 'fs-lg',
      xl: 'fs-xl',
    };
    root.classList.remove('fs-sm', 'fs-md', 'fs-lg', 'fs-xl');
    root.classList.add(fsMap[settings.fontSize]);

    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings, isDark]);

  const updateSettings = (partial: Partial<AppSettings>) =>
    setSettings(prev => ({ ...prev, ...partial }));

  const resetSettings = () => setSettings(DEFAULT_SETTINGS);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, resetSettings, isDark }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};
