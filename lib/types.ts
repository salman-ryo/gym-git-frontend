export type WorkoutType = 'Push' | 'Pull' | 'Legs' | 'Cardio' | 'Custom';

export interface GymLog {
  id: string;
  date: string; // Format: YYYY-MM-DD
  hours: number;
  workoutType: WorkoutType;
  notes?: string;
  updatedAt?: string;
}

export interface User {
  email: string;
  name: string;
  avatarUrl?: string;
  provider: 'email' | 'google';
}

export interface MonthlyStat {
  month: string; // e.g. 'Jan', 'Feb'
  monthIndex: number; // 0..11
  year: number;
  count: number;
  totalHours: number;
}

export interface Stats {
  currentStreak: number;
  longestStreak: number;
  totalDays: number;
  totalHours: number;
  averageHoursPerSession: number;
  monthlyData: MonthlyStat[];
}

export interface FilterOptions {
  workoutType: WorkoutType | 'All';
}
