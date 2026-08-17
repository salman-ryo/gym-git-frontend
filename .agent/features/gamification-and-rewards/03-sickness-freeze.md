# Sickness Freeze Vault ("Ice Pause") & Manual Control

> **Feature:** `gamification-and-rewards`  
> **Phase:** `03-sickness-freeze`

---

### Task 3.1: Sickness Freeze Activation, Icy Banner & Strict No-Auto-Unfreeze Enforcement

* **Context Bundle:**
  1. [.agent/rules/01-architecture.md](file:///.agent/rules/01-architecture.md)
  2. [lib/types.ts](file:///lib/types.ts)
  3. [lib/streak-service.ts](file:///lib/streak-service.ts)
* **Owns:**
  - `lib/streak-service.ts`
  - `components/pages/dashboard/FreezeModal.tsx`
  - `components/pages/dashboard/FrozenStateBanner.tsx`
* **Forbidden:**
  - `utils/supabase/**`
  - `components/pages/landing/**`
* **Acceptance Criteria:**
  - **WHEN** user activates a freeze via `FreezeModal`, **THE SYSTEM SHALL** call `POST /api/v1/streak/freeze` and set `is_frozen = true`.
  - **WHEN** `is_frozen == true`, **THE SYSTEM SHALL** render the high-visibility `FrozenStateBanner` informing the user that streak decay is paused.
  - **WHEN** the user visits the app, logs in, or refreshes stats, **THE SYSTEM SHALL NEVER** auto-unfreeze the streak (Strict No-Auto-Unfreeze Rule).
  - **WHEN** user clicks "Resume Streak (Unfreeze)" in `FrozenStateBanner`, **THE SYSTEM SHALL** confirm intent and call `POST /api/v1/streak/unfreeze`.
