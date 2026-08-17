# 7-Day Plan Cycles, Rest Tokens & Accuracy Scoring

> **Feature:** `gamification-and-rewards`  
> **Phase:** `01-cycles-and-rest-tokens`

---

### Task 1.1: 7-Day Cycle Widget, Rest Token Indicators & Accuracy Ring

* **Context Bundle:**
  1. [.agent/rules/01-architecture.md](file:///.agent/rules/01-architecture.md)
  2. [.agent/rules/02-code-style.md](file:///.agent/rules/02-code-style.md)
  3. [lib/types.ts](file:///lib/types.ts)
* **Owns:**
  - `components/pages/dashboard/CycleProgressCard.tsx`
  - `components/pages/dashboard/StatsOverview.tsx`
* **Forbidden:**
  - `utils/supabase/**`
  - `components/pages/landing/**`
* **Acceptance Criteria:**
  - **WHEN** the dashboard renders, **THE SYSTEM SHALL** display the `CycleProgressCard` showing current 7-day cycle dates (`cycle_start_date` to `cycle_end_date`).
  - **WHEN** workouts are completed within the cycle, **THE SYSTEM SHALL** render completed vs target workout progress (e.g. `3 / 4 Workouts Completed`).
  - **WHEN** rest days occur, **THE SYSTEM SHALL** visually render consumed and available Rest Token capsules (`rest_tokens_used` / `rest_tokens_total`).
  - **WHEN** Split Accuracy is computed (0–100%), **THE SYSTEM SHALL** render the cyberpunk accuracy score meter.
  - **WHEN** a plan change is queued (`queued_weekly_plan_id != null`), **THE SYSTEM SHALL** display the queued split activation banner for the upcoming cycle reset.
