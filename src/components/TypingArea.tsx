import React, { useEffect, useRef } from 'react';
import { useTyping } from '../context/TypingContext';

export const TypingArea = ({
  targetCode
}: {
  targetCode: string;
}) => {
  const {
    typedText,
    setTypedText,
    isRunning,
    setIsRunning,
    setStartTime,
    setCurrentIndex,
    isCompleted,
  } = useTyping();
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Focus textarea when component mounts or target changes
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [targetCode]);

  // Handle typing (normal typing that triggers input change)
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;

    // Start timer on first keypress/input
    if (!isRunning && !isCompleted) {
      setIsRunning(true);
      setStartTime(new Date());
    }

    setTypedText(value);
    // update current index to caret position (end of value)
    setCurrentIndex(value.length);
  };

  // Handle key down for smart indentation (Enter handling)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (isCompleted) return;

    // Only handle Enter key specially
    if (e.key !== 'Enter') return;

    const textarea = textareaRef.current;
    if (!textarea) return;

    const selectionStart = textarea.selectionStart ?? typedText.length;
    const selectionEnd = textarea.selectionEnd ?? selectionStart;

    // If user hasn't typed up to this caret position or we're beyond target, block Enter
    if (selectionStart > targetCode.length) {
      e.preventDefault();
      return;
    }

    // If the character at the caret in targetCode is not a newline, do not allow newline
    if (targetCode[selectionStart] !== '\n') {
      e.preventDefault();
      return;
    }

    // Prevent default (we'll insert newline + indentation ourselves)
    e.preventDefault();

    // Start timer if not already started (enter might be the first action)
    if (!isRunning && !isCompleted) {
      setIsRunning(true);
      setStartTime(new Date());
    }

    // Next line in target starts after the newline
    const nextLineStart = selectionStart + 1;

    // Count leading whitespace in the next line of targetCode
    let whitespaceCount = 0;
    for (let i = nextLineStart; i < targetCode.length; i++) {
      const ch = targetCode[i];
      if (ch === ' ' || ch === '\t') {
        whitespaceCount++;
      } else {
        break;
      }
    }

    const indent = whitespaceCount > 0
      ? targetCode.substring(nextLineStart, nextLineStart + whitespaceCount)
      : '';

    // Build the new value by replacing the current selection with '\n' + indent
    const before = typedText.slice(0, selectionStart);
    const after = typedText.slice(selectionEnd);
    const insertion = '\n' + indent;
    const newValue = before + insertion + after;

    // Update typed text and index
    setTypedText(newValue);
    const newCaretPos = selectionStart + insertion.length;
    setCurrentIndex(newCaretPos);

    // Restore caret position after React updates the value
    // Use setTimeout 0 to wait for the DOM update
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.selectionStart = newCaretPos;
        textareaRef.current.selectionEnd = newCaretPos;
      }
    }, 0);
  };

  return (
    <div className="h-full">
      <textarea
        ref={textareaRef}
        value={typedText}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isCompleted}
        className="w-full h-full bg-card text-foreground rounded-lg border border-border p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
      />
    </div>
  );
};
