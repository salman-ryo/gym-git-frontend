import { api } from '@/utils/api';
import { animePowerLevels } from '@/assets/anime';
import { calculateScientificPowerScore, PowerScoreBreakdown } from './scientific-power';
import { GymLog, MonthlyStat, Stats, WeeklyPlan } from './types';

/**
 * Service wrapper for Gym Logs & Analytics.
 * Routes requests strictly to the Go backend via utils/api.ts.
 */

export function mapGymLog(raw: any): GymLog {
  if (!raw) {
    return {
      id: '',
      date: '',
      hours: 0,
      workoutType: 'Custom',
    };
  }

  return {
    id: raw.id || '',
    date: raw.date || '',
    hours: typeof raw.hours === 'number' ? raw.hours : parseFloat(raw.hours || '0'),
    workoutType: raw.workout_type || raw.workoutType || 'Custom',
    notes: raw.notes || undefined,
    updatedAt: raw.updated_at || raw.updatedAt,
  };
}

export async function fetchGymLogs(
  startDate?: string,
  endDate?: string,
  workoutType?: string
): Promise<GymLog[]> {
  const queryParams = new URLSearchParams();
  if (startDate) queryParams.append('startDate', startDate);
  if (endDate) queryParams.append('endDate', endDate);
  if (workoutType && workoutType !== 'All') queryParams.append('workoutType', workoutType);

  const queryString = queryParams.toString();
  const endpoint = `/logs${queryString ? `?${queryString}` : ''}`;

  const rawLogs = await api.get<any[]>(endpoint);
  return (Array.isArray(rawLogs) ? rawLogs : []).map(mapGymLog);
}

export async function saveGymLog(
  date: string,
  hours: number,
  workoutType: string,
  notes?: string
): Promise<GymLog> {
  const payload = {
    date,
    hours,
    workout_type: workoutType,
    notes: notes || undefined,
  };

  const rawLog = await api.post<any>('/logs', payload);
  return mapGymLog(rawLog);
}

export async function deleteGymLog(date: string): Promise<void> {
  await api.delete(`/logs/${date}`);
}

export async function fetchDashboardStats(_userPlan?: WeeklyPlan): Promise<Stats> {
  const [rawStats, logs] = await Promise.all([
    api.get<any>('/stats').catch(() => null),
    fetchGymLogs().catch(() => []),
  ]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentYear = new Date().getFullYear();

  const monthlyMap = new Map<number, { count: number; totalHours: number }>();
  for (let i = 0; i < 12; i++) {
    monthlyMap.set(i, { count: 0, totalHours: 0 });
  }

  logs.forEach((log) => {
    if (!log.date) return;
    const [yStr, mStr] = log.date.split('-');
    const year = parseInt(yStr, 10);
    const monthIdx = parseInt(mStr, 10) - 1;
    if (year === currentYear && monthIdx >= 0 && monthIdx < 12) {
      const existing = monthlyMap.get(monthIdx)!;
      existing.count += 1;
      existing.totalHours += log.hours || 0;
    }
  });

  const monthlyData: MonthlyStat[] = Array.from(monthlyMap.entries()).map(([monthIndex, data]) => ({
    month: monthNames[monthIndex],
    monthIndex,
    year: currentYear,
    count: data.count,
    totalHours: Math.round(data.totalHours * 10) / 10,
  }));

  const streakObj = rawStats?.streak || {};
  const currentStreak = streakObj.current_streak ?? streakObj.currentStreak ?? 0;
  const totalDays = rawStats?.total_sessions ?? rawStats?.totalDays ?? logs.length;
  const totalHours = rawStats?.total_hours ?? rawStats?.totalHours ?? 0;
  const averageHoursPerSession = rawStats?.avg_session_duration ?? rawStats?.averageHoursPerSession ?? 0;

  return {
    currentStreak,
    longestStreak: currentStreak,
    totalDays,
    totalHours: Math.round(totalHours * 10) / 10,
    averageHoursPerSession: Math.round(averageHoursPerSession * 10) / 10,
    monthlyData,
  };
}

export async function fetchPowerScore(
  logs: GymLog[],
  days: number = 30,
  targetWeeklyDays: number = 4
): Promise<PowerScoreBreakdown> {
  try {
    const rawPower = await api.get<any>(`/stats/power?days=${days}`);
    if (rawPower?.power_score) {
      const ps = rawPower.power_score;
      const score = ps.total_score || 0;
      const sortedChars = [...animePowerLevels].sort((a, b) => b.power - a.power);
      const matchedChar = sortedChars.find((c) => score >= c.power) || animePowerLevels[0];

      return {
        consistencyScore: ps.consistency || 0,
        durationQualityScore: ps.duration_quality || 0,
        varietyScore: ps.variety || 0,
        momentumScore: ps.momentum || 0,
        totalScore: score,
        character: matchedChar,
        activeDays: rawPower.active_days || 0,
        totalDays: days,
        avgSessionHours: 0,
        uniqueTypesCount: rawPower.unique_workout_types || 0,
        evaluationText: `Gym Power Score: ${score}/100`,
      };
    }
  } catch {
    // Fall back to client calculation if backend call fails
  }
  return calculateScientificPowerScore(logs, days, targetWeeklyDays);
}
