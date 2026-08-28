# Gym-Git Backend: Next.js Frontend Integration & API Guide (`API_GUIDE.md`)

> **Version:** 1.0.0  
> **Target Audience:** Next.js (App Router) & React Frontend Developers  
> **Backend Architecture:** Go 1.22+ / Gin Web Framework / Supabase Auth & PostgreSQL  
> **Base URL:** `http://localhost:8080/api/v1` (Dev) / `https://api.gymgit.com/api/v1` (Prod)

---

## 1. Architectural Overview & Next.js Integration

### 1.1 Authentication & Token Transmission
- **Supabase Auth JWT:** All authenticated requests must include the Supabase access token in the `Authorization` header:
  ```http
  Authorization: Bearer <supabase_access_token>
  ```
- **Timezone Header:** Every request should send the user's active IANA timezone:
  ```http
  X-Timezone: America/New_York
  ```
- **CORS:** Ensure `ALLOWED_ORIGINS` in backend `.env` includes your Next.js domain (e.g., `http://localhost:3000`).

### 1.2 Standard Response Envelopes

#### Success Envelope (`200 OK`, `201 Created`)
```typescript
interface ApiResponse<T> {
  success: true;
  data: T;
  message: string;
  pagination?: {
    page: number;
    limit: number;
    total_count: number;
    total_pages: number;
  };
}
```

#### Error Envelope (`400`, `401`, `403`, `404`, `500`)
```typescript
interface ApiError {
  success: false;
  error: {
    code: string;       // e.g. "UNAUTHORIZED", "FORBIDDEN", "NOT_FOUND", "GRANT_FAILED"
    message: string;    // Human-readable error description
    details: string[];  // Field validation issues or stack details
  };
  timestamp: string;    // ISO 8601 UTC timestamp
}
```

### 1.3 Role-Based Access Control (RBAC)
- Standard users have `role: "user"`.
- Administrators have `role: "admin"` (can access catalog, roadmaps, user overrides, audit logs, analytics).
- Super administrators have `role: "superadmin"` (can additionally promote user roles and purge user accounts).

---

## 2. Next.js App Router Page & Feature Blueprint

Here is the recommended Next.js App Router directory structure for building the Admin Dashboard and User Portal:

```text
app/
├── (auth)/
│   └── login/                        # Supabase email/password login
├── admin/
│   ├── layout.tsx                    # Admin layout with sidebar navigation & RBAC guard
│   ├── page.tsx                      # Redirects to /admin/dashboard
│   ├── dashboard/
│   │   └── page.tsx                  # KPI cards, charts, streak distribution, top items
│   ├── users/
│   │   ├── page.tsx                  # Paginated user search table with filters
│   │   └── [id]/
│   │       ├── page.tsx              # Composite user 360 view (Profile, Streak, Inventory)
│   │       ├── streak-tab.tsx        # Streak count overrides, manual freeze/unfreeze
│   │       ├── inventory-tab.tsx     # Item balances, grant/deduct modal, active buffs
│   │       ├── rewards-tab.tsx       # Claimed roadmap milestone history & grant/revoke
│   │       └── logs-tab.tsx          # User workout history calendar & reset demo
│   ├── catalog/
│   │   ├── items/
│   │   │   └── page.tsx              # Items catalog management & modal
│   │   ├── rewards/
│   │   │   └── page.tsx              # Roadmap plans & streak milestone ladder editor
│   │   └── presets/
│   │       └── page.tsx              # Preset workout split templates authoring
│   └── audit-logs/
│       └── page.tsx                  # Filterable administrative audit trail & JSON inspector
└── portal/                           # Client-facing portal (logs, roadmap, stats)
```

---

## 3. Admin API Reference

All endpoints in this section are prefixed with `/api/v1/admin` and require an authenticated user with `role: "admin"` or `role: "superadmin"`.

---

### 3.1 Admin Authentication & Verification

#### `GET /api/v1/admin/auth/verify`
Verify if the current logged-in caller has active administrative privileges. Use in Next.js middleware or layout auth guards.

- **Headers:** `Authorization: Bearer <token>`
- **Response `data`:**
```typescript
interface AdminAuthVerifyResponse {
  user_id: string;          // UUID
  email: string;
  name: string;
  role: "admin" | "superadmin";
  status: "active" | "suspended" | "banned";
  permissions: string[];    // e.g. ["manage_users", "manage_catalog", "manage_streaks", "manage_roles"]
}
```

---

### 3.2 Platform Dashboard & Analytics

#### `GET /api/v1/admin/analytics/dashboard`
Aggregated platform-wide metrics, active user counts, streak distribution brackets, and popular workout splits.

- **Headers:** `Authorization: Bearer <token>`
- **Response `data`:**
```typescript
interface AdminDashboardAnalytics {
  total_users: number;
  active_users_7d: number;
  active_users_30d: number;
  total_workouts_logged: number;
  total_rewards_claimed: number;
  streak_distribution: {
    "0": number;
    "1-6": number;
    "7-13": number;
    "14-29": number;
    "30-59": number;
    "60-89": number;
    "90+": number;
  };
  popular_workout_types: Array<{
    workout_type: string;
    count: number;
  }>;
  top_used_items: Array<{
    item_id: string;
    item_name: string;
    count: number;
  }>;
}
```

---

### 3.3 Audit Trail Logs

#### `GET /api/v1/admin/audit-logs`
Query paginated immutable administrative action records.

- **Query Parameters:**
  - `page` (number, default: `1`)
  - `limit` (number, default: `20`)
  - `admin_id` (string, optional UUID)
  - `action` (string, optional e.g. `INVENTORY_GRANT`, `STREAK_OVERRIDE`, `USER_STATUS_UPDATE`)
  - `target_type` (string, optional e.g. `USER`, `ITEM`, `REWARD_PLAN`)
  - `target_id` (string, optional)
  - `from_date` (ISO string, optional)
  - `to_date` (ISO string, optional)
- **Response `data`:** `AdminAuditLog[]` with root `pagination`.
```typescript
interface AdminAuditLog {
  id: string;               // UUID
  admin_id: string;         // UUID
  admin_email?: string;
  action: string;
  target_type: string;
  target_id: string;
  metadata?: Record<string, any>;
  created_at: string;       // ISO 8601
}
```

---

### 3.4 Global Item Catalog Management

#### `GET /api/v1/admin/items`
List all consumable items and active buffs in the game catalog.
- **Response `data`:** `Item[]`

#### `POST /api/v1/admin/items`
Create a new gamification item in the global catalog.
- **Request Body:**
```typescript
interface CreateItemRequest {
  id: string;                  // e.g. "DOUBLE_XP_POTION" (Unique uppercase identifier)
  name: string;                // e.g. "Double XP Potion"
  description: string;
  effect_type: "instant_use" | "time_based";
  duration_seconds: number;    // e.g. 86400 (for 24h buff) or 0 for instant items
  icon_url?: string;
  is_active: boolean;
  metadata?: Record<string, any>;
}
```

#### `PUT /api/v1/admin/items/:id`
Update an existing item's name, description, duration, or active status.
- **Request Body:** Partial `CreateItemRequest`

#### `DELETE /api/v1/admin/items/:id`
Deactivate / soft-delete an item from the global catalog.

```typescript
interface Item {
  id: string;
  name: string;
  description: string;
  effect_type: "instant_use" | "time_based";
  duration_seconds: number;
  icon_url?: string;
  is_active: boolean;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
}
```

---

### 3.5 Reward Roadmaps & Milestone Authoring

#### `GET /api/v1/admin/rewards/plans`
List all reward roadmap plans.

#### `GET /api/v1/admin/rewards/plans/:id`
Retrieve single reward plan with its milestone ladder array.

#### `POST /api/v1/admin/rewards/plans`
Create a new reward plan.
- **Request Body:**
```typescript
interface CreateRewardPlanRequest {
  id: string;               // e.g. "veteran-roadmap"
  name: string;
  description?: string;
  is_active: boolean;
}
```

#### `PUT /api/v1/admin/rewards/plans/:id`
Update plan metadata and activation state.

#### `DELETE /api/v1/admin/rewards/plans/:id`
Delete a reward plan.

#### `POST /api/v1/admin/rewards/plans/:id/milestones`
Create or update a streak milestone reward in the plan.
- **Request Body:**
```typescript
interface UpsertMilestoneRequest {
  streak_target: number;    // e.g. 7, 14, 30, 60, 90, 100
  item_id: string;          // Catalog item ID e.g. "RESTORE_SHIELD"
  quantity: number;         // e.g. 1
  metadata?: Record<string, any>;
}
```

#### `DELETE /api/v1/admin/rewards/plans/:id/milestones/:milestone_id`
Remove milestone from plan.

---

### 3.6 Preset Workout Split Templates

#### `GET /api/v1/admin/plans/presets`
List all preset workout split templates.

#### `POST /api/v1/admin/plans/presets`
Create a preset workout template.
- **Request Body:**
```typescript
interface CreatePresetPlanRequest {
  id: string;               // e.g. "arnold-split"
  name: string;
  description?: string;
  categories: string[];     // e.g. ["Chest & Back", "Shoulders & Arms", "Legs", "Rest"]
}
```

#### `PUT /api/v1/admin/plans/presets/:id`
Update template name, description, or categories.

#### `DELETE /api/v1/admin/plans/presets/:id`
Delete preset template.

---

### 3.7 User Directory & Search

#### `GET /api/v1/admin/users`
Paginated search and filtering across all users.

- **Query Parameters:**
  - `page` (number, default: `1`)
  - `limit` (number, default: `20`)
  - `search` (string, searches `email`, `name`, `id`, `auth_user_id`)
  - `role` (string: `user` | `admin` | `superadmin`)
  - `status` (string: `active` | `suspended` | `banned`)
  - `sort_by` (`created_at` | `email` | `name` | `role` | `status` | `current_streak` | `total_workouts` | `updated_at`)
  - `sort_dir` (`asc` | `desc`)
- **Response `data`:** `AdminUserListItem[]` with root `pagination`.

```typescript
interface AdminUserListItem {
  id: string;               // User UUID
  auth_user_id: string;     // Supabase Auth UUID
  email: string;
  name?: string;
  role: "user" | "admin" | "superadmin";
  status: "active" | "suspended" | "banned";
  weekly_plan_id?: string;
  timezone: string;
  current_streak: number;
  total_workouts: number;
  created_at: string;
  updated_at: string;
}
```

---

### 3.8 User 360 Profile & Account Lifecycle

#### `GET /api/v1/admin/users/:id`
Retrieve full composite profile inspection for a user.
- **Response `data`:**
```typescript
interface AdminUserDetail {
  user: User;
  streak_state?: UserStreakState;
  inventory: UserInventoryItem[];
  active_effects: UserActiveEffect[];
  total_workouts: number;
  recent_logs: GymLog[];
}
```

#### `PUT /api/v1/admin/users/:id/profile`
Update user's profile details.
- **Request Body:**
```typescript
interface AdminUpdateUserProfileRequest {
  name?: string;
  timezone?: string;        // Valid IANA timezone e.g. "America/New_York"
  weekly_plan_id?: string;
}
```

#### `PUT /api/v1/admin/users/:id/status`
Suspend or ban a user account.
- **Request Body:**
```typescript
interface AdminUpdateUserStatusRequest {
  status: "active" | "suspended" | "banned";
  reason?: string;
}
```

#### `PUT /api/v1/admin/users/:id/role`
*(Protected: Requires SuperAdmin)* Promote or demote user.
- **Request Body:**
```typescript
interface AdminUpdateUserRoleRequest {
  role: "user" | "admin" | "superadmin";
}
```

#### `POST /api/v1/admin/users/:id/reset-demo`
Reset user's workout history back to initial demo seeds.

#### `DELETE /api/v1/admin/users/:id`
*(Protected: Requires SuperAdmin)* Permanently purge user account and all associated data.

---

### 3.9 User Inventory & Item Balances

#### `GET /api/v1/admin/users/:id/inventory`
Inspect target user's item balances and active timed effects.
- **Response `data`:**
```typescript
interface AdminUserInventoryResponse {
  user_id: string;
  inventory: UserInventoryItem[];
  active_effects: UserActiveEffect[];
}
```

#### `POST /api/v1/admin/users/:id/inventory/grant`
Grant items (e.g. compensation, rewards) to a user's inventory.
- **Request Body:**
```typescript
interface AdminGrantInventoryRequest {
  item_id: string;          // e.g. "RESTORE_SHIELD"
  quantity: number;         // Positive integer
  reason?: string;          // e.g. "Support ticket #419 compensation"
}
```

#### `POST /api/v1/admin/users/:id/inventory/deduct`
Deduct items from user's inventory.
- **Request Body:**
```typescript
interface AdminDeductInventoryRequest {
  item_id: string;
  quantity: number;
  reason?: string;
}
```

---

### 3.10 User Roadmap Milestone Claims

#### `GET /api/v1/admin/users/:id/rewards/claims`
List all milestone rewards claimed by the user.
- **Response `data`:** `UserClaimedReward[]`

#### `POST /api/v1/admin/users/:id/rewards/claims/grant`
Force-grant / unlock a roadmap milestone reward to user.
- **Request Body:**
```typescript
interface AdminGrantMilestoneClaimRequest {
  plan_id: string;          // e.g. "default-roadmap"
  streak_target: number;    // e.g. 30
  item_id: string;          // e.g. "RESTORE_SHIELD"
}
```

#### `DELETE /api/v1/admin/users/:id/rewards/claims/:claim_id`
Revoke a milestone claim so the user can re-claim it.

---

### 3.11 User Streak State & Freeze Controls

#### `GET /api/v1/admin/users/:id/streak`
Detailed streak inspection including token balances and last logged date.
- **Response `data`:**
```typescript
interface AdminUserStreakDetail {
  user_id: string;
  timezone: string;
  current_streak: number;
  longest_streak: number;
  last_logged_date?: string; // YYYY-MM-DD
  is_frozen: boolean;
  available_freeze_tokens: number;
  available_restore_shields: number;
}
```

#### `PUT /api/v1/admin/users/:id/streak/override`
Manually repair or override current and longest streak counts.
- **Request Body:**
```typescript
interface AdminStreakOverrideRequest {
  current_streak?: number;
  longest_streak?: number;
  reason?: string;
}
```

#### `POST /api/v1/admin/users/:id/streak/freeze`
Apply an administrative streak freeze hold.
- **Request Body:**
```typescript
interface AdminStreakFreezeRequest {
  duration_days: number;    // e.g. 7
  reason?: string;          // e.g. "Documented medical injury"
}
```

#### `POST /api/v1/admin/users/:id/streak/unfreeze`
Remove active freeze hold immediately.

---

### 3.12 User Active Timed Effects

#### `GET /api/v1/admin/users/:id/effects`
List user's active and historical timed buffs.
- **Response `data`:** `AdminUserActiveEffectDTO[]`

```typescript
interface AdminUserActiveEffectDTO {
  id: string;               // UUID
  user_id: string;
  item_id: string;
  item_name: string;
  activated_at: string;
  expires_at: string;
  is_active: boolean;
  remaining_seconds: number;
  metadata?: Record<string, any>;
}
```

#### `POST /api/v1/admin/users/:id/effects/grant`
Apply a timed buff directly to the user (e.g. 24h XP Boost).
- **Request Body:**
```typescript
interface AdminGrantEffectRequest {
  item_id: string;          // e.g. "XP_BOOST"
  duration_seconds: number; // e.g. 86400
  metadata?: Record<string, any>;
  reason?: string;
}
```

#### `DELETE /api/v1/admin/users/:id/effects/:effect_id`
Cancel / revoke an active timed buff.

---

## 4. Mobile & User Portal API Reference

These endpoints power the athlete/client portal and mobile apps (`/api/v1/*`).

---

### 4.1 User Auth & Profile Bootstrap

#### `POST /api/v1/auth/bootstrap`
Bootstrap user profile after Supabase sign-in/sign-up.
- **Request Body:**
```typescript
interface BootstrapRequest {
  name?: string;
  avatar_url?: string;
  provider?: string;        // default: "email"
}
```
- **Response `data`:** `{ user: User, plan: WeeklyPlan | null }`

#### `GET /api/v1/auth/me`
Fetch caller profile, active weekly plan, and streak state.
- **Response `data`:**
```typescript
interface AuthMeResponse {
  user: User;
  plan: WeeklyPlan | null;
  streak: UserStreakResponse;
}
```

#### `PUT /api/v1/auth/plan`
Assign or create a custom workout split plan.
- **Request Body:**
```typescript
interface UpdatePlanRequest {
  plan_id?: string;         // e.g. "ppl-standard" or "custom"
  custom_name?: string;     // required if plan_id === "custom"
  custom_description?: string;
  categories?: string[];    // e.g. ["Push", "Pull", "Legs", "Rest"]
}
```

#### `PUT /api/v1/auth/timezone`
Update user's timezone.
- **Request Body:** `{ "timezone": "America/New_York" }`

#### `POST /api/v1/auth/checkin-snooze`
Snooze daily workout prompt until tomorrow.

#### `DELETE /api/v1/auth/checkin-snooze`
Clear active check-in snooze.

---

### 4.2 Weekly Plans & Split Templates

#### `GET /api/v1/plans`
Fetch all available system preset split templates.
- **Response `data`:** `WeeklyPlan[]`

#### `PUT /api/v1/plans/queue`
Queue a weekly plan change to take effect on the next weekly cycle rollover (Monday).
- **Request Body:** `{ "plan_id": "upper-lower" }`

---

### 4.3 Gym Workout Logs

#### `GET /api/v1/logs`
Query user's workout logs.
- **Query Parameters:**
  - `start_date` (YYYY-MM-DD, optional)
  - `end_date` (YYYY-MM-DD, optional)
  - `workout_type` (string, optional)
- **Response `data`:** `GymLog[]`

#### `POST /api/v1/logs` or `PUT /api/v1/logs/:date`
Create or update a workout log for a date.
- **Request Body:**
```typescript
interface UpsertGymLogRequest {
  date: string;             // "YYYY-MM-DD"
  hours: number;            // e.g. 1.5
  workout_type: string;     // e.g. "Push"
  notes?: string;
}
```

#### `DELETE /api/v1/logs/:date`
Delete a workout log entry.

#### `POST /api/v1/logs/reset`
Reset workout history to seed demo state.

---

### 4.4 User Streak & Rest/Shield Controls

#### `GET /api/v1/streak`
Get user streak state, cycle progress, and available tokens.
- **Response `data`:**
```typescript
interface UserStreakResponse {
  current_streak: number;
  longest_streak: number;
  last_logged_date?: string;
  is_frozen: boolean;
  cycle_start_date: string;
  cycle_end_date: string;
  completed_days_this_cycle: number;
  target_days_per_cycle: number;
  available_freeze_tokens: number;
  available_restore_shields: number;
  streak_warning: boolean;
  streak_broken: boolean;
}
```

#### `POST /api/v1/streak/restore`
Consume 1 Restore Shield to repair a broken streak.

#### `POST /api/v1/streak/freeze`
Consume 1 Freeze Token to freeze streak for 7 days.

#### `POST /api/v1/streak/unfreeze`
Cancel streak freeze.

---

### 4.5 Scientific Power Stats & PR Analytics

#### `GET /api/v1/stats`
Retrieve total workouts, total hours, average duration, and consistency percentages.

#### `GET /api/v1/stats/power`
Retrieve gamified Scientific Power Stats:
- **Response `data`:**
```typescript
interface PowerStatsResponse {
  power_score: number;      // 0 - 10000+
  anime_tier: string;       // "E-Rank", "D-Rank", "C-Rank", "B-Rank", "A-Rank", "S-Rank", "Special Grade"
  split_accuracy: number;   // 0.0 - 100.0%
  scientific_streak: number;
  volume_load: number;
  prs_broken: number;
  breakdown: {
    consistency_factor: number;
    intensity_factor: number;
    volume_factor: number;
  };
}
```

---

### 4.6 User Inventory & Rewards

#### `GET /api/v1/inventory`
Get caller's item quantities and active timed buffs.

#### `POST /api/v1/inventory/use`
Use a consumable item from inventory.
- **Request Body:** `{ "item_id": "RESTORE_SHIELD" }`

#### `GET /api/v1/rewards/roadmap`
Get current active reward roadmap and milestone claim status.
- **Response `data`:** `RoadmapMilestoneResponse[]`

```typescript
interface RoadmapMilestoneResponse {
  plan_id: string;
  streak_target: number;
  item_id: string;
  item_name: string;
  quantity: number;
  icon_url?: string;
  is_unlocked: boolean;
  is_claimed: boolean;
  can_claim: boolean;
  claimed_at?: string;
}
```

#### `POST /api/v1/rewards/claim`
Claim an unlocked roadmap milestone reward.
- **Request Body:**
```typescript
interface ClaimRewardRequest {
  plan_id: string;
  streak_target: number;
  item_id: string;
}
```

---

## 5. Next.js API Client Example (Axios / Fetch)

Create `lib/api-client.ts` in your Next.js project:

```typescript
import axios from "axios";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach Supabase JWT and Client Timezone to every request
apiClient.interceptors.request.use(async (config) => {
  const supabase = createClientComponentClient();
  const { data: { session } } = await supabase.auth.getSession();

  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }

  // Set browser timezone
  config.headers["X-Timezone"] = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";

  return config;
});
```

---

## 6. Next.js Admin Route Guard Example

Create `components/admin/AdminGuard.tsx`:

```tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function verify() {
      try {
        const res = await apiClient.get("/admin/auth/verify");
        if (res.data.success && (res.data.data.role === "admin" || res.data.data.role === "superadmin")) {
          setAuthorized(true);
        } else {
          setAuthorized(false);
          router.push("/login?error=unauthorized");
        }
      } catch (err) {
        setAuthorized(false);
        router.push("/login?error=session_expired");
      }
    }
    verify();
  }, [router]);

  if (authorized === null) {
    return <div className="flex h-screen items-center justify-center">Loading Administrative Console...</div>;
  }

  return <>{children}</>;
}
```

