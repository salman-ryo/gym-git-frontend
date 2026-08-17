'use client';

import { useEffect, useRef, useState } from 'react';

export interface UseInViewOptions {
  threshold?: number | number[];
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Custom hook that tracks when an element enters or leaves the viewport.
 * Automatically handles SSR and fallback environments without IntersectionObserver.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  optionsOrThreshold: number | UseInViewOptions = 0.15
) {
  const options: UseInViewOptions =
    typeof optionsOrThreshold === 'number'
      ? { threshold: optionsOrThreshold, triggerOnce: true }
      : { threshold: 0.15, triggerOnce: true, ...optionsOrThreshold };

  const { threshold = 0.15, rootMargin, triggerOnce = true } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(() => typeof IntersectionObserver === 'undefined');

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (triggerOnce) {
            observer.disconnect();
          }
        } else if (!triggerOnce) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, inView };
}

export default useInView;
