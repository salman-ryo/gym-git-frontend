import { GymLog, MonthlyStat, Stats, WeeklyPlan, WorkoutType } from './types';
import { formatDateKey } from './scientific-streak';
import { calculateScientificPowerScore } from './scientific-power';
import { saveGymLog } from './gym-service';

export const MOCK_WORKOUT_TYPES: { type: string; minHours: number; maxHours: number; notes: string[] }[] = [
  {
    type: 'Push',
    minHours: 0.9,
    maxHours: 1.6,
    notes: [
      'Heavy Bench Press 100kg 5x5 + Incline DB Press',
      'Overhead Press 65kg + Lateral raises superset',
      'Chest dips + Cable flys pump',
      'Close-grip bench + Skull crushers',
      'Push Day hypertrophy focus',
    ],
  },
  {
    type: 'Pull',
    minHours: 1.0,
    maxHours: 1.7,
    notes: [
      'Deadlift 180kg 3x3 + Weighted Pull-ups (+20kg)',
      'Barbell Rows 90kg + Lat Pulldowns',
      'Chest-supported T-bar rows + Face pulls',
      'Incline DB curls + Hammer curls pump',
      'Back & Biceps volume session',
    ],
  },
  {
    type: 'Legs',
    minHours: 1.1,
    maxHours: 1.8,
    notes: [
      'Barbell Squats 140kg 4x5 + Bulgarian Split Squats',
      'Romanian Deadlifts 130kg + Leg Press 300kg',
      'Hamstring curls + Quad extensions burnout',
      'Calf raises + Walking lunges',
      'Heavy Quad & Glute focus',
    ],
  },
  {
    type: 'Core',
    minHours: 0.6,
    maxHours: 1.1,
    notes: [
      'Hanging leg raises + Ab wheel rollout 4x15',
      'Cable crunches + Planks circuit',
      'Dragon flags + Russian twists',
      'Core stability & anti-rotation training',
    ],
  },
  {
    type: 'Cardio',
    minHours: 0.7,
    maxHours: 1.4,
    notes: [
      '5km Zone 2 aerobic base run (24:30)',
      'HIIT sprint intervals on Assault Bike (10 rounds)',
      '10km steady endurance run',
      'Rowing machine 5000m tempo work',
      'Stairmaster 45 min interval climbing',
    ],
  },
  {
    type: 'Upper Body',
    minHours: 1.0,
    maxHours: 1.7,
    notes: [
      'Incline bench + Weighted chin-ups',
      'Seated DB shoulder press + Cable rows',
      'Arms & Shoulders superset focus',
    ],
  },
  {
    type: 'Lower Body',
    minHours: 1.0,
    maxHours: 1.75,
    notes: [
      'Front Squats 110kg + Glute ham raises',
      'Hack squats + Stiff leg deadlifts',
      'Unilateral leg training & mobility',
    ],
  },
];

/**
 * Generates ~290–320 realistic workout logs across the past 365 days.
 * Every session duration is strictly less than 2 hours (<2.0h, typically 0.8h - 1.8h).
 */
export function generate365MockLogs(daysCount = 365): GymLog[] {
  const logs: GymLog[] = [];
  const today = new Date();

  // Seeded random helper for deterministic yet organic feel
  let seed = 42;
  function seededRandom() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  }

  for (let i = daysCount - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = formatDateKey(d);

    const dayOfWeek = d.getDay(); // 0 is Sunday, 6 is Saturday

    // Realistic lifter schedule: ~5-6 days active per week, rest on occasional Sun/Wed
    const isRestDay = (dayOfWeek === 0 && seededRandom() < 0.45) || (dayOfWeek === 3 && seededRandom() < 0.35);

    if (isRestDay) {
      continue; // Rest day (empty or skipped on graph)
    }

    // Select workout category based on rotation & randomness
    const categoryIdx = Math.floor(seededRandom() * MOCK_WORKOUT_TYPES.length);
    const categoryConfig = MOCK_WORKOUT_TYPES[categoryIdx];

    // Duration strictly less than 2 hours (0.8h - 1.8h)
    const rawHours = categoryConfig.minHours + seededRandom() * (categoryConfig.maxHours - categoryConfig.minHours);
    const hours = Math.min(1.9, Math.round(rawHours * 10) / 10);

    const noteIdx = Math.floor(seededRandom() * categoryConfig.notes.length);
    const notes = categoryConfig.notes[noteIdx];

    logs.push({
      id: `mock-log-${dateStr}`,
      date: dateStr,
      hours,
      workoutType: categoryConfig.type,
      notes,
      updatedAt: new Date(d.getTime() + 18 * 3600 * 1000).toISOString(),
    });
  }

  return logs;
}

/**
 * Calculates comprehensive stats and monthly breakdown for the mock dataset.
 */
export function generateMockStats(logs: GymLog[], userPlan?: WeeklyPlan): Stats {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonthIdx = today.getMonth();

  // Oldest date
  let oldestDate = new Date();
  oldestDate.setDate(today.getDate() - 365);

  const startYear = oldestDate.getFullYear();
  const startMonthIdx = oldestDate.getMonth();

  const monthlyData: MonthlyStat[] = [];
  let tempYear = startYear;
  let tempMonthIdx = startMonthIdx;

  while (tempYear < currentYear || (tempYear === currentYear && tempMonthIdx <= 11)) {
    let count = 0;
    let totalHours = 0;

    logs.forEach((log) => {
      if (!log.date) return;
      const [yStr, mStr] = log.date.split('-');
      const year = parseInt(yStr, 10);
      const monthIdx = parseInt(mStr, 10) - 1;
      if (year === tempYear && monthIdx === tempMonthIdx) {
        count += 1;
        totalHours += log.hours || 0;
      }
    });

    monthlyData.push({
      month: monthNames[tempMonthIdx],
      monthIndex: tempMonthIdx,
      year: tempYear,
      count,
      totalHours: Math.round(totalHours * 10) / 10,
    });

    tempMonthIdx++;
    if (tempMonthIdx > 11) {
      tempMonthIdx = 0;
      tempYear++;
    }
  }

  let totalHours = 0;
  logs.forEach((l) => {
    totalHours += l.hours || 0;
  });

  const totalDays = logs.length;
  const averageHoursPerSession = totalDays > 0 ? totalHours / totalDays : 0;

  // Compute realistic streak (e.g. current streak = 42 days, longest streak = 85 days)
  const currentStreak = Math.min(64, Math.max(28, Math.round(totalDays * 0.18)));
  const longestStreak = Math.min(120, Math.max(currentStreak, Math.round(totalDays * 0.32)));

  return {
    currentStreak,
    longestStreak,
    totalDays,
    totalHours: Math.round(totalHours * 10) / 10,
    averageHoursPerSession: Math.round(averageHoursPerSession * 10) / 10,
    monthlyData,
  };
}

/**
 * Seeding utility to persist mock logs to the backend API.
 */
export async function seedMockLogsToBackend(onProgress?: (current: number, total: number) => void): Promise<number> {
  const mockLogs = generate365MockLogs(365);
  let savedCount = 0;

  for (let i = 0; i < mockLogs.length; i++) {
    const log = mockLogs[i];
    try {
      await saveGymLog(log.date, log.hours, log.workoutType, log.notes);
      savedCount++;
      if (onProgress) {
        onProgress(savedCount, mockLogs.length);
      }
    } catch (err) {
      console.warn(`Failed to seed log for ${log.date}`, err);
    }
  }

  return savedCount;
}
