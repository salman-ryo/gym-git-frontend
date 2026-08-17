'use client';

import { useEffect, useState } from 'react';

export interface UseTypewriterOptions {
  words: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  loop?: boolean;
}

/**
 * Custom hook that animates text with a typewriter effect across multiple words.
 * Avoids cascading synchronous setState calls in useEffect bodies.
 */
export function useTypewriter({
  words,
  typingSpeed = 80,
  deletingSpeed = 45,
  pauseDuration = 1800,
  loop = true,
}: UseTypewriterOptions) {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!words || words.length === 0) return;

    const currentWord = words[wordIndex] || '';
    let timeoutId: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayedText.length < currentWord.length) {
        // Typing next character
        timeoutId = setTimeout(() => {
          setDisplayedText(currentWord.slice(0, displayedText.length + 1));
        }, typingSpeed);
      } else {
        // Finished typing the current word -> wait before deleting
        timeoutId = setTimeout(() => {
          setIsDeleting(true);
        }, pauseDuration);
      }
    } else {
      if (displayedText.length > 0) {
        // Deleting previous character
        timeoutId = setTimeout(() => {
          setDisplayedText(currentWord.slice(0, displayedText.length - 1));
        }, deletingSpeed);
      } else {
        // Finished deleting -> advance to next word asynchronously
        timeoutId = setTimeout(() => {
          setIsDeleting(false);
          setWordIndex((prev) => {
            if (!loop && prev + 1 >= words.length) {
              return prev;
            }
            return (prev + 1) % words.length;
          });
        }, typingSpeed);
      }
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [displayedText, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseDuration, loop]);

  return {
    displayedText,
    wordIndex,
    isDeleting,
    currentWord: words[wordIndex] || '',
  };
}

export default useTypewriter;
