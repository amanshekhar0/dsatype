import { useMemo, useRef, useEffect, useState, useCallback } from 'react';
import { useTyping } from '../context/TypingContext';
import { useSettings } from '../context/SettingsContext';
import { useAlgorithm } from '../context/AlgorithmContext';
import { CopyIcon, CheckIcon } from 'lucide-react';

// ── Syntax token types ────────────────────────────────────────────────────────
type TokenType = 'keyword' | 'string' | 'number' | 'comment' | 'plain';

interface Token {
  text: string;
  type: TokenType;
}

const JAVA_KEYWORDS = new Set([
  'public','private','protected','class','interface','extends','implements',
  'new','return','void','int','long','double','float','boolean','char','byte',
  'short','static','final','abstract','if','else','for','while','do','break',
  'continue','switch','case','default','try','catch','finally','throw','throws',
  'import','package','this','super','null','true','false','instanceof','new',
  'enum','String','List','Map','Set','Queue','Stack','ArrayList','HashMap',
  'HashSet','LinkedList','Arrays','Math','Integer','TreeNode','ListNode',
]);

const CPP_KEYWORDS = new Set([
  'int','long','double','float','bool','char','void','auto','string','vector',
  'list','map','unordered_map','set','unordered_set','stack','queue','pair',
  'struct','class','public','private','protected','static','const','return',
  'if','else','for','while','do','break','continue','switch','case','default',
  'new','delete','nullptr','true','false','include','using','namespace','std',
  'template','typename','sizeof','try','catch','throw',
]);

const PYTHON_KEYWORDS = new Set([
  'def','class','return','if','elif','else','for','while','in','not','and','or',
  'True','False','None','import','from','as','with','try','except','finally',
  'raise','pass','break','continue','lambda','yield','global','nonlocal','del',
  'is','print','len','range','int','str','list','dict','set','tuple','sorted',
  'map','filter','zip','enumerate','reversed','isinstance','type','self',
]);

const SQL_KEYWORDS = new Set([
  'SELECT','FROM','WHERE','JOIN','LEFT','RIGHT','INNER','OUTER','ON','GROUP',
  'BY','ORDER','HAVING','LIMIT','OFFSET','INSERT','INTO','VALUES','UPDATE',
  'SET','DELETE','CREATE','TABLE','INDEX','DROP','ALTER','ADD','COLUMN',
  'PRIMARY','KEY','FOREIGN','REFERENCES','NOT','NULL','UNIQUE','DEFAULT',
  'COUNT','SUM','AVG','MAX','MIN','AS','AND','OR','IN','LIKE','BETWEEN',
  'DISTINCT','CASE','WHEN','THEN','ELSE','END','EXISTS','UNION','ALL',
]);

function getKeywordSet(language: string): Set<string> {
  if (language === 'C++') return CPP_KEYWORDS;
  if (language === 'Python') return PYTHON_KEYWORDS;
  if (language === 'SQL') return SQL_KEYWORDS;
  return JAVA_KEYWORDS; // default / Java
}

function tokenize(code: string, language: string): Token[] {
  if (language === 'Theory') {
    return [{ text: code, type: 'plain' }];
  }
  const keywords = getKeywordSet(language);
  const tokens: Token[] = [];
  let i = 0;

  while (i < code.length) {
    // Single-line comment //
    if (code[i] === '/' && code[i + 1] === '/') {
      let end = i;
      while (end < code.length && code[end] !== '\n') end++;
      tokens.push({ text: code.slice(i, end), type: 'comment' });
      i = end;
      continue;
    }
    // Single-line comment # (Python / SQL)
    if ((language === 'Python' || language === 'SQL') && code[i] === '#') {
      let end = i;
      while (end < code.length && code[end] !== '\n') end++;
      tokens.push({ text: code.slice(i, end), type: 'comment' });
      i = end;
      continue;
    }
    // Block comment /* ... */
    if (code[i] === '/' && code[i + 1] === '*') {
      const end = code.indexOf('*/', i + 2);
      const closeIdx = end === -1 ? code.length : end + 2;
      tokens.push({ text: code.slice(i, closeIdx), type: 'comment' });
      i = closeIdx;
      continue;
    }
    // String literal " or '
    if (code[i] === '"' || code[i] === "'") {
      const quote = code[i];
      let j = i + 1;
      while (j < code.length && code[j] !== quote && code[j] !== '\n') {
        if (code[j] === '\\') j++; // escape
        j++;
      }
      if (j < code.length && code[j] === quote) j++;
      tokens.push({ text: code.slice(i, j), type: 'string' });
      i = j;
      continue;
    }
    // Number
    if (/[0-9]/.test(code[i]) && (i === 0 || !/[a-zA-Z_]/.test(code[i - 1]))) {
      let j = i;
      while (j < code.length && /[0-9._]/.test(code[j])) j++;
      tokens.push({ text: code.slice(i, j), type: 'number' });
      i = j;
      continue;
    }
    // Identifier or keyword
    if (/[a-zA-Z_]/.test(code[i])) {
      let j = i;
      while (j < code.length && /[a-zA-Z0-9_]/.test(code[j])) j++;
      const word = code.slice(i, j);
      // SQL is case-insensitive for keywords
      const isKw = language === 'SQL'
        ? keywords.has(word.toUpperCase())
        : keywords.has(word);
      tokens.push({ text: word, type: isKw ? 'keyword' : 'plain' });
      i = j;
      continue;
    }
    // Plain character
    tokens.push({ text: code[i], type: 'plain' });
    i++;
  }

  return tokens;
}

// Flat char→TokenType array for O(1) lookup
function buildCharTypeMap(code: string, language: string): TokenType[] {
  const tokens = tokenize(code, language);
  const map: TokenType[] = new Array(code.length).fill('plain');
  let pos = 0;
  for (const tok of tokens) {
    for (let k = 0; k < tok.text.length; k++) {
      if (pos + k < map.length) map[pos + k] = tok.type;
    }
    pos += tok.text.length;
  }
  return map;
}

// ── Syntax color helpers ──────────────────────────────────────────────────────
function getSyntaxClass(type: TokenType, isTypewriter: boolean): string {
  if (isTypewriter) {
    switch (type) {
      case 'keyword': return 'text-[#8b4513]'; // saddle brown
      case 'string':  return 'text-[#2d7a3a]'; // dark green
      case 'number':  return 'text-[#a0760a]'; // golden
      case 'comment': return 'text-[#7a6e5a] italic opacity-70';
      default:        return '';
    }
  }
  switch (type) {
    case 'keyword': return 'text-purple-400';
    case 'string':  return 'text-emerald-400';
    case 'number':  return 'text-amber-400';
    case 'comment': return 'text-muted-foreground/60 italic';
    default:        return '';
  }
}

// ── Component ─────────────────────────────────────────────────────────────────
export const TargetCode = ({ code, isFocusMode = false }: { code: string; isFocusMode?: boolean }) => {
  const { typedText, currentIndex } = useTyping();
  const { settings } = useSettings();
  const { language } = useAlgorithm();
  const containerRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const [copied, setCopied] = useState(false);

  const isTypewriter = settings.visualTheme === 'typewriter';

  const lineCount = useMemo(() => code.split('\n').length, [code]);
  const chars = useMemo(() => code.split(''), [code]);

  // Precompute syntax type for every character
  const charTypeMap = useMemo(() => buildCharTypeMap(code, language), [code, language]);

  // Auto-scroll to keep the current line visible
  useEffect(() => {
    if (cursorRef.current && containerRef.current) {
      const cursor = cursorRef.current;
      const container = containerRef.current;
      const cursorRect = cursor.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      if (
        cursorRect.top < containerRect.top + 40 ||
        cursorRect.bottom > containerRect.bottom - 40
      ) {
        cursor.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentIndex]);

  // Compute current line number
  const currentLine = useMemo(() => {
    let line = 0;
    for (let i = 0; i < currentIndex && i < code.length; i++) {
      if (code[i] === '\n') line++;
    }
    return line;
  }, [currentIndex, code]);

  // Copy handler
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [code]);

  const getCharClass = (idx: number, char: string) => {
    let cls = '';
    const tokenType = charTypeMap[idx] ?? 'plain';

    if (isTypewriter) {
      if (idx < typedText.length) {
        if (typedText[idx] === char) {
          cls += 'char-typed ';
        } else {
          cls += 'char-error ';
        }
      } else {
        // Untyped: apply syntax color + ink faded base
        cls += 'char-untyped ';
        const syntaxCls = getSyntaxClass(tokenType, true);
        if (tokenType !== 'plain' && syntaxCls) cls += syntaxCls + ' ';
      }

      if (idx === currentIndex) {
        cls += 'typewriter-cursor-pos ';
      }
    } else {
      cls += 'transition-colors duration-75 ';

      if (idx === currentIndex) {
        if (settings.caretStyle === 'block') {
          cls += 'bg-primary text-primary-foreground rounded-sm ';
        } else if (settings.caretStyle === 'underline') {
          cls += 'border-b-2 border-primary ';
        } else {
          cls += 'border-l-2 border-primary ';
        }
      }

      if (idx < typedText.length) {
        if (typedText[idx] === char) {
          cls += 'text-green-400';
        } else {
          cls += char === '\n'
            ? 'text-red-500/60'
            : 'text-red-400 bg-red-500/20 rounded-sm';
        }
      } else {
        // Untyped: show syntax highlighting
        const syntaxCls = getSyntaxClass(tokenType, false);
        cls += syntaxCls || 'text-muted-foreground/60';
      }
    }

    return cls;
  };

  // Build line number list
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  // Build lines for current-line highlight
  const lines = useMemo(() => {
    const result: { startIdx: number; endIdx: number; lineNum: number }[] = [];
    let start = 0;
    let lineNum = 0;
    for (let i = 0; i <= code.length; i++) {
      if (i === code.length || code[i] === '\n') {
        result.push({ startIdx: start, endIdx: i, lineNum });
        start = i + 1;
        lineNum++;
      }
    }
    return result;
  }, [code]);

  return (
    <div
      ref={containerRef}
      className={`h-full overflow-auto rounded-lg border flex relative ${
        isTypewriter
          ? 'paper-panel paper-torn-edge paper-holes border-border'
          : isFocusMode ? 'bg-transparent border-transparent' : 'bg-card border-border'
      }`}
    >
      {/* Copy button */}
      {!isFocusMode && (
        <button
          onClick={handleCopy}
          title={copied ? 'Copied!' : 'Copy code'}
          className={`absolute top-2 left-2 z-20 flex items-center gap-1 px-2 py-1 rounded text-xs transition-all border ${
            copied
              ? 'bg-green-500/15 border-green-500/30 text-green-400'
              : isTypewriter
                ? 'bg-[var(--card)]/80 border-border text-muted-foreground hover:text-foreground'
                : 'bg-card/80 border-border text-muted-foreground hover:text-foreground backdrop-blur-sm'
          }`}
        >
          {copied ? <CheckIcon size={12} /> : <CopyIcon size={12} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      )}

      {settings.showLineNumbers && !isFocusMode && (
        <div className={`select-none py-4 pr-3 pl-3 text-right font-mono text-xs border-r border-border shrink-0 leading-6 mt-7 ${
          isTypewriter ? 'text-[var(--ink-faded)]' : 'text-muted-foreground/40'
        }`}>
          {lineNumbers.map(n => (
            <div
              key={n}
              className={n - 1 === currentLine ? 'text-primary font-bold' : ''}
            >
              {n}
            </div>
          ))}
        </div>
      )}
      <pre className={`p-4 font-mono text-sm flex-1 leading-7 ${
        isFocusMode
          ? 'whitespace-pre-wrap overflow-hidden flex items-center justify-center break-words'
          : language === 'Theory'
            ? 'whitespace-pre-wrap overflow-y-auto break-words'
            : 'whitespace-pre overflow-x-auto'
      } ${isTypewriter ? 'relative typing-paper-margin' : ''} ${!isFocusMode ? 'pt-8' : ''}`}>
        <div className={isFocusMode ? 'max-w-4xl text-left w-full' : ''}>
        {lines.map((line, lineIdx) => (
          <span
            key={lineIdx}
            className={lineIdx === currentLine ? 'current-line-highlight inline' : ''}
          >
            {chars.slice(line.startIdx, line.endIdx + 1).map((char, charOffset) => {
              const globalIdx = line.startIdx + charOffset;
              const isCursor = globalIdx === currentIndex;

              return (
                <span
                  key={globalIdx}
                  ref={isCursor ? cursorRef : undefined}
                  className={getCharClass(globalIdx, char)}
                >
                  {char}
                </span>
              );
            })}
          </span>
        ))}
        {/* Ghost cursor at end */}
        {currentIndex >= chars.length && (
          <span
            ref={cursorRef}
            className={`inline-block w-0.5 h-4 align-middle ${
              isTypewriter
                ? 'bg-[var(--typewriter-ribbon)] animate-pulse'
                : 'bg-primary animate-pulse'
            }`}
          />
        )}
        </div>
      </pre>
    </div>
  );
};
