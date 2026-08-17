'use client';

import React, { useEffect, useState } from 'react';

export interface UseAnimatedCounterOptions {
  inView?: boolean;
  duration?: number;
  delay?: number;
  easing?: (t: number) => number;
}

/**
 * Default cubic ease-out function.
 */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Custom hook that animates a numerical value smoothly using requestAnimationFrame.
 */
export function useAnimatedCounter(
  targetValue: number,
  optionsOrDuration: number | UseAnimatedCounterOptions = {}
) {
  const options: UseAnimatedCounterOptions =
    typeof optionsOrDuration === 'number'
      ? { duration: optionsOrDuration, inView: true }
      : { duration: 900, inView: true, delay: 0, ...optionsOrDuration };

  const {
    inView = true,
    duration = 900,
    delay = 0,
    easing = easeOutCubic,
  } = options;

  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    if (!inView || targetValue <= 0) {
      return;
    }

    let animFrame: number;
    const timeoutId = setTimeout(() => {
      const startTime = performance.now();

      const step = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(1, elapsed / duration);
        const easedProgress = easing(progress);
        const currentVal = Math.round(targetValue * easedProgress);

        setCount(currentVal);

        if (progress < 1) {
          animFrame = requestAnimationFrame(step);
        } else {
          setCount(targetValue);
        }
      };

      animFrame = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animFrame);
    };
  }, [targetValue, inView, duration, delay, easing]);

  if (!inView || targetValue <= 0) {
    return 0;
  }

  return count;
}

export interface AnimatedCounterProps {
  value: number;
  inView?: boolean;
  duration?: number;
  delay?: number;
  formatter?: (val: number) => React.ReactNode;
  className?: string;
}

/**
 * Drop-in AnimatedCounter component for rendering smooth numbers.
 */
export function AnimatedCounter({
  value,
  inView = true,
  duration = 900,
  delay = 0,
  formatter,
  className,
}: AnimatedCounterProps) {
  const count = useAnimatedCounter(value, { inView, duration, delay });

  return React.createElement(
    'span',
    { className },
    formatter ? formatter(count) : count
  );
}

export default useAnimatedCounter;
