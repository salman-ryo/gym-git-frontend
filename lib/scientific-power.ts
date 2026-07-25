import { AnimePower, animePowerLevels } from '@/assets/anime';
import { GymLog } from './types';

export interface PowerScoreBreakdown {
  consistencyScore: number; // 0 - 45
  durationQualityScore: number; // 0 - 25
  varietyScore: number; // 0 - 20
  momentumScore: number; // 0 - 10
  totalScore: number; // 0 - 100
  character: AnimePower;
  activeDays: number;
  totalDays: number;
  avgSessionHours: number;
  uniqueTypesCount: number;
  evaluationText: string;
}

/**
 * Calculates a scientific Gym Power Score (0 - 100) for a given set of days & logs.
 * 
 * Philosophy:
 * 1. Consistency (45%): Rewards regular attendance (e.g. 4-5 days/week). 5 days @ 45m > 1 day @ 4h.
 * 2. Session Quality / Duration (25%): 45m - 90m (0.75h - 1.5h) is optimal. Overlong binge sessions (>3h) have diminishing returns.
 * 3. Split Variety (20%): Rewards training multiple body parts / workout types (Push, Pull, Legs, etc.).
 * 4. Momentum (10%): Rewards active attendance sequences.
 */
export function calculateScientificPowerScore(
  logs: GymLog[],
  periodTotalDays: number,
  targetWeeklyDays: number = 4
): PowerScoreBreakdown {
  const activeLogMap = new Map<string, GymLog>();
  const workoutTypesSet = new Set<string>();
  let totalHours = 0;

  logs.forEach((log) => {
    if (log.hours > 0) {
      activeLogMap.set(log.date, log);
      workoutTypesSet.add(log.workoutType);
      totalHours += log.hours;
    }
  });

  const activeDays = activeLogMap.size;
  const totalDays = Math.max(periodTotalDays, 1);

  // 1. CONSISTENCY SCORE (0 - 45 Points)
  // Target ratio: expected active days in period based on target (e.g. 4 days out of 7 = 57% active)
  const targetActiveDays = Math.max(1, Math.round((targetWeeklyDays / 7) * totalDays));
  const consistencyRatio = Math.min(1.0, activeDays / targetActiveDays);
  const consistencyScore = Math.round(consistencyRatio * 45);

  // 2. DURATION QUALITY SCORE (0 - 25 Points)
  // Scientific sweet spot: 0.75h to 1.75h per workout
  let totalQualityScore = 0;
  if (activeDays > 0) {
    activeLogMap.forEach((log) => {
      const h = log.hours;
      let sessionQuality = 0;
      if (h >= 0.75 && h <= 1.75) {
        sessionQuality = 1.0; // 100% optimal
      } else if (h > 1.75) {
        // Diminishing returns for over-long sessions (>3h overtraining penalty)
        sessionQuality = Math.max(0.4, 1.0 - (h - 1.75) * 0.25);
      } else {
        // Under 45 mins gets partial points
        sessionQuality = Math.max(0.2, h / 0.75);
      }
      totalQualityScore += sessionQuality;
    });
  }
  const avgSessionQuality = activeDays > 0 ? totalQualityScore / activeDays : 0;
  const durationQualityScore = Math.round(avgSessionQuality * 25);

  // 3. VARIETY SCORE (0 - 20 Points)
  // Reward training at least 3 distinct workout types
  const uniqueTypesCount = workoutTypesSet.size;
  const varietyRatio = Math.min(1.0, uniqueTypesCount / 3);
  const varietyScore = Math.round(varietyRatio * 20);

  // 4. MOMENTUM SCORE (0 - 10 Points)
  // Higher ratio of attendance gives full momentum
  const momentumRatio = activeDays > 0 ? Math.min(1.0, activeDays / (totalDays * 0.5)) : 0;
  const momentumScore = Math.round(momentumRatio * 10);

  // TOTAL SCIENTIFIC POWER SCORE (0 - 100)
  const rawTotal = consistencyScore + durationQualityScore + varietyScore + momentumScore;
  const totalScore = activeDays > 0 ? Math.min(100, Math.max(5, rawTotal)) : 0;

  // MAP TO ANIME CHARACTER TIER
  // Sort characters by power descending to find the appropriate tier
  const sortedChars = [...animePowerLevels].sort((a, b) => b.power - a.power);
  let character: AnimePower = animePowerLevels[0]; // default Aqua

  if (totalScore > 0) {
    const matched = sortedChars.find((c) => totalScore >= c.power);
    character = matched || sortedChars[sortedChars.length - 1];
  } else {
    character = animePowerLevels[0];
  }

  // EVALUATION DIAGNOSTIC SUMMARY
  const avgSessionHours = activeDays > 0 ? Number((totalHours / activeDays).toFixed(1)) : 0;
  let evaluationText = 'No gym attendance recorded yet.';
  if (activeDays > 0) {
    if (consistencyScore >= 40 && durationQualityScore >= 20) {
      evaluationText = 'Ultra Instinct consistency! Perfect session duration and frequency.';
    } else if (consistencyScore >= 30) {
      evaluationText = 'High discipline! Consistent workout schedule with solid muscle balance.';
    } else if (durationQualityScore < 15 && totalHours > 10) {
      evaluationText = 'Warning: Overlong single sessions! Consistency matters more than binge workouts.';
    } else {
      evaluationText = 'Building fitness habits. Increase weekly frequency for higher power tiers!';
    }
  }

  return {
    consistencyScore,
    durationQualityScore,
    varietyScore,
    momentumScore,
    totalScore,
    character,
    activeDays,
    totalDays,
    avgSessionHours,
    uniqueTypesCount,
    evaluationText,
  };
}
