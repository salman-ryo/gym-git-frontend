# Daily Check-In, Tile Editing & Weekly Plan Selector Modals

> **Feature:** `core-dashboard-and-analytics`  
> **Phase:** `03-modals-and-plans`

---

### Task 3.1: Daily Check-In Prompt, Onboarding Plan Picker & Tile Modals

* **Context Bundle:**
  1. [.agent/rules/01-architecture.md](file:///.agent/rules/01-architecture.md)
  2. [.agent/rules/02-code-style.md](file:///.agent/rules/02-code-style.md)
  3. [lib/types.ts](file:///lib/types.ts)
* **Owns:**
  - `components/DailyCheckInModal.tsx`
  - `components/WeeklyPlanModal.tsx`
  - `components/EditLogModal.tsx`
  - `components/weekly-plan/PrebuiltPlanGrid.tsx`
  - `components/weekly-plan/CustomPlanEditor.tsx`
* **Forbidden:**
  - `proxy.ts`
  - `components/pages/landing/**`
* **Acceptance Criteria:**
  - **WHEN** an authenticated user opens the dashboard and has not logged a session for today, **THE SYSTEM SHALL** automatically present the `DailyCheckInModal`.
  - **WHEN** a user logs in for the first time without an active plan, **THE SYSTEM SHALL** display the `WeeklyPlanModal` in forced onboarding mode (`preventClose=true`).
  - **WHEN** a user saves or edits a log entry, **THE SYSTEM SHALL** call `saveGymLog()` or `deleteGymLog()` and trigger a dynamic dashboard data refresh.
