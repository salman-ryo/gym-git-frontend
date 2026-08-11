# Gym-Git Frontend Upgrade Blueprint (CHANGES.md)

> **Document Version:** 2.0.0  
> **Source Specification:** [Specs.md](file:///Specs.md)  
> **Target Scope:** Complete frontend architectural roadmap, new UI components, game-style inventory system, dynamic reward roadmap, streak lifecycle modals, and Go backend API integration.

---

## 1. Executive Summary & Architectural Overview

The backend has been upgraded with a gamified consistency engine featuring **Global Timezone Resolution**, **7-Day Plan Cycles & Rest Tokens**, **Sickness Freeze Vault ("Ice Pause")**, **Master Item Inventory**, **Dynamic Streak Reward Roadmap**, and **Streak Lifecycle Events**. 

This document outlines all frontend changes required to support these features in distinct, verifiable implementation phases.

```text
                               ┌─────────────────────────────────────────┐
                               │             App Entrypoint              │
                               │        [ GET /api/v1/auth/me ]          │
                               │        (Header: X-Timezone)             │
                               └────────────────────┬────────────────────┘
                                                    │
                      ┌─────────────────────────────┴─────────────────────────────┐
                      ▼                                                           ▼
         [ Active Profile & Plan ]                                   [ Streak Lifecycle Events ]
                      │                                                           │
        ┌─────────────┴─────────────┐                           ┌─────────────────┴─────────────────┐
        ▼                           ▼                           ▼                                   ▼
 [ 7-Day Cycle Window ]   [ Inventory & Buffs ]      [ streak_broken_event ]              [ streak_warning_event ]
   • Rest Tokens (x/y)      • Restore Shields          (Show Streak Broken Modal)          (Show Streak Risk Banner)
   • Split Accuracy %       • Freeze Tokens                     │                                   │
   • Queued Plan            • XP Boosts                         ▼                                   ▼
        │                   • Accuracy Charms       [ Redeem Restore Shield ]             [ Log Workout Shortcut ]
        │                           │                           │                                   │
        └───────────────────────────┼───────────────────────────┴───────────────────────────────────┘
                                    ▼
       ┌────────────────────────────────────────────────────────────────────────┐
       │                        Main Dashboard Experience                       │
       │  1. Streak Risk Banner (High Priority Wall-Clock Midnight Warning)     │
       │  2. Active Buffs HUD (Active Freeze Timer / XP Boost Bar)              │
       │  3. 7-Day Cycle & Rest Token Progress Card                             │
       │  4. Contribution Heatmap (Vibrant Green, Icy Blue Frost, Slate Rest)   │
       │  5. Interactive Streak Reward Roadmap (Locked / Claimable / Claimed)   │
       │  6. RPG Game Inventory Drawer (Slot Grid, Rarity Borders, Item Actions)│
       │  7. Streak Broken Recovery Modal (Shield Redemption / Roadmap Route)   │
       └────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Phase-by-Phase Implementation Plan

---

### Phase 1: Foundation, Types, API Client & Global Timezone Engine

#### Goals
- Establish strict TypeScript interfaces for all new backend models (Cycles, Inventory, Items, Roadmap, Lifecycle Events).
- Inject `X-Timezone` header automatically on all backend API requests via [utils/api.ts](file:///utils/api.ts).
- Update [lib/auth-context.tsx](file:///lib/auth-context.tsx) and [lib/gym-service.ts](file:///lib/gym-service.ts) to hydrate lifecycle events and cycle data.

#### Tasks & File Changes
1. **[lib/types.ts](file:///lib/types.ts)**:
   - Define `CycleInfo`:
     - `cycle_start_date: string`
     - `cycle_end_date: string`
     - `workouts_completed_in_cycle: number`
     - `workouts_target_in_cycle: number`
     - `rest_tokens_total: number`
     - `rest_tokens_used: number`
     - `rest_tokens_remaining: number`
     - `days_remaining_in_cycle: number`
   - Define `StreakBrokenEvent`:
     - `previous_streak: number`
     - `broken_on: string`
     - `restore_shield_available: boolean`
     - `restore_shields_count: number`
     - `can_restore_until: string`
   - Define `StreakWarningEvent`:
     - `is_at_risk: boolean`
     - `hours_remaining: number`
     - `rest_tokens_left: number`
     - `message: string`
   - Define `ItemCatalogItem`:
     - `item_id: 'RESTORE_SHIELD' | 'STREAK_FREEZE_TOKEN' | 'XP_BOOST' | 'ACCURACY_CHARM'`
     - `name: string`
     - `effect_type: 'INSTANT_USE' | 'TIME_BASED'`
     - `duration_seconds: number`
     - `description: string`
     - `rarity: 'common' | 'rare' | 'epic' | 'legendary'`
     - `icon: string`
   - Define `UserInventoryItem`:
     - `item_id: string`
     - `quantity: number`
     - `item_details: ItemCatalogItem`
   - Define `ActiveItemEffect`:
     - `item_id: string`
     - `activated_at: string`
     - `expires_at: string`
     - `remaining_seconds: number`
   - Define `RoadmapMilestone`:
     - `milestone_id: string`
     - `plan_id: string`
     - `streak_target: number`
     - `item_id: string`
     - `item_name: string`
     - `item_icon: string`
     - `rarity: string`
     - `quantity: number`
     - `title: string`
     - `description: string`
     - `badge_slug: string`
     - `status: 'LOCKED' | 'CLAIMABLE' | 'CLAIMED'`
     - `claimed_at?: string`
2. **[utils/api.ts](file:///utils/api.ts)**:
   - Detect user's local IANA timezone using `Intl.DateTimeFormat().resolvedOptions().timeZone`.
   - Append `X-Timezone: <user_timezone>` header to all outgoing requests.
3. **[lib/gym-service.ts](file:///lib/gym-service.ts)**:
   - Update `fetchDashboardStats` and add `fetchStreakLifecycle` to retrieve cycle info, accuracy score, freeze status, and lifecycle events (`streak_broken_event`, `streak_warning_event`).

---

### Phase 2: 7-Day Plan Cycles, Rest Tokens & Accuracy Score UI

#### Goals
- Render the discrete 7-day cycle progression widget.
- Display Rest Token consumption (`rest_tokens_used` / `rest_tokens_total`) with visually distinct active/consumed indicators.
- Display the Split Accuracy Score (0–100%) and Queued Plan banner if a plan modification is pending for next cycle.

#### New & Modified Components
1. **[NEW] `components/pages/dashboard/CycleProgressCard.tsx`**:
   - Visual 7-day cycle tracker showing dates (`cycle_start_date` to `cycle_end_date`).
   - Progress bar of completed workouts vs target workouts (e.g. `3 / 4 Workouts Completed`).
   - Rest Token Pods: Interactive pill/capsule icons displaying remaining tokens (e.g., 🛡️ Rest Token: 2 / 3 Left).
   - Split Accuracy Ring/Gauge: Cyberpunk percentage meter (0-100%).
   - Queued Plan Indicator: Alerts user when a new split is queued for activation at the next cycle reset.
2. **[MODIFY] [components/pages/dashboard/StatsOverview.tsx](file:///components/pages/dashboard/StatsOverview.tsx)**:
   - Integrate `CycleProgressCard` metrics into top dashboard analytics.

---

### Phase 3: RPG Game Inventory System & Master Item Catalog

#### Goals
- Build a game-style inventory interface (modal/drawer) with a slot grid, item rarities, stack counts, and action popups.
- Implement icons for all items now, architected for drop-in high-res game art later.
- Provide real-time inventory management (`GET /api/v1/inventory`, `POST /api/v1/inventory/use`).
- Build an **Active Buffs HUD bar** to display active time-based effects (Freeze timer, XP Boost countdown).

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        CYBERPUNK USER INVENTORY                        │
│ ┌───────────────┐ ┌───────────────┐ ┌───────────────┐ ┌──────────────┐ │
│ │ Restore Shield│ │ Freeze Token  │ │ XP Boost (7d) │ │Accuracy Charm│ │
│ │   [🛡️ ICON]   │ │   [❄️ ICON]   │ │   [⚡ ICON]   │ │  [🎯 ICON]  │ │
│ │     x3        │ │     x2        │ │     x1        │ │    x1        │ │
│ │    (RARE)     │ │    (RARE)     │ │    (EPIC)     │ │  (UNCOMMON)  │ │
│ └───────────────┘ └───────────────┘ └───────────────┘ └──────────────┘ │
│                                                                        │
│ Selected: Streak Freeze Token                                          │
│ Effect: Pauses streak decay for 24 hours without breaking streak.      │
│ [ USE ITEM (CONSUME 1) ]                      [ CLOSE INVENTORY ]      │
└────────────────────────────────────────────────────────────────────────┘
```

#### New & Modified Components
1. **[NEW] `lib/inventory-service.ts`**:
   - `fetchItemCatalog()`: Calls `GET /api/v1/items`.
   - `fetchUserInventory()`: Calls `GET /api/v1/inventory`.
   - `useInventoryItem(itemId, quantity, payload)`: Calls `POST /api/v1/inventory/use`.
2. **[NEW] `components/inventory/ItemIcon.tsx`**:
   - Renders current Lucide icons with customized cyberpunk gradient glow frames and rarity badges (`RESTORE_SHIELD` $\rightarrow$ Shield, `STREAK_FREEZE_TOKEN` $\rightarrow$ Snowflake, `XP_BOOST` $\rightarrow$ Zap, `ACCURACY_CHARM` $\rightarrow$ Target).
   - Supports seamless fallback to custom image assets (PNG/SVG/WebP) via `imageSrc` prop when custom artwork is uploaded.
3. **[NEW] `components/inventory/InventoryDrawer.tsx` / `components/inventory/InventoryModal.tsx`**:
   - RPG-style inventory slot grid (4x2 or 4x3 responsive slots).
   - Rarity border styling (Common: Slate, Rare: Cyan, Epic: Purple, Legendary: Amber).
   - Stack count badges on top-right of each slot (e.g. `x3`).
   - Selected item detail inspector panel showing item name, description, duration, and instant **"USE ITEM"** action button.
   - Confirmation dialog for consuming high-value tokens.
4. **[NEW] `components/inventory/ActiveEffectsBar.tsx`**:
   - Top HUD widget displaying active buffs with live countdown timers (e.g., ❄️ Ice Pause Active: 18h 24m remaining | ⚡ XP Boost: 5d remaining).
5. **[MODIFY] [components/pages/dashboard/Header.tsx](file:///components/pages/dashboard/Header.tsx)**:
   - Add an **Inventory Quick Access Button** with an item count notification badge.

---

### Phase 4: Sickness Freeze Vault ("Ice Pause") & Manual Control

#### Goals
- Allow users to activate Sickness / Injury Freeze via `POST /api/v1/streak/freeze` or inventory consumption.
- **Strict No-Auto-Unfreeze Rule Compliance**: App visit, login, and stats checking MUST NEVER automatically unfreeze the streak.
- Provide explicit manual unfreeze action (`POST /api/v1/streak/unfreeze`).
- Display icy cyberpunk visuals across the dashboard when `is_frozen == true`.

#### New & Modified Components
1. **[NEW] `components/pages/dashboard/FreezeModal.tsx`**:
   - Modal allowing user to select freeze duration (e.g. 1 to 7 days based on available tokens) and optional reason (e.g., "Flu recovery", "Shoulder injury").
   - Confirmation button to activate "Ice Pause".
2. **[NEW] `components/pages/dashboard/FrozenStateBanner.tsx`**:
   - High-visibility icy blue glassmorphism banner when streak is frozen.
   - Informs user: `"Ice Pause Active — Streak decay is paused. Your streak is safe."`
   - Includes **"Resume Streak (Unfreeze)"** manual action button with confirmation prompt.
3. **[NEW] `lib/streak-service.ts`**:
   - `freezeStreak(durationDays, reason)`: Calls `POST /api/v1/streak/freeze`.
   - `unfreezeStreak()`: Calls `POST /api/v1/streak/unfreeze`.
   - `restoreStreak(targetDate, workoutType, hours)`: Calls `POST /api/v1/streak/restore`.

---

### Phase 5: Dynamic Streak Reward Roadmap System

#### Goals
- Render an interactive, gamified progression roadmap timeline (`GET /api/v1/rewards/roadmap`).
- Support 3 milestone states:
  - `LOCKED`: Greyed out with lock icon and streak target requirement.
  - `CLAIMABLE`: Radiant glowing border, pulse animation, and prominent **"CLAIM REWARD"** button.
  - `CLAIMED`: Success checkmark with claimed timestamp tooltip.
- Claiming rewards (`POST /api/v1/rewards/claim`):
  - Particle celebration / reward drop modal.
  - Live inventory increment.
- Support dynamic milestone additions from backend admin CRUD.

```text
  [Day 3] ─────── [Day 7] ─────── [Day 10] ─────── [Day 14] ─────── [Day 30]
 (CLAIMED)       (CLAIMED)      (CLAIMABLE)       (LOCKED)        (LOCKED)
    ✓               ✓            [CLAIM 🎁]          🔒              🔒
+1 Accuracy     +1 Shield       +1 Freeze        +1 Shield       +5 Shields
```

#### New & Modified Components
1. **[NEW] `lib/rewards-service.ts`**:
   - `fetchRewardRoadmap(planId?)`: Calls `GET /api/v1/rewards/roadmap`.
   - `claimReward(planId, streakTarget, itemId)`: Calls `POST /api/v1/rewards/claim`.
2. **[NEW] `components/rewards/RewardRoadmap.tsx`**:
   - Progression timeline path with responsive horizontal scrolling or vertical layout.
   - Dynamic connector progress line showing current longest streak vs milestone targets.
   - Milestone nodes with item icons, rarity glow, quantity badges, and status indicators.
3. **[NEW] `components/rewards/RoadmapMilestoneNode.tsx`**:
   - Individual milestone card component handling `LOCKED`, `CLAIMABLE`, and `CLAIMED` states.
   - Animated **"CLAIM"** button triggering claim API and reward celebration.
4. **[NEW] `components/rewards/ClaimCelebrationModal.tsx`**:
   - Fullscreen celebratory modal showcasing claimed item drop, quantity, description, and "View in Inventory" CTA.

---

### Phase 6: Streak Lifecycle Events, Broken Recovery Modal & Risk Warning

#### Goals
- Detect `streak_broken_event` upon bootstrap or stats fetch:
  - If `restore_shield_available == true`: Prompt user to redeem Restore Shield instantly (`POST /api/v1/streak/restore`), revive streak, and celebrate.
  - If `restore_shield_available == false`: Show roadmap shortcut to earn/claim Restore Shields.
- Detect `streak_warning_event`:
  - Show ambient warning banner when rest tokens are exhausted and user is at risk before local midnight.

#### New & Modified Components
1. **[NEW] `components/pages/dashboard/StreakBrokenModal.tsx`**:
   - High-impact modal triggered when `streak_broken_event != null`.
   - Displays previous streak length (e.g. `"14-Day Streak Lost!"`).
   - If user has shields: Show `"Use Restore Shield (x available)"` $\rightarrow$ executes restore and triggers revival animation.
   - If 0 shields: Show `"Open Reward Roadmap"` button to unlock shields.
2. **[NEW] `components/pages/dashboard/StreakRiskWarningBanner.tsx`**:
   - High-priority pulsing amber/red alert banner at top of dashboard.
   - Displays wall-clock countdown to local midnight and remaining rest tokens.
   - Direct CTA: `"Log Workout Now"` (opens Daily Check-In modal).

---

### Phase 7: Contribution Heatmap Visual Refactor & Color Themes

#### Goals
- Upgrade [components/contribution-graph/](file:///components/contribution-graph/) across YearView, MonthView, and WeekView.
- Implement distinctive tile aesthetics:
  - **Active Workout Day:** Dark to vibrant green gradient (`#166534` to `#22c55e`).
  - **Frozen Day ("Ice Pause"):** Distinct icy blue frost tile (`#38bdf8` with subtle snowflake overlay / frost glow).
  - **Rest Token Day:** Neutral slate indicator (`#334155`).
  - **Missed Day:** Default dark tile (`#0d1117`).
- Update tooltip utilities to render cycle details and freeze annotations.

#### Modified Files
1. **[components/contribution-graph/theme-utils.ts](file:///components/contribution-graph/theme-utils.ts)**: Add tile theme color resolvers for `frozen` and `rest_token` states.
2. **[components/contribution-graph/YearView.tsx](file:///components/contribution-graph/YearView.tsx)**, **[MonthView.tsx](file:///components/contribution-graph/MonthView.tsx)**, **[WeekView.tsx](file:///components/contribution-graph/WeekView.tsx)**: Render frost/rest icon indicators within tiles.

---

### Phase 8: End-to-End Dashboard Assembly, Mock Testing & Verification

#### Goals
- Integrate all new components into [app/dashboard/page.tsx](file:///app/dashboard/page.tsx).
- Update [lib/mock-data-generator.ts](file:///lib/mock-data-generator.ts) to simulate roadmap milestones, inventory balances, freeze states, and broken streak events.
- Perform strict TypeScript compilation, linting, and manual validation.

---

## 3. Comprehensive Component & File Inventory

| Path | Type | Responsibility |
| :--- | :--- | :--- |
| **`lib/types.ts`** | Modify | TypeScript definitions for Cycles, Items, Inventory, Roadmap, Lifecycle Events |
| **`lib/inventory-service.ts`** | New | API calls for `/items`, `/inventory`, `/inventory/use` |
| **`lib/rewards-service.ts`** | New | API calls for `/rewards/roadmap`, `/rewards/claim` |
| **`lib/streak-service.ts`** | New | API calls for `/streak/restore`, `/streak/freeze`, `/streak/unfreeze` |
| **`utils/api.ts`** | Modify | Automatic `X-Timezone` header injection & session token handling |
| **`components/inventory/ItemIcon.tsx`** | New | Lucide icon wrapper with cyberpunk frames & future image fallback |
| **`components/inventory/InventoryDrawer.tsx`** | New | RPG game-style inventory drawer & slot grid |
| **`components/inventory/ActiveEffectsBar.tsx`** | New | HUD bar displaying active time-based buffs with countdowns |
| **`components/rewards/RewardRoadmap.tsx`** | New | Interactive progression roadmap timeline component |
| **`components/rewards/RoadmapMilestoneNode.tsx`** | New | Individual milestone node (Locked, Claimable, Claimed) |
| **`components/rewards/ClaimCelebrationModal.tsx`** | New | Celebratory item drop popup upon reward claim |
| **`components/pages/dashboard/CycleProgressCard.tsx`** | New | 7-day plan cycle, rest token pods, and accuracy score widget |
| **`components/pages/dashboard/StreakBrokenModal.tsx`** | New | Modal for streak revival via Restore Shield redemption |
| **`components/pages/dashboard/StreakRiskWarningBanner.tsx`** | New | Wall-clock midnight risk warning banner |
| **`components/pages/dashboard/FrozenStateBanner.tsx`** | New | Icy blue banner with manual unfreeze action |
| **`components/pages/dashboard/FreezeModal.tsx`** | New | Modal to configure and activate streak freeze |
| **`components/contribution-graph/theme-utils.ts`** | Modify | Tile color resolvers for frozen (icy blue) and rest token states |
| **`app/dashboard/page.tsx`** | Modify | Master dashboard layout wiring all new widgets and modals |

---

## 4. UI/UX Game Inventory & Roadmap Design Standards

1. **Inventory Slot Grid:**
   - Dark translucent glass background (`bg-zinc-950/80 backdrop-blur-xl`).
   - Rarity borders:
     - **Common:** `border-zinc-700`
     - **Uncommon:** `border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]`
     - **Rare:** `border-neon-cyan/60 shadow-[0_0_15px_rgba(34,211,238,0.25)]`
     - **Epic:** `border-neon-purple/70 shadow-[0_0_20px_rgba(168,85,247,0.3)]`
     - **Legendary:** `border-amber-400/80 shadow-[0_0_25px_rgba(251,191,36,0.4)]`
   - Stack counter: Bold neon green/cyan badge pinned to slot top-right (`text-[10px] font-black`).
2. **Item Icons & Asset Readiness:**
   - Lucide icons mapped to items (`Shield`, `Snowflake`, `Zap`, `Target`).
   - Encapsulated in `<ItemIcon itemId={id} />` with an image path fallback (`/images/items/${itemId.toLowerCase()}.png`).
3. **Roadmap Nodes:**
   - `LOCKED`: Dimmed slate border, lock icon, muted opacity (`opacity-60 grayscale`).
   - `CLAIMABLE`: Pulsing gradient border, glowing drop shadow, animated badge, and vibrant **"CLAIM"** button.
   - `CLAIMED`: Subdued border, checkmark icon, timestamp label.
4. **Animations:**
   - Smooth entry transitions via Tailwind CSS (`transition-all duration-300`).
   - Pulse animations for at-risk warnings and claimable rewards (`animate-pulse`).

---

## 5. Verification & Testing Checklist

- [ ] **Timezone Header**: Verify `X-Timezone` header is sent with every request in Network DevTools.
- [ ] **Cycle & Rest Tokens**: Verify 7-day cycle dates, rest tokens remaining, and accuracy score match backend responses.
- [ ] **Inventory System**:
  - [ ] Master catalog loads from `/api/v1/items`.
  - [ ] User inventory loads from `/api/v1/inventory`.
  - [ ] Consuming an item sends `POST /api/v1/inventory/use` and decrements balance.
  - [ ] Active effects bar displays live countdown.
- [ ] **Freeze Engine**:
  - [ ] Activating freeze sets `is_frozen = true` and shows icy blue dashboard theme.
  - [ ] Verify visiting the app does **NOT** auto-unfreeze.
  - [ ] Clicking manual unfreeze calls `POST /api/v1/streak/unfreeze` and restores normal theme.
- [ ] **Reward Roadmap**:
  - [ ] Roadmap renders milestones with proper `LOCKED`, `CLAIMABLE`, `CLAIMED` states.
  - [ ] Clicking "CLAIM" calls `POST /api/v1/rewards/claim`, triggers celebration modal, and adds item to inventory.
- [ ] **Streak Broken Modal**:
  - [ ] Modal triggers when `streak_broken_event` is present.
  - [ ] Redeeming shield calls `POST /api/v1/streak/restore` and updates streak.
- [ ] **Streak Risk Warning**:
  - [ ] Banner appears when `is_at_risk == true` with hours remaining until midnight.
- [ ] **Contribution Heatmap**:
  - [ ] Renders green tiles for workouts, icy blue for frozen days, and slate for rest token days.
- [ ] **Build & Quality**:
  - [ ] `npm run lint` passes with 0 errors.
  - [ ] `npm run build` succeeds cleanly.
