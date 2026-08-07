# Contribution Graph & Multi-View Activity Heatmap

> **Feature:** `core-dashboard-and-analytics`  
> **Phase:** `01-contribution-graph`

---

### Task 1.1: Year, Month & Week Heatmap Views with Workout Type Filtering

* **Context Bundle:**
  1. [.agent/rules/02-code-style.md](file:///.agent/rules/02-code-style.md)
  2. [lib/types.ts](file:///lib/types.ts)
* **Owns:**
  - `components/ContributionGraph.tsx`
  - `components/contribution-graph/YearView.tsx`
  - `components/contribution-graph/MonthView.tsx`
  - `components/contribution-graph/WeekView.tsx`
  - `components/contribution-graph/theme-utils.ts`
  - `components/FilterBar.tsx`
* **Forbidden:**
  - `utils/supabase/**`
  - `app/auth/**`
* **Acceptance Criteria:**
  - **WHEN** a user selects a timeframe (Year, Month, or Week), **THE SYSTEM SHALL** re-render the corresponding workout tile grid with color-coded intensity based on logged hours and workout types.
  - **WHEN** a user selects a workout category filter (e.g., Push, Pull, Legs), **THE SYSTEM SHALL** highlight matching workout sessions while dimming non-matching days.
  - **WHEN** a tile is clicked, **THE SYSTEM SHALL** trigger the Tile Edit Modal for that specific date.
