import { useState } from 'react';
import { ClipboardPasteIcon, XIcon, PlayIcon, CodeIcon } from 'lucide-react';
import { Language } from '../types';

interface PasteCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (code: string, title: string, language?: Language) => void;
}

const LANG_OPTIONS: { label: string; value: Language | 'auto' }[] = [
  { label: '🔍 Auto-detect', value: 'auto' },
  { label: '☕ Java', value: 'Java' },
  { label: '🐍 Python', value: 'Python' },
  { label: '⚡ C++', value: 'C++' },
  { label: '📊 SQL', value: 'SQL' },
];

export const PasteCodeModal = ({ isOpen, onClose, onSubmit }: PasteCodeModalProps) => {
  const [code, setCode] = useState('');
  const [title, setTitle] = useState('');
  const [selectedLang, setSelectedLang] = useState<Language | 'auto'>('auto');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (!code.trim()) return;
    onSubmit(
      code,
      title.trim() || 'Custom Snippet',
      selectedLang === 'auto' ? undefined : selectedLang
    );
    setCode('');
    setTitle('');
    setSelectedLang('auto');
    onClose();
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) setCode(text);
    } catch {
      // Clipboard API not available
    }
  };

  const lineCount = code.split('\n').length;
  const charCount = code.length;

  return (
    <div className="paste-modal-overlay" onClick={onClose}>
      <div className="paste-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <ClipboardPasteIcon size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Paste Your Code</h2>
              <p className="text-xs text-muted-foreground">Paste any code snippet to practice typing it</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Title input */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
              Snippet Title (optional)
            </label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Binary Search, Merge Sort..."
              className="w-full bg-background border border-border rounded-lg px-3 py-2.5 text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Language selector */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block mb-1.5">
              Language
            </label>
            <div className="flex flex-wrap gap-1.5">
              {LANG_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedLang(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    selectedLang === opt.value
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Code textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Code
              </label>
              <button
                onClick={handlePaste}
                className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-medium transition-colors"
              >
                <ClipboardPasteIcon size={12} />
                Paste from clipboard
              </button>
            </div>
            <textarea
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Paste your code here... (Ctrl+V)"
              className="w-full h-64 bg-background border border-border rounded-lg p-4 font-mono text-sm text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary leading-6"
              spellCheck={false}
              autoCorrect="off"
              autoCapitalize="off"
            />
            <div className="flex items-center gap-3 mt-1.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <CodeIcon size={10} />
                {lineCount} lines
              </span>
              <span>{charCount} characters</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 p-5 border-t border-border bg-muted/20">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!code.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <PlayIcon size={14} />
            Start Typing
          </button>
        </div>
      </div>
    </div>
  );
};
