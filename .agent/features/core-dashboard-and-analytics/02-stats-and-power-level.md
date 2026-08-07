# Scientific Streaks, Stats & Anime Power Scoring

> **Feature:** `core-dashboard-and-analytics`  
> **Phase:** `02-stats-and-power-level`

---

### Task 2.1: Streaks Overview, Power Score Matrix & Progress Bars

* **Context Bundle:**
  1. [.agent/rules/01-architecture.md](file:///.agent/rules/01-architecture.md)
  2. [lib/scientific-power.ts](file:///lib/scientific-power.ts)
  3. [lib/scientific-streak.ts](file:///lib/scientific-streak.ts)
* **Owns:**
  - `components/StatsOverview.tsx`
  - `components/PowerLevelChart.tsx`
  - `components/power-level/MonthlyProgress.tsx`
  - `components/power-level/WeeklyProgress.tsx`
  - `components/power-score-guide/ProgressionPath.tsx`
  - `components/power-score-guide/ScoringMetrics.tsx`
  - `components/AnimeTierCard.tsx`
* **Forbidden:**
  - `app/login/page.tsx`
  - `utils/supabase/**`
* **Acceptance Criteria:**
  - **WHEN** user logs are loaded, **THE SYSTEM SHALL** calculate consecutive active streak days, longest streak, total session hours, and average session duration.
  - **WHEN** power score is evaluated, **THE SYSTEM SHALL** compute scores across consistency, duration quality, variety, and momentum (0–100) and map them to anime character tiers.
  - **WHEN** the user opens the Power Score Guide modal, **THE SYSTEM SHALL** display the breakdown and tier progression metrics.
