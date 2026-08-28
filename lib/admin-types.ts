/**
 * Gym-Git Admin Types & DTO Specifications
 * Reference: API_GUIDE.md & CREATE_ADMIN.md
 */

import { GymLog } from './types';

// ==========================================
// 1. Admin Authentication & RBAC Types
// ==========================================

export type AdminRole = 'user' | 'admin' | 'superadmin';
export type UserAccountStatus = 'active' | 'suspended' | 'banned';

export interface AdminAuthVerifyResponse {
  user_id: string;
  email: string;
  name: string;
  role: 'admin' | 'superadmin';
  status: UserAccountStatus;
  permissions: string[];
}

// ==========================================
// 2. Platform Analytics & Dashboard Types
// ==========================================

export interface StreakDistribution {
  '0': number;
  '1-6': number;
  '7-13': number;
  '14-29': number;
  '30-59': number;
  '60-89': number;
  '90+': number;
}

export interface PopularWorkoutType {
  workout_type: string;
  count: number;
}

export interface TopUsedItem {
  item_id: string;
  item_name: string;
  count: number;
}

export interface AdminDashboardAnalytics {
  total_users: number;
  active_users_7d: number;
  active_users_30d: number;
  total_workouts_logged: number;
  total_rewards_claimed: number;
  streak_distribution: StreakDistribution;
  popular_workout_types: PopularWorkoutType[];
  top_used_items: TopUsedItem[];
}

// ==========================================
// 3. Audit Log Types
// ==========================================

export interface AdminAuditLog {
  id: string;
  admin_id: string;
  admin_email?: string;
  action: string;
  target_type: string;
  target_id: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface AdminAuditLogQueryParams {
  page?: number;
  limit?: number;
  admin_id?: string;
  action?: string;
  target_type?: string;
  target_id?: string;
  from_date?: string;
  to_date?: string;
}

export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total_count: number;
    total_pages: number;
  };
}

// ==========================================
// 4. Global Gamification Item Catalog Types
// ==========================================

export type ItemEffectType = 'instant_use' | 'time_based';
export type ItemRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

export interface AdminItem {
  id: string;
  name: string;
  description: string;
  effect_type: ItemEffectType;
  duration_seconds: number;
  icon_url?: string;
  is_active: boolean;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface CreateItemRequest {
  id: string;
  name: string;
  description: string;
  effect_type: ItemEffectType;
  duration_seconds: number;
  icon_url?: string;
  is_active: boolean;
  metadata?: Record<string, unknown>;
}

export type UpdateItemRequest = Partial<CreateItemRequest>;

// ==========================================
// 5. Reward Roadmaps & Milestone Authoring Types
// ==========================================

export interface AdminMilestone {
  id?: string;
  milestone_id?: string;
  plan_id?: string;
  streak_target: number;
  item_id: string;
  item_name?: string;
  item_icon?: string;
  quantity: number;
  metadata?: Record<string, unknown>;
  created_at?: string;
  updated_at?: string;
}

export interface AdminRewardPlan {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
  milestones?: AdminMilestone[];
  created_at?: string;
  updated_at?: string;
}

export interface CreateRewardPlanRequest {
  id: string;
  name: string;
  description?: string;
  is_active: boolean;
}

export type UpdateRewardPlanRequest = Partial<CreateRewardPlanRequest>;

export interface UpsertMilestoneRequest {
  streak_target: number;
  item_id: string;
  quantity: number;
  metadata?: Record<string, unknown>;
}

// ==========================================
// 6. Preset Workout Split Templates
// ==========================================

export interface AdminPresetPlan {
  id: string;
  name: string;
  description?: string;
  categories: string[];
  days_per_week?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePresetPlanRequest {
  id: string;
  name: string;
  description?: string;
  categories: string[];
}

export type UpdatePresetPlanRequest = Partial<CreatePresetPlanRequest>;

// ==========================================
// 7. User Directory & Search Types
// ==========================================

export interface AdminUserListItem {
  id: string;
  auth_user_id: string;
  email: string;
  name?: string;
  role: AdminRole;
  status: UserAccountStatus;
  weekly_plan_id?: string;
  timezone: string;
  current_streak: number;
  total_workouts: number;
  created_at: string;
  updated_at: string;
}

export interface AdminUserQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: AdminRole | 'all';
  status?: UserAccountStatus | 'all';
  sort_by?: 'created_at' | 'email' | 'name' | 'role' | 'status' | 'current_streak' | 'total_workouts' | 'updated_at';
  sort_dir?: 'asc' | 'desc';
}

// ==========================================
// 8. User 360 Profile & Composite Subsystems
// ==========================================

export interface AdminUserInventoryItem {
  id?: string;
  user_id?: string;
  item_id: string;
  quantity: number;
  item_name?: string;
  item_details?: AdminItem;
}

export interface AdminUserActiveEffectDTO {
  id: string;
  user_id: string;
  item_id: string;
  item_name: string;
  activated_at: string;
  expires_at: string;
  is_active: boolean;
  remaining_seconds: number;
  metadata?: Record<string, unknown>;
}

export interface AdminUserStreakDetail {
  user_id: string;
  timezone: string;
  current_streak: number;
  longest_streak: number;
  last_logged_date?: string;
  is_frozen: boolean;
  available_freeze_tokens: number;
  available_restore_shields: number;
}

export interface AdminUserClaimedReward {
  id: string;
  claim_id?: string;
  user_id: string;
  plan_id: string;
  streak_target: number;
  item_id: string;
  item_name?: string;
  quantity: number;
  claimed_at: string;
}

export interface AdminUserDetail {
  user: {
    id: string;
    auth_user_id: string;
    email: string;
    name?: string;
    role: AdminRole;
    status: UserAccountStatus;
    weekly_plan_id?: string;
    timezone: string;
    avatar_url?: string;
    created_at: string;
    updated_at: string;
  };
  streak_state?: AdminUserStreakDetail;
  inventory: AdminUserInventoryItem[];
  active_effects: AdminUserActiveEffectDTO[];
  total_workouts: number;
  recent_logs: GymLog[];
}

export interface AdminUserInventoryResponse {
  user_id: string;
  inventory: AdminUserInventoryItem[];
  active_effects: AdminUserActiveEffectDTO[];
}

// ==========================================
// 9. Administrative Action Request Payloads
// ==========================================

export interface AdminUpdateUserProfileRequest {
  name?: string;
  timezone?: string;
  weekly_plan_id?: string;
}

export interface AdminUpdateUserStatusRequest {
  status: UserAccountStatus;
  reason?: string;
}

export interface AdminUpdateUserRoleRequest {
  role: AdminRole;
}

export interface AdminGrantInventoryRequest {
  item_id: string;
  quantity: number;
  reason?: string;
}

export interface AdminDeductInventoryRequest {
  item_id: string;
  quantity: number;
  reason?: string;
}

export interface AdminGrantMilestoneClaimRequest {
  plan_id: string;
  streak_target: number;
  item_id: string;
}

export interface AdminStreakOverrideRequest {
  current_streak?: number;
  longest_streak?: number;
  reason?: string;
}

export interface AdminStreakFreezeRequest {
  duration_days: number;
  reason?: string;
}

export interface AdminGrantEffectRequest {
  item_id: string;
  duration_seconds: number;
  metadata?: Record<string, unknown>;
  reason?: string;
}

