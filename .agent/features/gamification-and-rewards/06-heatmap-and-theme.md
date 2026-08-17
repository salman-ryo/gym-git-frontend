# Heatmap Visual Refactor & Color Themes

> **Feature:** `gamification-and-rewards`  
> **Phase:** `06-heatmap-and-theme`

---

### Task 6.1: Heatmap Tile Theme Resolvers & Multi-View Rendering

* **Context Bundle:**
  1. [.agent/rules/02-code-style.md](file:///.agent/rules/02-code-style.md)
  2. [lib/types.ts](file:///lib/types.ts)
* **Owns:**
  - `components/contribution-graph/theme-utils.ts`
  - `components/contribution-graph/YearView.tsx`
  - `components/contribution-graph/MonthView.tsx`
  - `components/contribution-graph/WeekView.tsx`
* **Forbidden:**
  - `utils/supabase/**`
  - `app/login/page.tsx`
* **Acceptance Criteria:**
  - **WHEN** heatmap tiles are rendered, **THE SYSTEM SHALL** apply distinct color schemes:
    - Active workout: Dark to vibrant green gradient (`#166534` to `#22c55e`).
    - Frozen day ("Ice Pause"): Distinct icy blue frost tile (`#38bdf8`).
    - Rest token day: Neutral slate indicator (`#334155`).
    - Missed day: Deep dark canvas (`#0d1117`).
  - **WHEN** user hovers over a tile, **THE SYSTEM SHALL** render tooltips displaying workout details, rest token status, or sickness freeze annotations.
