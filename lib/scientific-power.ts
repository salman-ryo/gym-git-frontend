import { AnimePower, animePowerLevels } from "@/assets/anime";
import { GymLog } from "./types";

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
 * Calculates a scientific Gym Power Score (0 - 100).
 *
 * Philosophy
 * ----------
 * 1. Consistency (45%)
 *    Reward showing up consistently. Several moderate workouts beat one marathon session.
 *
 * 2. Session Quality (25%)
 *    The sweet spot is roughly 45-105 minutes. Longer sessions have diminishing returns.
 *
 * 3. Variety (20%)
 *    Reward training different workout splits/body parts.
 *
 * 4. Momentum (10%)
 *    Reward maintaining regular attendance throughout the period.
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

  // ---------------------------------------------------------------------------
  // 1. CONSISTENCY (0 - 45)
  // ---------------------------------------------------------------------------

  const targetActiveDays = Math.max(
    1,
    Math.round((targetWeeklyDays / 7) * totalDays)
  );

  const consistencyRatio = Math.min(1, activeDays / targetActiveDays);
  const consistencyScore = Math.round(consistencyRatio * 45);

  // ---------------------------------------------------------------------------
  // 2. SESSION QUALITY (0 - 25)
  // ---------------------------------------------------------------------------

  let totalQualityScore = 0;

  if (activeDays > 0) {
    activeLogMap.forEach((log) => {
      const h = log.hours;
      let quality = 0;

      if (h >= 0.75 && h <= 1.75) {
        quality = 1;
      } else if (h > 1.75) {
        quality = Math.max(0.4, 1 - (h - 1.75) * 0.25);
      } else {
        quality = Math.max(0.2, h / 0.75);
      }

      totalQualityScore += quality;
    });
  }

  const avgSessionQuality =
    activeDays > 0 ? totalQualityScore / activeDays : 0;

  const durationQualityScore = Math.round(avgSessionQuality * 25);

  // ---------------------------------------------------------------------------
  // 3. VARIETY (0 - 20)
  // ---------------------------------------------------------------------------

  const uniqueTypesCount = workoutTypesSet.size;
  const varietyRatio = Math.min(1, uniqueTypesCount / 3);
  const varietyScore = Math.round(varietyRatio * 20);

  // ---------------------------------------------------------------------------
  // 4. MOMENTUM (0 - 10)
  // ---------------------------------------------------------------------------

  const momentumRatio =
    activeDays > 0
      ? Math.min(1, activeDays / (totalDays * 0.5))
      : 0;

  const momentumScore = Math.round(momentumRatio * 10);

  // ---------------------------------------------------------------------------
  // FINAL SCORE (0 - 100)
  // ---------------------------------------------------------------------------

  const rawTotal =
    consistencyScore +
    durationQualityScore +
    varietyScore +
    momentumScore;

  const totalScore =
    activeDays > 0
      ? Math.min(100, Math.max(5, rawTotal))
      : 0;

  // ---------------------------------------------------------------------------
  // CHARACTER TIER
  // ---------------------------------------------------------------------------

  const sortedCharacters = [...animePowerLevels].sort(
    (a, b) => b.minPower - a.minPower
  );

  const character =
    sortedCharacters.find((tier) => totalScore >= tier.minPower) ??
    animePowerLevels[0];

  // ---------------------------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------------------------

  const avgSessionHours =
    activeDays > 0
      ? Number((totalHours / activeDays).toFixed(1))
      : 0;

  let evaluationText = "No gym attendance recorded yet.";

  if (activeDays > 0) {
    if (consistencyScore >= 40 && durationQualityScore >= 20) {
      evaluationText =
        "Ultra Instinct consistency! Perfect session duration and workout frequency.";
    } else if (consistencyScore >= 30) {
      evaluationText =
        "Excellent discipline! You're building strength through consistent training.";
    } else if (durationQualityScore < 15 && totalHours > 10) {
      evaluationText =
        "You're spending a lot of time in the gym, but consistency beats marathon sessions.";
    } else {
      evaluationText =
        "Solid foundation. Increase your weekly consistency to unlock higher power tiers.";
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