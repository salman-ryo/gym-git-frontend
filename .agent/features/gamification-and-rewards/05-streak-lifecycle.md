# Streak Lifecycle Events, Broken Recovery Modal & Risk Warnings

> **Feature:** `gamification-and-rewards`  
> **Phase:** `05-streak-lifecycle`

---

### Task 5.1: Streak Break Modal, Restore Shield Redemption & Midnight Warning Banner

* **Context Bundle:**
  1. [.agent/rules/01-architecture.md](file:///.agent/rules/01-architecture.md)
  2. [lib/types.ts](file:///lib/types.ts)
  3. [lib/streak-service.ts](file:///lib/streak-service.ts)
* **Owns:**
  - `components/pages/dashboard/StreakBrokenModal.tsx`
  - `components/pages/dashboard/StreakRiskWarningBanner.tsx`
  - `app/dashboard/page.tsx`
* **Forbidden:**
  - `utils/supabase/**`
  - `components/pages/landing/**`
* **Acceptance Criteria:**
  - **WHEN** `streak_broken_event` is received on app startup or stats fetch, **THE SYSTEM SHALL** trigger the `StreakBrokenModal`.
  - **WHEN** user has Restore Shields available (`restore_shield_available == true`), **THE SYSTEM SHALL** allow 1-click redemption calling `POST /api/v1/streak/restore` and revive the streak.
  - **WHEN** user has 0 Restore Shields, **THE SYSTEM SHALL** offer a direct navigation shortcut to the Reward Roadmap to unlock shields.
  - **WHEN** `streak_warning_event` is active and user is at risk before local midnight, **THE SYSTEM SHALL** display the `StreakRiskWarningBanner` showing hours remaining until midnight and a direct "Log Workout" shortcut.
