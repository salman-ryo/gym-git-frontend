import { api } from '@/utils/api';
import { PowerScoreBreakdown } from './scientific-power';
import { GymLog, Stats, WeeklyPlan } from './types';

/**
 * Service wrapper for Gym Logs & Analytics.
 * Routes requests strictly to the Go backend via utils/api.ts.
 */

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

  return await api.get<GymLog[]>(endpoint);
}

export async function saveGymLog(
  date: string,
  hours: number,
  workoutType: string,
  notes?: string
): Promise<GymLog> {
  return await api.post<GymLog>('/logs', { date, hours, workoutType, notes });
}

export async function deleteGymLog(date: string): Promise<void> {
  await api.delete(`/logs/${date}`);
}

export async function resetGymData(): Promise<GymLog[]> {
  return await api.post<GymLog[]>('/logs/reset');
}

export async function fetchDashboardStats(_userPlan?: WeeklyPlan): Promise<Stats> {
  return await api.get<Stats>('/stats');
}

export async function fetchPowerScore(
  _logs: GymLog[],
  days: number = 30,
  _targetWeeklyDays: number = 4
): Promise<PowerScoreBreakdown> {
  return await api.get<PowerScoreBreakdown>(`/stats/power?days=${days}`);
}
