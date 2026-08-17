# Architecture & Infrastructure Specification

> **Rule ID:** `01-architecture`  
> **Applicable Globs:** `app/**`, `utils/**`, `lib/**`, `proxy.ts`, `middleware.ts`

---

## 1. Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | React 19, Server & Client Components (`'use client'`) |
| **Language** | TypeScript 5+ | Strict type checking enabled, no implicit `any` |
| **Identity Provider** | Supabase Auth | `@supabase/ssr` with HttpOnly cookie sessions |
| **Custom Backend** | Go / Gin REST API | Running locally at `http://localhost:8080/api/v1` (or `NEXT_PUBLIC_API_URL`) |
| **Database** | PostgreSQL | Managed via Go backend models (Users, Logs, Plans, Stats) |
| **Styling** | Tailwind CSS v4 | `@tailwindcss/postcss`, CSS Variables, Radix UI |
| **Deployment / CI** | Vercel / Docker | Local dev via `npm run dev`, production builds via `npm run build` |

---

## 2. Environment Variables & Configuration

All environment variables are validated through [lib/env.ts](file:///lib/env.ts):

* `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL (e.g., `https://xyz.supabase.co`).
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase public anonymous API key.
* `NEXT_PUBLIC_API_URL`: Custom Go backend API base URL (defaults to `http://localhost:8080/api/v1`).

---

## 3. Authentication & Cookie Architecture

### A. `@supabase/ssr` Cookie Clients
1. **Browser Client** ([utils/supabase/client.ts](file:///utils/supabase/client.ts)):
   - Singleton instance for client-side interactions (sign in, sign up, OAuth).
2. **Server Component Client** ([utils/supabase/server.ts](file:///utils/supabase/server.ts)):
   - Uses `next/headers` `cookies()` with `getAll()` and `setAll()` to read and persist tokens securely.
3. **Middleware Client** ([utils/supabase/middleware.ts](file:///utils/supabase/middleware.ts) / [proxy.ts](file:///proxy.ts)):
   - Refreshes session tokens on every navigation request to prevent stale sessions.

### B. Custom Go Backend Bootstrap Handshake
* **The Problem:** Supabase handles identity, but application data (workout logs, stats, weekly plans) resides in the custom Go PostgreSQL backend.
* **The Bootstrap Contract:**
  1. User authenticates via Supabase (`signInWithPassword`, `signUp`, or `signInWithOAuth`).
  2. Frontend immediately calls `POST /api/v1/auth/bootstrap` with payload `{ selectedPlanId: "ppl-standard" }` and header `Authorization: Bearer <supabase_access_token>`.
  3. Go backend idempotently creates or verifies the `users` table record and assigns the initial plan.
  4. Frontend calls `GET /api/v1/auth/me` to hydrate global user state in [lib/auth-context.tsx](file:///lib/auth-context.tsx).

---

## 4. API Client Wrapper Pattern ([utils/api.ts](file:///utils/api.ts))

All communication with the Go backend **MUST** pass through the centralized `apiFetch` / `api` helper:
1. **Base URL Resolution:** Automatically strips trailing slashes and prefixes endpoints.
2. **Automatic Token Injection:** Retrieves active Supabase JWT session and attaches `Authorization: Bearer <token>`.
3. **Global Timezone Header (`X-Timezone`):** Automatically detects user's local IANA timezone (`Intl.DateTimeFormat().resolvedOptions().timeZone`) and attaches `X-Timezone: <user_tz>` to every request.
4. **Response Envelope Unwrapping:** Automatically extracts `data` from responses conforming to `{ success: true, data: T }`.
5. **Standard Error Handling:** Converts failed HTTP statuses into typed `ApiError` instances.

---

## 5. Global Timezone & Streak Engine Rules

1. **User Timezone Profile:** Every user has an IANA timezone string (e.g. `America/New_York`, `Asia/Kolkata`, `Europe/London`).
2. **Localized Wall-Clock Day:** A day runs strictly from `00:00:00` to `23:59:59` in the user's localized timezone. A day is **never** marked missed until local midnight arrives.
3. **Strict Historical Segregation:**
   - **Today's Log (`date == user_today`):** Updates workout volume AND increments active streak.
   - **Historical Log (`date < user_today`):** Updates historical volume and heatmap matrix ONLY. Does **NOT** revive a dead streak unless a **Restore Shield** is explicitly redeemed.
4. **7-Day Plan Cycle Window:**
   - A plan runs in fixed 7-day windows (`cycle_start_date` to `cycle_end_date`).
   - Target workouts = count of plan categories; Rest Tokens = 7 - target workouts.
5. **Strict No-Auto-Unfreeze Rule:**
   - Opening the app, logging in, or checking profile stats **NEVER** automatically unfreezes a streak.
   - Unfreezing occurs **ONLY** via explicit manual unfreeze (`POST /api/v1/streak/unfreeze`) or freeze token time expiration.

---

## 6. Backend REST API Endpoints & Contract Mapping

All frontend service calls route to real Go/Gin endpoints via `utils/api.ts`:

| Domain | Method & Endpoint | Payload / Params | Purpose & Frontend Target |
| :--- | :--- | :--- | :--- |
| **Auth Bootstrap** | `POST /auth/bootstrap` | `{ selectedPlanId: string }` | Idempotently creates user record in PostgreSQL `users` table |
| **User Profile** | `GET /auth/me` | None (Bearer token + `X-Timezone`) | Hydrates user profile, active plan, cycle info, and lifecycle events into `AuthContext` |
| **Update Plan** | `PUT /auth/plan` | `{ plan_id, name, description, categories }` | Updates user's workout split |
| **Queue Plan** | `PUT /plans/queue` | `{ plan_id }` | Queues workout split change for the start of the next 7-day cycle |
| **Backend Logout** | `POST /auth/logout` | None | Terminates active backend sessions on user logout |
| **Gym Logs** | `GET /logs` | `?startDate=&endDate=&workoutType=` | Fetches workout history for heatmap & analytics |
| **Create/Edit Log**| `POST /logs` | `{ date, hours, workout_type, notes }` | Upserts daily workout log entry |
| **Delete Log** | `DELETE /logs/:date` | None | Deletes workout log entry for specified date |
| **Dashboard Stats**| `GET /stats` | None | Retrieves streak, total sessions, hours, and attendance stats |
| **Power Analytics**| `GET /stats/power` | `?days=30` | Returns scientific power scores & anime tier breakdown |
| **Streak Status** | `GET /streak` | None (Bearer token + `X-Timezone`) | Returns active streak, cycle details, rest tokens, freeze state, and lifecycle events |
| **Streak Restore** | `POST /streak/restore` | `{ target_date, workout_type, hours }` | Redeems 1 Restore Shield to revive a lost streak within the 3-day window |
| **Streak Freeze** | `POST /streak/freeze` | `{ duration_days, reason }` | Consumes freeze tokens from inventory and sets `is_frozen = true` |
| **Streak Unfreeze**| `POST /streak/unfreeze` | None | Manually ends active streak freeze ("Ice Pause") |
| **Item Catalog** | `GET /items` | None | Retrieves public definitions of all master items |
| **User Inventory** | `GET /inventory` | None | Retrieves user item balances and active time-based buffs |
| **Use Inventory** | `POST /inventory/use` | `{ item_id, quantity, payload }` | Consumes or activates an item from user inventory |
| **Reward Roadmap** | `GET /rewards/roadmap` | `?plan_id=` | Retrieves progression roadmap milestones (`LOCKED`, `CLAIMABLE`, `CLAIMED`) |
| **Claim Reward** | `POST /rewards/claim` | `{ plan_id, streak_target, item_id }` | Claims unlocked milestone reward into inventory |
| **Admin Milestone**| `POST /admin/rewards/plans/:id/milestones` | `{ streak_target, item_id, quantity, title, description, badge_slug }` | Inserts or updates dynamic milestone reward |
| **Delete Milestone**| `DELETE /admin/rewards/plans/:id/milestones/:milestone_id` | None | Deletes milestone target from roadmap plan |

---

## 7. Core Domain Models ([lib/types.ts](file:///lib/types.ts))

```typescript
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
```

---

## 8. Next.js Middleware & Route Protection

Implemented via [proxy.ts](file:///proxy.ts) and [utils/supabase/middleware.ts](file:///utils/supabase/middleware.ts):
- Calls `supabase.auth.getUser()` to verify active session from secure cookies.
- **Unauthenticated Users:** Requests targeting `/dashboard`, `/logs`, `/settings`, or `/` are redirected to `/login`.
- **Authenticated Users:** Requests targeting `/login` or `/signup` are redirected to `/`.
- **Static Assets:** Paths under `_next/*`, static media, and public assets bypass auth filters.
