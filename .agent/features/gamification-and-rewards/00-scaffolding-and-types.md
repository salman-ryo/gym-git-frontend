# Gamification Types, Timezone Header & API Scaffolding

> **Feature:** `gamification-and-rewards`  
> **Phase:** `00-scaffolding-and-types`

---

### Task 0.1: Domain Models, IANA Timezone Header & Service Client Scaffolding

* **Context Bundle:**
  1. [.agent/rules/01-architecture.md](file:///.agent/rules/01-architecture.md)
  2. [lib/types.ts](file:///lib/types.ts)
  3. [utils/api.ts](file:///utils/api.ts)
* **Owns:**
  - `lib/types.ts`
  - `utils/api.ts`
  - `lib/gym-service.ts`
* **Forbidden:**
  - `proxy.ts`
  - `components/pages/landing/**`
* **Acceptance Criteria:**
  - **WHEN** any HTTP request is dispatched via `utils/api.ts`, **THE SYSTEM SHALL** automatically detect the user's localized IANA timezone (`Intl.DateTimeFormat().resolvedOptions().timeZone`) and inject `X-Timezone: <user_tz>`.
  - **WHEN** TypeScript compiles, **THE SYSTEM SHALL** expose strict interfaces for `CycleInfo`, `StreakBrokenEvent`, `StreakWarningEvent`, `ItemCatalogItem`, `UserInventoryItem`, `ActiveItemEffect`, and `RoadmapMilestone`.
  - **WHEN** `fetchDashboardStats` or `fetchStreakLifecycle` is called in `gym-service.ts`, **THE SYSTEM SHALL** return populated cycle stats, accuracy scores, and active streak events.
