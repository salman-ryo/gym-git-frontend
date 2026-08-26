import React from 'react';
import { animePowerLevels, AnimePower } from '@/assets/anime';
import { PowerScoreBreakdown } from '@/lib/scientific-power';

export {
  getPowerColorTheme,
  getTierParticleColors,
  getTierColor,
  getTierName,
  getTierBadgeClass,
} from '@/lib/power-tier-theme';

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

export function useInView(threshold: number = 0.15) {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = React.useState(() => typeof IntersectionObserver === 'undefined');

  React.useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === 'undefined') return;

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
  const safeTargetScore = typeof targetScore === 'number' && !isNaN(targetScore) ? Math.max(0, targetScore) : 0;
  const [currentScore, setCurrentScore] = React.useState<number>(0);
  const [continuousScore, setContinuousScore] = React.useState<number>(0);
  const [isCompleted, setIsCompleted] = React.useState<boolean>(false);
  const [isAnimating, setIsAnimating] = React.useState<boolean>(false);
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
    if (!inView || safeTargetScore <= 0) {
      return;
    }

    // Build milestone checkpoints: [0, ...intermediate tiers < safeTargetScore, safeTargetScore]
    const milestones: number[] = [0];
    sortedTiers
      .map((t) => t.minPower)
      .filter((p) => p > 0 && p < safeTargetScore)
      .forEach((p) => {
        if (!milestones.includes(p)) milestones.push(p);
      });
    if (!milestones.includes(safeTargetScore)) {
      milestones.push(safeTargetScore);
    }

    const numSegments = milestones.length - 1;
    const totalDuration = numSegments * stepDuration;

    let animFrame: number;

    const timeoutId = setTimeout(() => {
      setIsAnimating(true);
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;

        if (elapsed >= totalDuration) {
          setCurrentScore(safeTargetScore);
          setContinuousScore(safeTargetScore);
          setIsCompleted(true);
          setIsAnimating(false);
          return;
        }

        // Continuous progress from 0 to 1 across all segments
        const progress = Math.min(1, elapsed / totalDuration);
        const segmentFloat = progress * numSegments;
        const segmentIdx = Math.min(numSegments - 1, Math.floor(segmentFloat));
        const u = segmentFloat - segmentIdx; // 0 to 1 inside current segment

        const startVal = milestones[segmentIdx];
        const endVal = milestones[segmentIdx + 1];

        // Smooth continuous sinusoidal speed wave
        const alpha = 0.72;
        const waveProgress = u - (alpha / (2 * Math.PI)) * Math.sin(2 * Math.PI * u);
        const scoreFloat = startVal + (endVal - startVal) * waveProgress;

        const rounded = Math.round(scoreFloat);
        setCurrentScore(isNaN(rounded) ? 0 : rounded);
        setContinuousScore(isNaN(scoreFloat) ? 0 : scoreFloat);
        animFrame = requestAnimationFrame(animate);
      };

      animFrame = requestAnimationFrame(animate);
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      cancelAnimationFrame(animFrame);
      setIsAnimating(false);
    };
  }, [inView, safeTargetScore, delay, stepDuration, sortedTiers]);

  const finalScore = isNaN(currentScore) ? 0 : currentScore;
  const finalContinuous = isNaN(continuousScore) ? 0 : continuousScore;

  return {
    currentScore: inView ? finalScore : 0,
    continuousScore: inView ? finalContinuous : 0,
    currentCharacter,
    isCompleted: inView ? isCompleted : false,
    isAnimating: inView ? isAnimating : false,
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
  const safeValue = typeof value === 'number' && !isNaN(value) ? value : 0;
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    if (!inView) {
      return;
    }

    let animFrame: number;

    const startTimeout = setTimeout(() => {
      const startTime = performance.now();
      const endValue = safeValue;

      const step = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const computed = Math.round(endValue * easeOut);
        setDisplayValue(isNaN(computed) ? 0 : computed);

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
  }, [inView, safeValue, duration, delay]);

  const outputValue = isNaN(displayValue) ? 0 : displayValue;
  return React.createElement('span', { className }, inView ? outputValue : 0);
}
