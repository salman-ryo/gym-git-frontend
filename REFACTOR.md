# Gym-Git Frontend Refactoring Master Plan

> **Architectural Health, Code Reuse & Maintainability Strategy**  
> *Target: Eliminate duplicate code, decompose monolithic components, standardize primitives, unify styling systems, and achieve 100% strict TypeScript/ESLint compliance.*

---

## 1. Executive Summary & Problem Audit

An in-depth codebase audit of Gym-Git's frontend revealed several architectural bottlenecks that impact maintainability, performance, and developer velocity:

| Problem Area | Affected Files | Impact & Symptoms |
| :--- | :--- | :--- |
| **Monolithic Page & State** | `app/dashboard/page.tsx` (703 lines)<br>`DailyCheckInModal.tsx` (583 lines) | Mixed concerns: 8+ modal states, timer lifecycles, mock data dispatchers, date arithmetic, cutscene animations, and API synchronization all in single client components. |
| **Duplicated UI Logic** | `YearView.tsx`, `MonthView.tsx`, `WeekView.tsx` | ~40 lines of identical tooltip JSX copy-pasted across 3 view components with identical conditional branches. |
| **Scattered Date Helpers** | `StreakBrokenModal`, `RestoreConfirmModal`, `EditLogModal`, `DailyCheckInModal`, `ContributionGraph`, `CycleProgressCard` | `toLocaleDateString` and custom date formatting functions independently re-declared in 8+ different files. |
| **Fragmented Theme / Rarity Mappers** | `InventoryDrawer`, `RoadmapMilestoneNode`, `ClaimCelebrationModal`, `ActiveEffectsBar` | Duplicate functions mapping `common`, `rare`, `epic`, `legendary` into Tailwind color tokens and glows. |
| **Duplicated Custom Hooks** | `WhyGymGitSection.tsx`, `power-chart-utils.ts`, `CycleProgressCard.tsx` | Multiple disparate implementations of animated number counters (`useCounter`, `AnimatedScoreCounter`) and `useInView` observers. |
| **Modal Boilerplate Duplication** | 8 dashboard modals | Every modal re-creates identical backdrop overlay, card container, glowing gradient lines, close 'X' buttons, and error banners. |
| **Dead Code & Phantom Files** | `weekly-plan/PrebuiltPlanGrid.tsx`<br>`weekly-plan/CustomPlanEditor.tsx` | Unused legacy components still lingering in the codebase. |
| **Naming Collisions** | `components/contribution-graph/Header.tsx`<br>`components/pages/dashboard/Header.tsx` | Two identically named files serving completely different purposes (timeframe switcher vs top app navigation). |
| **CSS Redundancies & Inline Styles** | 7 landing `.css` files, `FreezeModal.tsx`, `anime-checkin.css` | Duplicate `@keyframes` (`shimmer`, `float`, `particle`, `badge-pulse`) and inline `<style>` blocks in components. |
| **Type Safety & Lint Errors** | `utils/api.ts`, `gym-service.ts`, `inventory-service.ts`, `HeroSection.tsx` | 41 ESLint errors, excessive `any` casting, and `react-hooks/set-state-in-effect` runtime hazard in hero typewriter. |

---

## 2. Target Architecture & Component Grouping

```
frontend/
├── app/
│   ├── dashboard/
│   │   ├── page.tsx               # Ultra-clean layout container (~120 lines)
│   │   └── useDashboardState.ts   # Custom hook managing data fetching, timers & modal states
│   └── ...
├── components/
│   ├── ui/                        # Reusable base primitives
│   │   ├── modal-shell.tsx        # Unified Cyberpunk Dialog shell (backdrop, frame, close button, alert bar)
│   │   ├── button.tsx
│   │   ├── tooltip.tsx
│   │   ├── animated-counter.tsx   # Standardized animated score/stat counter
│   │   └── error-banner.tsx       # Standardized alert/error banner
│   ├── contribution-graph/
│   │   ├── ContributionGraphHeader.tsx  # Renamed from Header.tsx (timeframe switcher)
│   │   ├── DayTileTooltip.tsx     # Centralized day tile tooltip used by Year, Month, and Week views
│   │   ├── YearView.tsx
│   │   ├── MonthView.tsx
│   │   ├── WeekView.tsx
│   │   └── theme-utils.ts
│   ├── pages/
│   │   └── dashboard/
│   │       ├── banners/           # All status & warning banners
│   │       │   ├── FrozenStateBanner.tsx
│   │       │   └── StreakRiskWarningBanner.tsx
│   │       ├── modals/            # All dashboard modal workflows
│   │       │   ├── checkin/       # Decomposed DailyCheckInModal components
│   │       │   │   ├── DailyCheckInModal.tsx
│   │       │   │   ├── AnimeCheckInCutscene.tsx
│   │       │   │   ├── LateNightWarningView.tsx
│   │       │   │   ├── CheckInPromptStep.tsx
│   │       │   │   └── WorkoutLogForm.tsx
│   │       │   ├── EditLogModal.tsx
│   │       │   ├── FreezeModal.tsx
│   │       │   ├── StreakBrokenModal.tsx
│   │       │   ├── RestoreConfirmModal.tsx
│   │       │   ├── WeeklyPlanModal.tsx
│   │       │   └── PowerScoreGuideModal.tsx
│   │       ├── toolbar/
│   │       │   └── MockTestingToolbar.tsx # Extracted 365-day test toolbar
│   │       ├── Header.tsx         # Dashboard Top Navigation
│   │       ├── StatsOverview.tsx
│   │       ├── CycleProgressCard.tsx
│   │       ├── ContributionGraph.tsx
│   │       └── ...
├── hooks/                         # Global reusable React hooks
│   ├── useInView.ts               # IntersectionObserver hook
│   ├── useAnimatedCounter.ts      # rAF-based numerical smooth counter
│   ├── useTypewriter.ts           # Clean typewriter hook (fixes setState in effect)
│   └── useMediaQuery.ts
├── lib/
│   ├── date-utils.ts              # Unified date formatting, calculations & lookbacks
│   ├── rarity-theme.ts            # Central item rarity styling & glow tokens
│   ├── power-tier-theme.ts        # Centralized power scoring & character tier styles
│   └── ...
```

---

## 3. Phase-by-Phase Implementation Plan

### Phase 1: Core Primitives, Utilities & Custom Hooks (Foundations)
*Goal: Create shared single sources of truth for dates, rarity themes, power tiers, animation hooks, and modal wrappers.*

- [x] **1.1 Centralize Date Utilities (`lib/date-utils.ts`)**:
  - Implement formatters: `formatDisplayDate`, `formatFullDate`, `formatShortDate`, `formatMonthYear`, `formatTimeRemaining`.
  - Implement date arithmetic: `getStartAndEndOfWeek`, `getDaysDifference`, `isWithinLookbackWindow`.
  - Re-export `formatDateKey` for consistency.
- [x] **1.2 Centralize Item Rarity & Buff Themes (`lib/rarity-theme.ts`)**:
  - Define unified styling maps for `'common' | 'rare' | 'epic' | 'legendary'`.
  - Export `getRarityBorderClass`, `getRarityGlowClass`, `getRarityBadgeClass`, `getRarityTextClass`, `getRarityBackgroundClass`.
- [x] **1.3 Centralize Power Tiers & Color Themes (`lib/power-tier-theme.ts`)**:
  - Merge `getTierColor` (from `ProgressionPath.tsx`) and `getPowerColorTheme` / `getTierParticleColors` (from `power-chart-utils.ts`) into a single unified theme provider.
- [x] **1.4 Create Shared Custom Hooks (`hooks/`)**:
  - `hooks/useInView.ts`: Standalone IntersectionObserver hook with customizable threshold.
  - `hooks/useAnimatedCounter.ts`: Smooth requestAnimationFrame counter with easing.
  - `hooks/useTypewriter.ts`: Pure, glitch-free typewriter hook without cascading setState triggers.
- [x] **1.5 Build Reusable Modal Primitive (`components/ui/modal-shell.tsx`)**:
  - Create `<ModalShell>` supporting standard cyberpunk backdrop, responsive centering, animated scale entrance, top gradient accent bar, close 'X' button, and custom scrollbar handling.
- [x] **1.6 Extract Contribution Graph Tile Tooltip (`components/contribution-graph/DayTileTooltip.tsx`)**:
  - Extract the 40-line duplicated tooltip logic into a clean, reusable component.

---

### Phase 2: Dead Code Elimination, File Renaming & Directory Organization
*Goal: Remove orphaned files, eliminate confusing naming collisions, and group dashboard components logically.*

- [x] **2.1 Delete Dead Code**:
  - Delete `components/pages/dashboard/weekly-plan/PrebuiltPlanGrid.tsx` (unused).
  - Delete `components/pages/dashboard/weekly-plan/CustomPlanEditor.tsx` (unused).
- [x] **2.2 Resolve Naming Collisions**:
  - Rename `components/contribution-graph/Header.tsx` -> `components/contribution-graph/ContributionGraphHeader.tsx`.
  - Update imports in `ContributionGraph.tsx`.
- [x] **2.3 Organize Dashboard Sub-components**:
  - Create `components/pages/dashboard/banners/` for `FrozenStateBanner.tsx` and `StreakRiskWarningBanner.tsx`.
  - Create `components/pages/dashboard/modals/` for all modal components.
  - Create `components/pages/dashboard/toolbar/MockTestingToolbar.tsx`.

---

### Phase 3: Monolith Decomposition & Component Refactoring
*Goal: Break down complex monolithic files into small, focused, maintainable modules.*

- [ ] **3.1 Decompose `DailyCheckInModal.tsx` (583 lines -> 4 focused submodules)**:
  - `components/pages/dashboard/modals/checkin/AnimeCheckInCutscene.tsx`: Handles Yes/No anime cutscene sequences, sound effects, and speed lines.
  - `components/pages/dashboard/modals/checkin/LateNightWarningView.tsx`: Handles >= 11:30 PM midnight risk prompt.
  - `components/pages/dashboard/modals/checkin/CheckInPromptStep.tsx`: Handles Step 1 question & mascot greeting.
  - `components/pages/dashboard/modals/checkin/DailyCheckInModal.tsx`: Slim orchestrator using `<ModalShell>`.
- [ ] **3.2 Refactor Contribution Graph Views (`YearView`, `MonthView`, `WeekView`)**:
  - Replace duplicate tooltip blocks with `<DayTileTooltip>`.
  - Standardize date formatting using `lib/date-utils.ts`.
- [ ] **3.3 Refactor Modals to use `<ModalShell>` and Shared Primitives**:
  - `EditLogModal.tsx`: Use `<ModalShell>` and `lib/date-utils.ts`.
  - `FreezeModal.tsx`: Remove inline `<style>`, use `<ModalShell>`.
  - `StreakBrokenModal.tsx`: Use `<ModalShell>` and `lib/date-utils.ts`.
  - `RestoreConfirmModal.tsx`: Use `<ModalShell>` and `lib/date-utils.ts`.
  - `WeeklyPlanModal.tsx`: Use `<ModalShell>`.
  - `ClaimCelebrationModal.tsx`: Use shared `lib/rarity-theme.ts` and `<ModalShell>`.
  - `PowerLevelCelebrationModal.tsx`: Use `<ModalShell>` and shared hooks.
- [ ] **3.4 Refactor Inventory & Rewards Components**:
  - `InventoryDrawer.tsx`: Use shared `lib/rarity-theme.ts`.
  - `RoadmapMilestoneNode.tsx`: Use shared `lib/rarity-theme.ts`.
  - `ActiveEffectsBar.tsx`: Use shared `lib/rarity-theme.ts`.
- [ ] **3.5 Extract Custom Hook for Dashboard Page (`app/dashboard/useDashboardState.ts`)**:
  - Extract data fetching (`refreshData`), mock data controls (`activateMockData`, `resetToRealData`), backend seeding, snooze timers, and power score calculations from `app/dashboard/page.tsx`.
  - Reduce `app/dashboard/page.tsx` from 703 lines down to a clean declarative layout under 150 lines.

---

### Phase 4: Landing Page, Authentication & CSS Harmonization
*Goal: Fix landing page React effect warnings, unify animations, and clean up auth pages.*

- [ ] **4.1 Fix `HeroSection.tsx` Typewriter & Effect Warning**:
  - Replace manual `setTimeout` state cascading with the new `useTypewriter` hook.
  - Remove unused icon imports (`TrendingUp`, `Activity`).
- [ ] **4.2 Harmonize Landing Page Animated Counters**:
  - In `WhyGymGitSection.tsx`, replace inline `useCounter` with `useAnimatedCounter`.
  - Clean up unused icon imports (`Flame`, `BarChart3`, `Users`, etc.).
- [ ] **4.3 Clean up Unescaped Entities & Lint Warnings**:
  - `TestimonialsSection.tsx`: Fix unescaped quotes in JSX.
  - `MobileFeatureSection.tsx`: Remove unused imports.
- [ ] **4.4 CSS Consolidation**:
  - Centralize repeated keyframes (`badge-pulse`, `shimmer-effect`, `particle-float`) in `app/globals.css`.
  - Remove redundant inline `<style>` tags across components.
- [ ] **4.5 Refactor `app/login/page.tsx`**:
  - Extract form state/handlers or clean up error states and typed error catching.

---

### Phase 5: Type Safety, Linting Zero-Tolerance & Build Verification
*Goal: Eliminate all 41 ESLint errors, remove `any` types, and ensure zero build/runtime regressions.*

- [ ] **5.1 Strict Types in API & Service Layers**:
  - `utils/api.ts`: Replace `any` with generic type parameters (`<T>`) and strict error envelopes.
  - `lib/gym-service.ts`: Type all payload and response objects strictly.
  - `lib/inventory-service.ts`: Type inventory mutation payloads.
  - `lib/scientific-streak.ts`: Fix `prefer-const` and unused variable warnings.
- [ ] **5.2 Strict Error Handling**:
  - Replace `catch (err: any)` with `catch (err: unknown)` using `err instanceof Error ? err.message : '...'` across all modals and service handlers.
- [ ] **5.3 Final Verification Suite**:
  - Run `npm run lint` -> Must finish with **0 errors and 0 warnings**.
  - Run `npm run build` -> Must succeed with zero TypeScript or build errors.
  - Test all interactive workflows: Daily Check-In, Log Edit, Freeze Modal, Streak Broken Recovery, Weekly Plan Modal, Inventory Drawer, and 365-day Mock Suite.

---

## 4. Expected Benefits & Metrics

| Metric | Before Refactor | After Refactor |
| :--- | :--- | :--- |
| **`app/dashboard/page.tsx` Line Count** | 703 lines | ~130 lines (-81%) |
| **`DailyCheckInModal.tsx` Line Count** | 583 lines | ~110 lines (-81%) |
| **Duplicate Tooltip Code** | 3 copies (~120 lines) | 1 reusable component |
| **Duplicate Date Formatter Functions** | 8 separate implementations | 1 centralized utility module |
| **Duplicate Rarity Mappers** | 4 separate implementations | 1 centralized theme module |
| **ESLint Errors & Warnings** | 94 problems (41 errors) | 0 errors, 0 warnings |
| **Dead Files in Repository** | 2 orphaned files | 0 orphaned files |
