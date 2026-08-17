# RPG Game Inventory System & Master Item Catalog

> **Feature:** `gamification-and-rewards`  
> **Phase:** `02-inventory-and-items`

---

### Task 2.1: Item Catalog, Inventory Drawer, ItemIcon & Active Buffs HUD

* **Context Bundle:**
  1. [.agent/rules/01-architecture.md](file:///.agent/rules/01-architecture.md)
  2. [.agent/rules/02-code-style.md](file:///.agent/rules/02-code-style.md)
  3. [lib/types.ts](file:///lib/types.ts)
* **Owns:**
  - `lib/inventory-service.ts`
  - `components/inventory/ItemIcon.tsx`
  - `components/inventory/InventoryDrawer.tsx`
  - `components/inventory/ActiveEffectsBar.tsx`
  - `components/pages/dashboard/Header.tsx`
* **Forbidden:**
  - `utils/supabase/**`
  - `app/login/page.tsx`
* **Acceptance Criteria:**
  - **WHEN** user clicks the Inventory quick-access button in Header, **THE SYSTEM SHALL** open the `InventoryDrawer` displaying current item balances in a cyberpunk slot grid.
  - **WHEN** items are rendered in inventory or modals, **THE SYSTEM SHALL** style each slot with distinct rarity borders (`Common`, `Uncommon`, `Rare`, `Epic`, `Legendary`) and stack count badges.
  - **WHEN** user selects an item, **THE SYSTEM SHALL** display the item inspection details and trigger `useInventoryItem()` via `POST /api/v1/inventory/use` upon clicking "USE ITEM".
  - **WHEN** time-based items (XP Boost, Ice Pause) are active, **THE SYSTEM SHALL** display live countdown timers in the `ActiveEffectsBar` HUD at the top of the dashboard.
