/**
 * Centralized Admin API Service Client
 * Handles communication with Go/Gin /api/v1/admin/* endpoints
 */

import { api } from '@/utils/api';
import {
  AdminAuthVerifyResponse,
  AdminDashboardAnalytics,
  AdminAuditLog,
  AdminAuditLogQueryParams,
  AdminItem,
  CreateItemRequest,
  UpdateItemRequest,
  AdminRewardPlan,
  CreateRewardPlanRequest,
  UpdateRewardPlanRequest,
  UpsertMilestoneRequest,
  AdminMilestone,
  AdminPresetPlan,
  CreatePresetPlanRequest,
  UpdatePresetPlanRequest,
  AdminUserListItem,
  AdminUserQueryParams,
  AdminUserDetail,
  AdminUserInventoryResponse,
  AdminUserStreakDetail,
  AdminUserClaimedReward,
  AdminUserActiveEffectDTO,
  AdminUpdateUserProfileRequest,
  AdminUpdateUserStatusRequest,
  AdminUpdateUserRoleRequest,
  AdminGrantInventoryRequest,
  AdminDeductInventoryRequest,
  AdminGrantMilestoneClaimRequest,
  AdminStreakOverrideRequest,
  AdminStreakFreezeRequest,
  AdminGrantEffectRequest,
} from './admin-types';

function buildQueryString(params: Record<string, string | number | boolean | undefined | null>): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, val]) => {
    if (val !== undefined && val !== null && val !== '') {
      searchParams.append(key, String(val));
    }
  });
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

export const adminService = {
  // ----------------------------------------------------
  // 1. Admin Authentication & Verification
  // ----------------------------------------------------
  async verifySession(): Promise<AdminAuthVerifyResponse> {
    return api.get<AdminAuthVerifyResponse>('/admin/auth/verify');
  },

  // ----------------------------------------------------
  // 2. Platform Analytics
  // ----------------------------------------------------
  async getDashboardAnalytics(): Promise<AdminDashboardAnalytics> {
    return api.get<AdminDashboardAnalytics>('/admin/analytics/dashboard');
  },

  // ----------------------------------------------------
  // 3. Audit Logs
  // ----------------------------------------------------
  async getAuditLogs(params: AdminAuditLogQueryParams = {}): Promise<AdminAuditLog[]> {
    const qs = buildQueryString({
      page: params.page,
      limit: params.limit,
      admin_id: params.admin_id,
      action: params.action,
      target_type: params.target_type,
      target_id: params.target_id,
      from_date: params.from_date,
      to_date: params.to_date,
    });
    const result = await api.get<AdminAuditLog[] | { items: AdminAuditLog[] }>(`/admin/audit-logs${qs}`);
    if (Array.isArray(result)) return result;
    if (result && Array.isArray((result as { items: AdminAuditLog[] }).items)) {
      return (result as { items: AdminAuditLog[] }).items;
    }
    return [];
  },

  // ----------------------------------------------------
  // 4. Global Gamification Item Catalog
  // ----------------------------------------------------
  async getItems(): Promise<AdminItem[]> {
    const items = await api.get<AdminItem[]>('/admin/items');
    return Array.isArray(items) ? items : [];
  },

  async createItem(payload: CreateItemRequest): Promise<AdminItem> {
    return api.post<AdminItem, CreateItemRequest>('/admin/items', payload);
  },

  async updateItem(id: string, payload: UpdateItemRequest): Promise<AdminItem> {
    return api.put<AdminItem, UpdateItemRequest>(`/admin/items/${encodeURIComponent(id)}`, payload);
  },

  async deleteItem(id: string): Promise<{ success: boolean }> {
    return api.delete<{ success: boolean }>(`/admin/items/${encodeURIComponent(id)}`);
  },

  // ----------------------------------------------------
  // 5. Reward Roadmaps & Milestone Authoring
  // ----------------------------------------------------
  async getRewardPlans(): Promise<AdminRewardPlan[]> {
    const plans = await api.get<AdminRewardPlan[]>('/admin/rewards/plans');
    return Array.isArray(plans) ? plans : [];
  },

  async getRewardPlan(id: string): Promise<AdminRewardPlan> {
    return api.get<AdminRewardPlan>(`/admin/rewards/plans/${encodeURIComponent(id)}`);
  },

  async createRewardPlan(payload: CreateRewardPlanRequest): Promise<AdminRewardPlan> {
    return api.post<AdminRewardPlan, CreateRewardPlanRequest>('/admin/rewards/plans', payload);
  },

  async updateRewardPlan(id: string, payload: UpdateRewardPlanRequest): Promise<AdminRewardPlan> {
    return api.put<AdminRewardPlan, UpdateRewardPlanRequest>(
      `/admin/rewards/plans/${encodeURIComponent(id)}`,
      payload
    );
  },

  async deleteRewardPlan(id: string): Promise<{ success: boolean }> {
    return api.delete<{ success: boolean }>(`/admin/rewards/plans/${encodeURIComponent(id)}`);
  },

  async upsertMilestone(planId: string, payload: UpsertMilestoneRequest): Promise<AdminMilestone> {
    return api.post<AdminMilestone, UpsertMilestoneRequest>(
      `/admin/rewards/plans/${encodeURIComponent(planId)}/milestones`,
      payload
    );
  },

  async deleteMilestone(planId: string, milestoneId: string): Promise<{ success: boolean }> {
    return api.delete<{ success: boolean }>(
      `/admin/rewards/plans/${encodeURIComponent(planId)}/milestones/${encodeURIComponent(milestoneId)}`
    );
  },

  // ----------------------------------------------------
  // 6. Preset Workout Split Templates
  // ----------------------------------------------------
  async getPresetPlans(): Promise<AdminPresetPlan[]> {
    const presets = await api.get<AdminPresetPlan[]>('/admin/plans/presets');
    return Array.isArray(presets) ? presets : [];
  },

  async createPresetPlan(payload: CreatePresetPlanRequest): Promise<AdminPresetPlan> {
    return api.post<AdminPresetPlan, CreatePresetPlanRequest>('/admin/plans/presets', payload);
  },

  async updatePresetPlan(id: string, payload: UpdatePresetPlanRequest): Promise<AdminPresetPlan> {
    return api.put<AdminPresetPlan, UpdatePresetPlanRequest>(
      `/admin/plans/presets/${encodeURIComponent(id)}`,
      payload
    );
  },

  async deletePresetPlan(id: string): Promise<{ success: boolean }> {
    return api.delete<{ success: boolean }>(`/admin/plans/presets/${encodeURIComponent(id)}`);
  },

  // ----------------------------------------------------
  // 7. User Directory & Search
  // ----------------------------------------------------
  async getUsers(params: AdminUserQueryParams = {}): Promise<AdminUserListItem[]> {
    const qs = buildQueryString({
      page: params.page,
      limit: params.limit,
      search: params.search,
      role: params.role && params.role !== 'all' ? params.role : undefined,
      status: params.status && params.status !== 'all' ? params.status : undefined,
      sort_by: params.sort_by,
      sort_dir: params.sort_dir,
    });
    const result = await api.get<AdminUserListItem[] | { items: AdminUserListItem[] }>(`/admin/users${qs}`);
    if (Array.isArray(result)) return result;
    if (result && Array.isArray((result as { items: AdminUserListItem[] }).items)) {
      return (result as { items: AdminUserListItem[] }).items;
    }
    return [];
  },

  // ----------------------------------------------------
  // 8. User 360 Profile & Lifecycle
  // ----------------------------------------------------
  async getUserDetail(id: string): Promise<AdminUserDetail> {
    return api.get<AdminUserDetail>(`/admin/users/${encodeURIComponent(id)}`);
  },

  async updateUserProfile(id: string, payload: AdminUpdateUserProfileRequest): Promise<{ success: boolean }> {
    return api.put<{ success: boolean }, AdminUpdateUserProfileRequest>(
      `/admin/users/${encodeURIComponent(id)}/profile`,
      payload
    );
  },

  async updateUserStatus(id: string, payload: AdminUpdateUserStatusRequest): Promise<{ success: boolean }> {
    return api.put<{ success: boolean }, AdminUpdateUserStatusRequest>(
      `/admin/users/${encodeURIComponent(id)}/status`,
      payload
    );
  },

  async updateUserRole(id: string, payload: AdminUpdateUserRoleRequest): Promise<{ success: boolean }> {
    return api.put<{ success: boolean }, AdminUpdateUserRoleRequest>(
      `/admin/users/${encodeURIComponent(id)}/role`,
      payload
    );
  },

  async resetUserDemo(id: string): Promise<{ success: boolean }> {
    return api.post<{ success: boolean }>(`/admin/users/${encodeURIComponent(id)}/reset-demo`);
  },

  async purgeUser(id: string): Promise<{ success: boolean }> {
    return api.delete<{ success: boolean }>(`/admin/users/${encodeURIComponent(id)}`);
  },

  // ----------------------------------------------------
  // 9. User Inventory & Item Balances
  // ----------------------------------------------------
  async getUserInventory(id: string): Promise<AdminUserInventoryResponse> {
    return api.get<AdminUserInventoryResponse>(`/admin/users/${encodeURIComponent(id)}/inventory`);
  },

  async grantUserInventory(
    id: string,
    payload: AdminGrantInventoryRequest
  ): Promise<{ success: boolean }> {
    return api.post<{ success: boolean }, AdminGrantInventoryRequest>(
      `/admin/users/${encodeURIComponent(id)}/inventory/grant`,
      payload
    );
  },

  async deductUserInventory(
    id: string,
    payload: AdminDeductInventoryRequest
  ): Promise<{ success: boolean }> {
    return api.post<{ success: boolean }, AdminDeductInventoryRequest>(
      `/admin/users/${encodeURIComponent(id)}/inventory/deduct`,
      payload
    );
  },

  // ----------------------------------------------------
  // 10. User Roadmap Milestone Claims
  // ----------------------------------------------------
  async getUserRewardClaims(id: string): Promise<AdminUserClaimedReward[]> {
    const claims = await api.get<AdminUserClaimedReward[]>(
      `/admin/users/${encodeURIComponent(id)}/rewards/claims`
    );
    return Array.isArray(claims) ? claims : [];
  },

  async grantUserMilestoneClaim(
    id: string,
    payload: AdminGrantMilestoneClaimRequest
  ): Promise<{ success: boolean }> {
    return api.post<{ success: boolean }, AdminGrantMilestoneClaimRequest>(
      `/admin/users/${encodeURIComponent(id)}/rewards/claims/grant`,
      payload
    );
  },

  async revokeUserMilestoneClaim(id: string, claimId: string): Promise<{ success: boolean }> {
    return api.delete<{ success: boolean }>(
      `/admin/users/${encodeURIComponent(id)}/rewards/claims/${encodeURIComponent(claimId)}`
    );
  },

  // ----------------------------------------------------
  // 11. User Streak State & Freeze Controls
  // ----------------------------------------------------
  async getUserStreak(id: string): Promise<AdminUserStreakDetail> {
    return api.get<AdminUserStreakDetail>(`/admin/users/${encodeURIComponent(id)}/streak`);
  },

  async overrideUserStreak(
    id: string,
    payload: AdminStreakOverrideRequest
  ): Promise<{ success: boolean }> {
    return api.put<{ success: boolean }, AdminStreakOverrideRequest>(
      `/admin/users/${encodeURIComponent(id)}/streak/override`,
      payload
    );
  },

  async freezeUserStreak(
    id: string,
    payload: AdminStreakFreezeRequest
  ): Promise<{ success: boolean }> {
    return api.post<{ success: boolean }, AdminStreakFreezeRequest>(
      `/admin/users/${encodeURIComponent(id)}/streak/freeze`,
      payload
    );
  },

  async unfreezeUserStreak(id: string): Promise<{ success: boolean }> {
    return api.post<{ success: boolean }>(`/admin/users/${encodeURIComponent(id)}/streak/unfreeze`);
  },

  // ----------------------------------------------------
  // 12. User Active Timed Effects
  // ----------------------------------------------------
  async getUserEffects(id: string): Promise<AdminUserActiveEffectDTO[]> {
    const effects = await api.get<AdminUserActiveEffectDTO[]>(
      `/admin/users/${encodeURIComponent(id)}/effects`
    );
    return Array.isArray(effects) ? effects : [];
  },

  async grantUserEffect(
    id: string,
    payload: AdminGrantEffectRequest
  ): Promise<{ success: boolean }> {
    return api.post<{ success: boolean }, AdminGrantEffectRequest>(
      `/admin/users/${encodeURIComponent(id)}/effects/grant`,
      payload
    );
  },

  async revokeUserEffect(id: string, effectId: string): Promise<{ success: boolean }> {
    return api.delete<{ success: boolean }>(
      `/admin/users/${encodeURIComponent(id)}/effects/${encodeURIComponent(effectId)}`
    );
  },
};
