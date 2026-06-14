import { useState } from 'react';
import { Navbar } from '../components/layout/Navbar';
import { useSEO } from '../hooks/useSEO';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import {
  SettingsIcon,
  EyeIcon,
  EyeOffIcon,
  RotateCcwIcon,
  CheckIcon,
  PaletteIcon,
  Volume2Icon,
  KeyboardIcon,
} from 'lucide-react';
import { AppSettings, VisualTheme, AmbientSound } from '../types';

type FontSize = AppSettings['fontSize'];
type CaretStyle = AppSettings['caretStyle'];

const Section = ({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) => (
  <div className="glass rounded-xl p-5 mb-4">
    <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
      {icon}
      {title}
    </h2>
    <div className="space-y-4">{children}</div>
  </div>
);

const Row = ({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) => (
  <div className="flex items-center justify-between gap-4">
    <div>
      <div className="text-sm font-medium text-foreground">{label}</div>
      {desc && <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>}
    </div>
    <div className="shrink-0">{children}</div>
  </div>
);

const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
  <button
    onClick={() => onChange(!value)}
    className={`relative inline-flex w-10 h-5.5 rounded-full transition-colors ${value ? 'bg-primary' : 'bg-muted'}`}
  >
    <span
      className={`inline-block w-4 h-4 mt-0.5 ml-0.5 rounded-full bg-white shadow transition-transform ${value ? 'translate-x-5' : 'translate-x-0'}`}
    />
  </button>
);

// Theme preview data
const THEMES: {
  value: VisualTheme;
  label: string;
  icon: string;
  desc: string;
  previewBg: string;
  previewAccent: string;
  previewText: string;
}[] = [
  {
    value: 'typewriter',
    label: 'Typewriter',
    icon: '🖋️',
    desc: 'Aged paper, ink effects, typewriter sounds',
    previewBg: 'linear-gradient(135deg, #f4edd8, #ede4c9)',
    previewAccent: '#8b4513',
    previewText: '#2c2416',
  },
  {
    value: 'midnight',
    label: 'Midnight',
    icon: '🌑',
    desc: 'Deep blacks, neon amber & indigo glows',
    previewBg: 'linear-gradient(135deg, #050810, #0a0f1e)',
    previewAccent: '#fbbf24',
    previewText: '#e8ecf4',
  },
  {
    value: 'daylight',
    label: 'Daylight',
    icon: '☀️',
    desc: 'Warm cream tones, clean & crisp',
    previewBg: 'linear-gradient(135deg, #faf8f2, #ffffff)',
    previewAccent: '#d97706',
    previewText: '#1a1a2e',
  },
  {
    value: 'forest',
    label: 'Forest',
    icon: '🌲',
    desc: 'Green terminal aesthetic, matrix vibes',
    previewBg: 'linear-gradient(135deg, #0a120a, #0f1a0f)',
    previewAccent: '#4caf50',
    previewText: '#c8e6c9',
  },
  {
    value: 'sakura',
    label: 'Sakura',
    icon: '🌸',
    desc: 'Soft pink pastels, cherry blossom accents',
    previewBg: 'linear-gradient(135deg, #fdf2f8, #ffffff)',
    previewAccent: '#db2777',
    previewText: '#3b1f3b',
  },
];

const AMBIENT_SOUNDS: { value: AmbientSound; label: string; icon: string; desc: string }[] = [
  { value: 'none', label: 'Off', icon: '🔇', desc: 'No ambient sound' },
  { value: 'typewriter', label: 'Typewriter', icon: '🖋️', desc: 'Subtle mechanical hum' },
  { value: 'rain', label: 'Rain', icon: '🌧️', desc: 'Gentle rainfall' },
  { value: 'cafe', label: 'Café', icon: '☕', desc: 'Coffee shop ambience' },
  { value: 'lofi', label: 'Lo-fi', icon: '🎵', desc: 'Relaxing lo-fi chords' },
];

export const SettingsPage = () => {
  const { settings, updateSettings, resetSettings } = useSettings();
  const { user } = useAuth();
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useSEO({
    title: 'Settings',
    description: 'Customize CodeType — visual themes, font size, caret style, sound effects, ambient sounds, and AI generation.',
    canonicalPath: '/settings',
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const fontSizes: { label: string; value: FontSize }[] = [
    { label: 'Small (12px)', value: 'sm' },
    { label: 'Medium (14px)', value: 'md' },
    { label: 'Large (16px)', value: 'lg' },
    { label: 'X-Large (18px)', value: 'xl' },
  ];

  const caretStyles: { label: string; value: CaretStyle }[] = [
    { label: 'Line |', value: 'line' },
    { label: 'Block ▌', value: 'block' },
    { label: 'Underline _', value: 'underline' },
  ];

  return (
    <div className="min-h-screen text-foreground">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <SettingsIcon size={26} className="text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        </div>

        {user && (
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4 text-sm">
            Signed in as <span className="font-semibold text-primary">{user.username}</span>{' '}
            <span className="text-muted-foreground">({user.email})</span>
          </div>
        )}

        {/* ═══ Visual Theme Picker ═══ */}
        <Section title="Visual Theme" icon={<PaletteIcon size={14} />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {THEMES.map(theme => (
              <button
                key={theme.value}
                onClick={() => updateSettings({ visualTheme: theme.value })}
                className={`theme-card text-left ${
                  settings.visualTheme === theme.value ? 'active' : ''
                }`}
              >
                {/* Preview swatch */}
                <div
                  className="theme-preview"
                  style={{ background: theme.previewBg }}
                >
                  {/* Mini code preview */}
                  <div className="absolute inset-2 flex flex-col justify-center px-2">
                    <div
                      className="text-[8px] font-mono leading-tight opacity-70"
                      style={{ color: theme.previewText }}
                    >
                      def binary_search():
                    </div>
                    <div
                      className="text-[8px] font-mono leading-tight opacity-70 pl-2"
                      style={{ color: theme.previewAccent }}
                    >
                      {'  return mid'}
                      <span
                        className="inline-block w-0.5 h-2 ml-0.5 align-text-bottom animate-pulse"
                        style={{ background: theme.previewAccent }}
                      />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="flex items-center gap-2">
                  <span className="text-lg">{theme.icon}</span>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{theme.label}</div>
                    <div className="text-xs text-muted-foreground">{theme.desc}</div>
                  </div>
                </div>

                {/* Active indicator */}
                {settings.visualTheme === theme.value && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <CheckIcon size={12} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </Section>

        {/* ═══ Ambient Sounds ═══ */}
        <Section title="Ambient Sounds" icon={<Volume2Icon size={14} />}>
          <p className="text-xs text-muted-foreground mb-3">
            Background sounds generated with Web Audio API — no downloads required.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {AMBIENT_SOUNDS.map(sound => (
              <button
                key={sound.value}
                onClick={() => updateSettings({ ambientSound: sound.value })}
                className={`flex items-center gap-2 p-3 rounded-lg border transition-all text-left ${
                  settings.ambientSound === sound.value
                    ? 'border-primary bg-primary/10 text-foreground'
                    : 'border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                <span className="text-lg">{sound.icon}</span>
                <div>
                  <div className="text-sm font-medium">{sound.label}</div>
                  <div className="text-xs opacity-70">{sound.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </Section>

        {/* ═══ Appearance ═══ */}
        <Section title="Appearance" icon={<PaletteIcon size={14} />}>
          <Row label="Font Size" desc="Applies to the code display and typing area">
            <select
              value={settings.fontSize}
              onChange={e => updateSettings({ fontSize: e.target.value as FontSize })}
              className="bg-muted text-foreground px-3 py-1.5 rounded-lg text-sm border-0 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {fontSizes.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </Row>

          <Row label="Caret Style" desc="How the cursor is shown in the code display">
            <div className="flex bg-muted rounded-lg p-0.5">
              {caretStyles.map(c => (
                <button
                  key={c.value}
                  onClick={() => updateSettings({ caretStyle: c.value })}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium font-mono transition-all ${settings.caretStyle === c.value ? 'bg-card shadow-sm text-foreground' : 'text-muted-foreground'}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </Row>

          <Row label="Smooth Caret" desc="Animate cursor movement smoothly">
            <Toggle
              value={settings.smoothCaret}
              onChange={v => updateSettings({ smoothCaret: v })}
            />
          </Row>
        </Section>

        {/* ═══ Typing Experience ═══ */}
        <Section title="Typing Experience" icon={<KeyboardIcon size={14} />}>
          <Row label="Show Line Numbers" desc="Display line numbers in the target code panel">
            <Toggle
              value={settings.showLineNumbers}
              onChange={v => updateSettings({ showLineNumbers: v })}
            />
          </Row>
          <Row label="Typing Feedback" desc="Highlight the textarea border green/red based on error rate">
            <Toggle
              value={settings.typingFeedback}
              onChange={v => updateSettings({ typingFeedback: v })}
            />
          </Row>
          <Row label="Sound Effects" desc="Audio feedback on correct and incorrect keystrokes">
            <Toggle
              value={settings.soundEffects}
              onChange={v => updateSettings({ soundEffects: v })}
            />
          </Row>
          <Row label="Keyboard Heatmap" desc="Show accuracy per key after completing a session">
            <Toggle
              value={settings.showKeyboardHeatmap}
              onChange={v => updateSettings({ showKeyboardHeatmap: v })}
            />
          </Row>
        </Section>

        {/* ═══ AI Generation ═══ */}
        <Section title="AI Generation (Grok)">
          <div className="text-xs text-muted-foreground mb-3">
            Enter your xAI Grok API key to generate custom questions on demand. Get your key at{' '}
            <a href="https://console.x.ai" target="_blank" rel="noreferrer" className="text-primary hover:underline">
              console.x.ai
            </a>
          </div>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={settings.grokApiKey}
              onChange={e => updateSettings({ grokApiKey: e.target.value })}
              placeholder="xai-…"
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary pr-10 font-mono"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showKey ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
            </button>
          </div>
          {settings.grokApiKey && (
            <p className="text-xs text-green-400 mt-1.5 flex items-center gap-1">
              <CheckIcon size={12} />
              API key saved locally — never sent anywhere except xAI.
            </p>
          )}
        </Section>

        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors ${
              saved
                ? 'bg-green-500 text-white'
                : 'bg-primary text-primary-foreground hover:opacity-90'
            }`}
          >
            {saved ? <CheckIcon size={16} /> : null}
            {saved ? 'Saved!' : 'Save Settings'}
          </button>
          <button
            onClick={() => { resetSettings(); }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-sm hover:bg-muted transition-colors text-muted-foreground"
          >
            <RotateCcwIcon size={15} />
            Reset to Defaults
          </button>
        </div>
      </div>
    </div>
  );
};
