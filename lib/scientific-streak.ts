import { GymLog, WeeklyPlan } from './types';
import { formatDateKey } from './date-utils';

export { formatDateKey };

export interface StreakAnalysis {
  currentStreakDays: number;
  longestStreakDays: number;
  complianceRate: number; // 0 - 100%
  currentWeekDone: number; // e.g. 3
  currentWeekTarget: number; // e.g. 4
  currentWeekStatus: 'On Track' | 'Target Met' | 'Behind';
  breakReason?: string;
}

/**
 * Calculates a Scientific, Plan-Conforming Gym Streak.
 * 
 * Scientific Concept:
 * - Scheduled Rest Days DO NOT break your streak as long as you meet your plan's target frequency.
 * - Skipped workouts / missing weekly target (laziness) breaks the streak.
 * 
 * Algorithm:
 * - Uses a sliding 7-day window. In any 7-day period ending on day D:
 *   If active workout days in window >= targetDaysPerWeek (or proportional target), day D is COMPLIANT.
 * - Rest days within a compliant 7-day window maintain the streak seamlessly.
 */
export function calculateScientificStreak(
  logs: GymLog[],
  plan?: WeeklyPlan
): StreakAnalysis {
  // Determine target days per week based on plan
  let targetDaysPerWeek = 4; // Default standard
  if (plan) {
    if (plan.categories) {
      // Exclude 'Rest' or 'Custom' if present, or use length up to 6
      const activeCategories = plan.categories.filter((c) => c.toLowerCase() !== 'rest');
      targetDaysPerWeek = Math.min(6, Math.max(3, activeCategories.length));
    }
  }

  // Create lookup set for active gym days (hours > 0)
  const activeDatesSet = new Set<string>();
  logs.forEach((log) => {
    if (log.hours > 0) {
      activeDatesSet.add(log.date);
    }
  });

  const today = new Date();

  // Helper to count active gym days in a 7-day window ending on checkDate
  const getWindowActiveCount = (endDate: Date): number => {
    let count = 0;
    for (let i = 0; i < 7; i++) {
      const d = new Date(endDate);
      d.setDate(endDate.getDate() - i);
      if (activeDatesSet.has(formatDateKey(d))) {
        count++;
      }
    }
    return count;
  };

  // Helper to check if a specific single date is compliant
  // A date is compliant if:
  // 1. User worked out on that date
  // 2. OR the 7-day window ending on that date met or exceeded the weekly target
  const isDateCompliant = (checkDate: Date): boolean => {
    const dStr = formatDateKey(checkDate);
    if (activeDatesSet.has(dStr)) return true;
    
    // Check if rest day is compliant within rolling window
    const windowCount = getWindowActiveCount(checkDate);
    return windowCount >= Math.max(2, targetDaysPerWeek - 1);
  };

  // 1. CURRENT STREAK CALCULATION
  let currentStreakDays = 0;
  let checkDate = new Date(today);

  // If today hasn't been logged yet, check if yesterday was compliant to allow today to continue
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  if (!isDateCompliant(today) && isDateCompliant(yesterday)) {
    checkDate = yesterday;
  }

  while (isDateCompliant(checkDate)) {
    currentStreakDays++;
    checkDate.setDate(checkDate.getDate() - 1);
    // Safety exit for max history length
    if (currentStreakDays > 365) break;
  }

  // 2. LONGEST STREAK CALCULATION across last 365 days
  let longestStreakDays = 0;
  let tempStreak = 0;
  
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 365);

  const iterDate = new Date(startDate);
  while (iterDate <= today) {
    if (isDateCompliant(iterDate)) {
      tempStreak++;
      if (tempStreak > longestStreakDays) {
        longestStreakDays = tempStreak;
      }
    } else {
      tempStreak = 0;
    }
    iterDate.setDate(iterDate.getDate() + 1);
  }

  // 3. CURRENT WEEK PLAN PROGRESS (Mon - Sun)
  const dayOfWeek = today.getDay(); // 0 = Sun
  const distanceToMon = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const currentMonday = new Date(today);
  currentMonday.setDate(today.getDate() + distanceToMon);

  let currentWeekDone = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date(currentMonday);
    d.setDate(currentMonday.getDate() + i);
    if (d > today) break;
    if (activeDatesSet.has(formatDateKey(d))) {
      currentWeekDone++;
    }
  }

  let currentWeekStatus: 'On Track' | 'Target Met' | 'Behind' = 'On Track';
  if (currentWeekDone >= targetDaysPerWeek) {
    currentWeekStatus = 'Target Met';
  } else if (dayOfWeek >= 5 && currentWeekDone < targetDaysPerWeek - 1) {
    currentWeekStatus = 'Behind';
  }

  // 4. PLAN COMPLIANCE RATE (%)
  let totalTrackedDays = 0;
  let totalCompliantDays = 0;

  const evalDate = new Date(startDate);
  while (evalDate <= today) {
    totalTrackedDays++;
    if (isDateCompliant(evalDate)) {
      totalCompliantDays++;
    }
    evalDate.setDate(evalDate.getDate() + 1);
  }

  const complianceRate = Math.round((totalCompliantDays / Math.max(1, totalTrackedDays)) * 100);

  return {
    currentStreakDays,
    longestStreakDays: Math.max(longestStreakDays, currentStreakDays),
    complianceRate,
    currentWeekDone,
    currentWeekTarget: targetDaysPerWeek,
    currentWeekStatus,
  };
}
