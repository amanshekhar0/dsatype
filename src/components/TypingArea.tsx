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
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // Focus textarea when component mounts
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [targetCode]);
  // Handle typing
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    // Start timer on first keypress
    if (!isRunning && !isCompleted) {
      setIsRunning(true);
      setStartTime(new Date());
    }
    setTypedText(value);
    setCurrentIndex(value.length);
  };
  // Handle key down for smart indentation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Only handle Enter key
    if (e.key !== 'Enter') return;
    // Don't process if completed
    if (isCompleted) return;
    // Get current position in typed text
    const currentPosition = typedText.length;
    // Check if we're at the correct position in target code
    // (user should have typed correctly up to this point)
    if (currentPosition >= targetCode.length) return;
    // Check if the next character in target code is actually a newline
    if (targetCode[currentPosition] !== '\n') {
      // If not, prevent default and don't add newline
      e.preventDefault();
      return;
    }
    // Allow the newline to be added (don't prevent default)
    // But we'll add the indentation in the next tick
    // Find the start of the next line after the newline
    const nextLineStart = currentPosition + 1;
    if (nextLineStart >= targetCode.length) return;
    // Count leading whitespace on the next line in target code
    let whitespaceCount = 0;
    for (let i = nextLineStart; i < targetCode.length; i++) {
      const char = targetCode[i];
      if (char === ' ' || char === '\t') {
        whitespaceCount++;
      } else {
        break;
      }
    }
    // If there's indentation, add it after the Enter key is processed
    if (whitespaceCount > 0) {
      // Use setTimeout to add whitespace after the newline is added
      setTimeout(() => {
        const whitespace = targetCode.substring(nextLineStart, nextLineStart + whitespaceCount);
        const newValue = typedText + '\n' + whitespace;
        setTypedText(newValue);
        setCurrentIndex(newValue.length);
      }, 0);
    }
  };
  return <div className="h-full">
    <textarea ref={textareaRef} value={typedText} onChange={handleChange} onKeyDown={handleKeyDown} disabled={isCompleted} className="w-full h-full bg-gray-800 rounded-lg border border-gray-700 p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500" spellCheck="false" autoCorrect="off" autoCapitalize="off" />
  </div>;
};