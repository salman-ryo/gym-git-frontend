import { api } from '@/utils/api';
import { animePowerLevels } from '@/assets/anime';
import { calculateScientificPowerScore, PowerScoreBreakdown } from './scientific-power';
import { GymLog, MonthlyStat, Stats, WeeklyPlan, UserStreak, RawStreakResponse, RawStatsResponse } from './types';

export interface RawGymLog {
  id?: string;
  date?: string;
  hours?: number | string;
  workout_type?: string;
  workoutType?: string;
  notes?: string;
  updated_at?: string;
  updatedAt?: string;
}

export interface RawPowerScoreResponse {
  power_score?: {
    total_score?: number;
    consistency?: number;
    duration_quality?: number;
    variety?: number;
    momentum?: number;
  };
  active_days?: number;
  unique_workout_types?: number;
}

/**
 * Service wrapper for Gym Logs & Analytics.
 * Routes requests strictly to the Go backend via utils/api.ts.
 */

export function mapGymLog(raw: RawGymLog | null | undefined): GymLog {
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

  const rawLogs = await api.get<RawGymLog[]>(endpoint);
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

  const rawLog = await api.post<RawGymLog>('/logs', payload);
  return mapGymLog(rawLog);
}

export async function deleteGymLog(date: string): Promise<void> {
  await api.delete(`/logs/${date}`);
}

export async function fetchDashboardStats(userPlan?: WeeklyPlan): Promise<Stats> {
  void userPlan;
  const [rawStats, rawStreak, logs] = await Promise.all([
    api.get<RawStatsResponse>('/stats').catch(() => null),
    api.get<RawStreakResponse>('/streak').catch(() => null),
    fetchGymLogs().catch(() => []),
  ]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonthIdx = today.getMonth();

  const dynamicMonthlyData: MonthlyStat[] = [];

  for (let i = 11; i >= 0; i--) {
    const targetDate = new Date(currentYear, currentMonthIdx - i, 1);
    const mYear = targetDate.getFullYear();
    const mIdx = targetDate.getMonth();
    const mName = monthNames[mIdx];

    const monthLogs = logs.filter((l) => {
      const parts = l.date.split('-');
      return parseInt(parts[0], 10) === mYear && parseInt(parts[1], 10) === (mIdx + 1);
    });

    const activeDays = monthLogs.length;
    const hours = monthLogs.reduce((acc, l) => acc + l.hours, 0);

    dynamicMonthlyData.push({
      month: mName,
      monthIndex: mIdx,
      year: mYear,
      count: activeDays,
      totalHours: Math.round(hours * 10) / 10,
    });
  }

  const totalLogsCount = logs.length;
  const totalHoursCount = logs.reduce((acc, l) => acc + l.hours, 0);

  // Compute 7-day rolling attendance
  const past7Days = Array.from({ length: 7 }, (_, idx) => {
    const d = new Date();
    d.setDate(d.getDate() - idx);
    return d.toISOString().split('T')[0];
  });

  let compliantDaysInCycle = 0;
  past7Days.forEach((dateStr) => {
    const logForDay = logs.find((l) => l.date === dateStr);
    if (logForDay) {
      compliantDaysInCycle++;
    }
  });

  const rawSplitAccuracy = Math.round((compliantDaysInCycle / 7) * 100);

  const streakEvent = rawStreak?.streak_broken_event || rawStats?.streak_broken_event;
  const warningEvent = rawStreak?.streak_warning_event || rawStats?.streak_warning_event;

  return {
    currentStreak: rawStreak?.current_streak ?? rawStreak?.currentStreak ?? rawStats?.current_streak ?? rawStats?.currentStreak ?? 0,
    longestStreak: rawStreak?.longest_streak ?? rawStreak?.longestStreak ?? rawStats?.longest_streak ?? rawStats?.longestStreak ?? 0,
    totalDays: rawStats?.totalDays ?? rawStats?.total_sessions ?? totalLogsCount,
    totalHours: rawStats?.totalHours ?? rawStats?.total_hours ?? Math.round(totalHoursCount * 10) / 10,
    averageHoursPerSession: rawStats?.averageHoursPerSession ?? rawStats?.avg_session_duration ?? (totalLogsCount > 0 ? Number((totalHoursCount / totalLogsCount).toFixed(1)) : 0),
    monthlyData: dynamicMonthlyData,
    cycleInfo: rawStreak?.cycle_info || rawStats?.cycle_info,
    accuracyScore: rawStreak?.accuracy_score ?? rawStreak?.accuracyScore ?? rawStats?.accuracy_score ?? rawStats?.accuracyScore ?? rawSplitAccuracy,
    isFrozen: rawStreak?.is_frozen ?? rawStreak?.isFrozen ?? rawStats?.is_frozen ?? rawStats?.isFrozen ?? false,
    streakBrokenEvent: streakEvent ? {
      previous_streak: streakEvent.previous_streak,
      last_streak_date: streakEvent.last_streak_date,
      broken_on: streakEvent.broken_on,
      missed_days_count: streakEvent.missed_days_count,
      required_shields: streakEvent.required_shields,
      restore_shield_available: streakEvent.restore_shield_available,
      restore_shields_count: streakEvent.restore_shields_count,
      missed_dates: streakEvent.missed_dates,
      can_restore_until: streakEvent.can_restore_until,
    } : null,
    streakWarningEvent: warningEvent ? {
      is_at_risk: warningEvent.is_at_risk,
      hours_remaining: warningEvent.hours_remaining,
      rest_tokens_left: warningEvent.rest_tokens_left,
      message: warningEvent.message,
    } : null,
  };
}

export function mapUserStreak(s: RawStreakResponse): UserStreak {
  return {
    currentStreak: s.current_streak ?? s.currentStreak ?? 0,
    longestStreak: s.longest_streak ?? s.longestStreak ?? 0,
    complianceRate: s.compliance_rate ?? s.complianceRate ?? 0,
    cycleInfo: s.cycle_info,
    accuracyScore: s.accuracy_score ?? s.accuracyScore ?? 0,
    isFrozen: s.is_frozen ?? s.isFrozen ?? false,
    streakBrokenEvent: s.streak_broken_event ? {
      previous_streak: s.streak_broken_event.previous_streak,
      last_streak_date: s.streak_broken_event.last_streak_date,
      broken_on: s.streak_broken_event.broken_on,
      missed_days_count: s.streak_broken_event.missed_days_count,
      required_shields: s.streak_broken_event.required_shields,
      restore_shield_available: s.streak_broken_event.restore_shield_available,
      restore_shields_count: s.streak_broken_event.restore_shields_count,
      missed_dates: s.streak_broken_event.missed_dates,
      can_restore_until: s.streak_broken_event.can_restore_until,
    } : null,
    streakWarningEvent: s.streak_warning_event ? {
      is_at_risk: s.streak_warning_event.is_at_risk,
      hours_remaining: s.streak_warning_event.hours_remaining,
      rest_tokens_left: s.streak_warning_event.rest_tokens_left,
      message: s.streak_warning_event.message,
    } : null,
  };
}

export async function fetchPowerScore(
  logs: GymLog[],
  days: number = 30,
  targetWeeklyDays: number = 4
): Promise<PowerScoreBreakdown> {
  try {
    const rawPower = await api.get<RawPowerScoreResponse>(`/stats/power?days=${days}`);
    if (rawPower?.power_score) {
      const ps = rawPower.power_score;
      const score = ps.total_score || 0;
      const sortedChars = [...animePowerLevels].sort((a, b) => b.minPower - a.minPower);
      const matchedChar = sortedChars.find((c) => score >= c.minPower) || animePowerLevels[0];

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
