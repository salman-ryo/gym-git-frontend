import React from 'react';
import { PowerScoreBreakdown } from '@/lib/scientific-power';
import { animePowerLevels, AnimePower } from '@/assets/anime';

export interface MonthlyPowerStat {
  month: string;
  monthIndex: number;
  year: number;
  count: number;
  totalHours: number;
  isCurrentMonth: boolean;
  scoreData: PowerScoreBreakdown;
}

export interface WeeklyPowerStat {
  weekLabel: string;
  count: number;
  totalHours: number;
  isCurrentWeek: boolean;
  scoreData: PowerScoreBreakdown;
}

export const getPowerColorTheme = (score: number, isCurrent: boolean) => {
  if (score === 0) {
    return {
      bar: 'bg-transparent',
      container: 'border-zinc-800/80 group-hover:border-zinc-700',
      text: 'text-zinc-600 group-hover:text-zinc-500 font-bold',
      scoreText: 'text-zinc-600 group-hover:text-zinc-500 mb-1 transition-all',
    };
  }

  if (score < 35) {
    return {
      bar: isCurrent ? 'bg-gradient-to-t from-cyan-600 via-sky-400 to-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.6)]' : 'bg-gradient-to-t from-cyan-900/80 to-sky-700/80 group-hover:from-cyan-600 group-hover:to-sky-400',
      container: isCurrent ? 'border-cyan-400/80 shadow-[0_0_15px_rgba(34,211,238,0.5)] z-10' : 'border-zinc-800/80 group-hover:border-cyan-500/50 group-hover:shadow-[0_0_10px_rgba(34,211,238,0.2)]',
      text: isCurrent ? 'text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] font-bold underline underline-offset-4 decoration-cyan-500/50' : 'text-zinc-500 group-hover:text-cyan-400 font-bold transition-colors',
      scoreText: 'text-[10px] font-black text-zinc-500 mb-1 group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_5px_rgba(34,211,238,0.8)] transition-all'
    };
  }
  if (score < 55) {
    return {
      bar: isCurrent ? 'bg-gradient-to-t from-emerald-600 via-teal-400 to-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.6)]' : 'bg-gradient-to-t from-emerald-900/80 to-teal-700/80 group-hover:from-emerald-600 group-hover:to-teal-400',
      container: isCurrent ? 'border-emerald-400/80 shadow-[0_0_15px_rgba(52,211,153,0.5)] z-10' : 'border-zinc-800/80 group-hover:border-emerald-500/50 group-hover:shadow-[0_0_10px_rgba(52,211,153,0.2)]',
      text: isCurrent ? 'text-emerald-400 drop-shadow-[0_0_5px_rgba(52,211,153,0.8)] font-bold underline underline-offset-4 decoration-emerald-500/50' : 'text-zinc-500 group-hover:text-emerald-400 font-bold transition-colors',
      scoreText: 'text-[10px] font-black text-zinc-500 mb-1 group-hover:text-emerald-400 group-hover:drop-shadow-[0_0_5px_rgba(52,211,153,0.8)] transition-all'
    };
  }
  if (score < 72) {
    return {
      bar: isCurrent ? 'bg-gradient-to-t from-indigo-600 via-violet-400 to-indigo-300 shadow-[0_0_15px_rgba(129,140,248,0.6)]' : 'bg-gradient-to-t from-indigo-900/80 to-violet-700/80 group-hover:from-indigo-600 group-hover:to-violet-400',
      container: isCurrent ? 'border-indigo-400/80 shadow-[0_0_15px_rgba(129,140,248,0.5)] z-10' : 'border-zinc-800/80 group-hover:border-indigo-500/50 group-hover:shadow-[0_0_10px_rgba(129,140,248,0.2)]',
      text: isCurrent ? 'text-indigo-400 drop-shadow-[0_0_5px_rgba(129,140,248,0.8)] font-bold underline underline-offset-4 decoration-indigo-500/50' : 'text-zinc-500 group-hover:text-indigo-400 font-bold transition-colors',
      scoreText: 'text-[10px] font-black text-zinc-500 mb-1 group-hover:text-indigo-400 group-hover:drop-shadow-[0_0_5px_rgba(129,140,248,0.8)] transition-all'
    };
  }
  if (score < 88) {
    return {
      bar: isCurrent ? 'bg-gradient-to-t from-purple-600 via-fuchsia-400 to-purple-300 shadow-[0_0_15px_rgba(192,132,252,0.6)]' : 'bg-gradient-to-t from-purple-900/80 to-fuchsia-700/80 group-hover:from-purple-600 group-hover:to-fuchsia-400',
      container: isCurrent ? 'border-purple-400/80 shadow-[0_0_15px_rgba(192,132,252,0.5)] z-10' : 'border-zinc-800/80 group-hover:border-purple-500/50 group-hover:shadow-[0_0_10px_rgba(192,132,252,0.2)]',
      text: isCurrent ? 'text-purple-400 drop-shadow-[0_0_5px_rgba(192,132,252,0.8)] font-bold underline underline-offset-4 decoration-purple-500/50' : 'text-zinc-500 group-hover:text-purple-400 font-bold transition-colors',
      scoreText: 'text-[10px] font-black text-zinc-500 mb-1 group-hover:text-purple-400 group-hover:drop-shadow-[0_0_5px_rgba(192,132,252,0.8)] transition-all'
    };
  }
  if (score < 97) {
    return {
      bar: isCurrent ? 'bg-gradient-to-t from-rose-600 via-pink-400 to-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.6)]' : 'bg-gradient-to-t from-rose-900/80 to-pink-700/80 group-hover:from-rose-600 group-hover:to-pink-400',
      container: isCurrent ? 'border-rose-400/80 shadow-[0_0_15px_rgba(244,63,94,0.5)] z-10' : 'border-zinc-800/80 group-hover:border-rose-500/50 group-hover:shadow-[0_0_10px_rgba(244,63,94,0.2)]',
      text: isCurrent ? 'text-rose-400 drop-shadow-[0_0_5px_rgba(244,63,94,0.8)] font-bold underline underline-offset-4 decoration-rose-500/50' : 'text-zinc-500 group-hover:text-rose-400 font-bold transition-colors',
      scoreText: 'text-[10px] font-black text-zinc-500 mb-1 group-hover:text-rose-400 group-hover:drop-shadow-[0_0_5px_rgba(244,63,94,0.8)] transition-all'
    };
  }
  return {
    bar: isCurrent ? 'bg-gradient-to-t from-amber-600 via-orange-400 to-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.6)]' : 'bg-gradient-to-t from-amber-900/80 to-orange-700/80 group-hover:from-amber-600 group-hover:to-orange-400',
    container: isCurrent ? 'border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.5)] z-10' : 'border-zinc-800/80 group-hover:border-amber-500/50 group-hover:shadow-[0_0_10px_rgba(245,158,11,0.2)]',
    text: isCurrent ? 'text-amber-400 drop-shadow-[0_0_5px_rgba(245,158,11,0.8)] font-bold underline underline-offset-4 decoration-amber-500/50' : 'text-zinc-500 group-hover:text-amber-400 font-bold transition-colors',
    scoreText: 'text-[10px] font-black text-zinc-500 mb-1 group-hover:text-amber-400 group-hover:drop-shadow-[0_0_5px_rgba(245,158,11,0.8)] transition-all'
  };
};

export function useInView(threshold: number = 0.15) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

interface UseTieredBarAnimationOptions {
  targetScore: number;
  inView: boolean;
  delay?: number;
  stepDuration?: number;
}

export function useTieredBarAnimation({
  targetScore,
  inView,
  delay = 0,
  stepDuration = 380,
}: UseTieredBarAnimationOptions) {
  const [currentScore, setCurrentScore] = React.useState<number>(0);
  const [continuousScore, setContinuousScore] = React.useState<number>(0);
  const [isCompleted, setIsCompleted] = React.useState<boolean>(false);
  const [tierJustChanged, setTierJustChanged] = React.useState<boolean>(false);
  const lastTierIdRef = React.useRef<string>('aqua');

  // Sorted list of tier thresholds
  const sortedTiers = React.useMemo(
    () => [...animePowerLevels].sort((a, b) => a.minPower - b.minPower),
    []
  );

  // Active character based on current animated score
  const currentCharacter: AnimePower = React.useMemo(() => {
    const rev = [...sortedTiers].reverse();
    return rev.find((t) => currentScore >= t.minPower) || sortedTiers[0];
  }, [currentScore, sortedTiers]);

  // Flash / pulse effect when unlocking a new character tier
  React.useEffect(() => {
    if (currentCharacter.id !== lastTierIdRef.current) {
      lastTierIdRef.current = currentCharacter.id;
      setTierJustChanged(true);
      const timer = setTimeout(() => setTierJustChanged(false), 400);
      return () => clearTimeout(timer);
    }
  }, [currentCharacter.id]);

  React.useEffect(() => {
    if (!inView) {
      setCurrentScore(0);
      setContinuousScore(0);
      setIsCompleted(false);
      lastTierIdRef.current = 'aqua';
      return;
    }

    if (targetScore <= 0) {
      setCurrentScore(0);
      setContinuousScore(0);
      setIsCompleted(true);
      return;
    }

    // Build milestone checkpoints: [0, ...intermediate tiers < targetScore, targetScore]
    const milestones: number[] = [0];
    sortedTiers
      .map((t) => t.minPower)
      .filter((p) => p > 0 && p < targetScore)
      .forEach((p) => {
        if (!milestones.includes(p)) milestones.push(p);
      });
    if (!milestones.includes(targetScore)) {
      milestones.push(targetScore);
    }

    const numSegments = milestones.length - 1;
    const totalDuration = numSegments * stepDuration;

    let animFrame: number;
    let timeoutId: NodeJS.Timeout;

    timeoutId = setTimeout(() => {
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;

        if (elapsed >= totalDuration) {
          setCurrentScore(targetScore);
          setContinuousScore(targetScore);
          setIsCompleted(true);
          return;
        }

        // Continuous progress from 0 to 1 across all segments
        const progress = Math.min(1, elapsed / totalDuration);
        const segmentFloat = progress * numSegments;
        const segmentIdx = Math.min(numSegments - 1, Math.floor(segmentFloat));
        const u = segmentFloat - segmentIdx; // 0 to 1 inside current segment

        const startVal = milestones[segmentIdx];
        const endVal = milestones[segmentIdx + 1];

        // Smooth continuous sinusoidal speed wave:
        // Decelerates (slows down gracefully) near tier checkpoints (u ≈ 0 and u ≈ 1),
        // accelerates (speeds up smoothly) in the mid-segment (u ≈ 0.5),
        // with strictly positive velocity (no hard stops or pauses anywhere).
        const alpha = 0.72;
        const waveProgress = u - (alpha / (2 * Math.PI)) * Math.sin(2 * Math.PI * u);
        const scoreFloat = startVal + (endVal - startVal) * waveProgress;

        setCurrentScore(Math.round(scoreFloat));
        setContinuousScore(scoreFloat);
        animFrame = requestAnimationFrame(animate);
      };

      animFrame = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animFrame);
    };
  }, [inView, targetScore, delay, stepDuration, sortedTiers]);

  return {
    currentScore,
    continuousScore,
    currentCharacter,
    isCompleted,
    tierJustChanged,
  };
}

interface AnimatedScoreCounterProps {
  value: number;
  inView: boolean;
  duration?: number;
  delay?: number;
  className?: string;
}

export function AnimatedScoreCounter({
  value,
  inView,
  duration = 900,
  delay = 0,
  className,
}: AnimatedScoreCounterProps) {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    if (!inView) {
      setDisplayValue(0);
      return;
    }

    let startTimeout: NodeJS.Timeout;
    let animFrame: number;

    startTimeout = setTimeout(() => {
      const startTime = performance.now();
      const endValue = value;

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setDisplayValue(Math.round(endValue * easeOut));

        if (progress < 1) {
          animFrame = requestAnimationFrame(step);
        } else {
          setDisplayValue(endValue);
        }
      };

      animFrame = requestAnimationFrame(step);
    }, delay);

    return () => {
      clearTimeout(startTimeout);
      cancelAnimationFrame(animFrame);
    };
  }, [inView, value, duration, delay]);

  return React.createElement('span', { className }, displayValue);
}
