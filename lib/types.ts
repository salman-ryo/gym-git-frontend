import { StreakAnalysis } from './scientific-streak';

export type WorkoutType = string;

export interface WeeklyPlan {
  id: string;
  name: string;
  description?: string;
  categories: string[]; // e.g. ['Push', 'Pull', 'Legs', 'Core', 'Cardio']
}

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
  weeklyPlan?: WeeklyPlan;
  streak?: UserStreak;
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
  scientificStreak?: StreakAnalysis;
  cycleInfo?: CycleInfo;
  accuracyScore?: number;
  isFrozen?: boolean;
  streakBrokenEvent?: StreakBrokenEvent | null;
  streakWarningEvent?: StreakWarningEvent | null;
}

export interface CycleInfo {
  cycle_start_date: string;
  cycle_end_date: string;
  workouts_completed_in_cycle: number;
  workouts_target_in_cycle: number;
  rest_tokens_total: number;
  rest_tokens_used: number;
  rest_tokens_remaining: number;
  days_remaining_in_cycle: number;
}

export interface StreakBrokenEvent {
  previous_streak: number;
  broken_on: string;
  restore_shield_available: boolean;
  restore_shields_count: number;
  can_restore_until: string;
}

export interface StreakWarningEvent {
  is_at_risk: boolean;
  hours_remaining: number;
  rest_tokens_left: number;
  message: string;
}

export interface ItemCatalogItem {
  item_id: 'RESTORE_SHIELD' | 'STREAK_FREEZE_TOKEN' | 'XP_BOOST' | 'ACCURACY_CHARM';
  name: string;
  effect_type: 'INSTANT_USE' | 'TIME_BASED';
  duration_seconds: number;
  description: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  icon: string;
}

export interface UserInventoryItem {
  item_id: string;
  quantity: number;
  item_details: ItemCatalogItem;
}

export interface ActiveItemEffect {
  item_id: string;
  activated_at: string;
  expires_at: string;
  remaining_seconds: number;
}

export interface RoadmapMilestone {
  milestone_id: string;
  plan_id: string;
  streak_target: number;
  item_id: string;
  item_name: string;
  item_icon: string;
  rarity: string;
  quantity: number;
  title: string;
  description: string;
  badge_slug: string;
  status: 'LOCKED' | 'CLAIMABLE' | 'CLAIMED';
  claimed_at?: string;
}

export interface UserStreak {
  currentStreak: number;
  longestStreak: number;
  complianceRate: number;
  cycleInfo?: CycleInfo;
  accuracyScore: number;
  isFrozen: boolean;
  streakBrokenEvent?: StreakBrokenEvent | null;
  streakWarningEvent?: StreakWarningEvent | null;
}

export interface RawStreakResponse {
  current_streak?: number;
  currentStreak?: number;
  longest_streak?: number;
  longestStreak?: number;
  compliance_rate?: number;
  complianceRate?: number;
  cycle_info?: {
    cycle_start_date: string;
    cycle_end_date: string;
    workouts_completed_in_cycle: number;
    workouts_target_in_cycle: number;
    rest_tokens_total: number;
    rest_tokens_used: number;
    rest_tokens_remaining: number;
    days_remaining_in_cycle: number;
  };
  accuracy_score?: number;
  accuracyScore?: number;
  is_frozen?: boolean;
  isFrozen?: boolean;
  streak_broken_event?: {
    previous_streak: number;
    broken_on: string;
    restore_shield_available: boolean;
    restore_shields_count: number;
    can_restore_until: string;
  };
  streak_warning_event?: {
    is_at_risk: boolean;
    hours_remaining: number;
    rest_tokens_left: number;
    message: string;
  };
  streak?: RawStreakResponse;
}

export interface RawAuthMeResponse {
  user?: {
    email?: string;
    name?: string;
    avatar_url?: string;
    avatarUrl?: string;
    provider?: 'email' | 'google';
    weeklyPlan?: WeeklyPlan;
    weekly_plan_id?: string;
    queued_weekly_plan_id?: string | null;
    timezone?: string;
  };
  plan?: WeeklyPlan;
  streak?: RawStreakResponse;
  email?: string;
  name?: string;
  avatar_url?: string;
  avatarUrl?: string;
  provider?: 'email' | 'google';
  weeklyPlan?: WeeklyPlan;
}

export interface FilterOptions {
  workoutType: WorkoutType | 'All';
}

export type TimeframeView = 'year' | 'month' | 'week';

export const PREBUILT_PLANS: WeeklyPlan[] = [
  {
    id: 'ppl-standard',
    name: 'Push / Pull / Legs (PPL)',
    description: 'Classic 4-day active split focusing on movement patterns.',
    categories: ['Push', 'Pull', 'Legs', 'Cardio', 'Custom'],
  },
  {
    id: 'ppl-core',
    name: 'PPL + Core & Cardio',
    description: 'Comprehensive 5-day athletic split.',
    categories: ['Push', 'Pull', 'Legs', 'Core', 'Cardio', 'Custom'],
  },
  {
    id: 'upper-lower',
    name: 'Upper / Lower Split',
    description: '4-day hypertrophy split split into upper & lower body.',
    categories: ['Upper Body', 'Lower Body', 'Core & Cardio', 'Custom'],
  },
  {
    id: 'full-body',
    name: 'Full Body & Functional',
    description: '3-day full body strength & conditioning plan.',
    categories: ['Full Body', 'Cardio', 'Mobility', 'Custom'],
  },
];
