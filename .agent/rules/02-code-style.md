# Code Style & UI Conventions

> **Rule ID:** `02-code-style`  
> **Applicable Globs:** `components/**`, `app/**`, `lib/**`

---

## 1. Directory Structure & Component Organization

```text
frontend/
├── app/                  # Next.js App Router (pages, layout, loading, error)
│   ├── auth/callback/    # OAuth callback handler
│   ├── login/            # Dedicated sign-in & sign-up page
│   ├── globals.css       # Central Tailwind v4 theme, variables & keyframes
│   ├── dashboard/        # Dashboard route
│   └── page.tsx          # Main Dashboard entry point
├── components/           # Reusable UI & Feature-specific components
│   ├── ui/               # Base primitives (dialog, button, tooltip)
│   ├── contribution-graph/ # Year, Month, Week heatmap views & theme-utils
│   ├── inventory/        # RPG InventoryDrawer, ItemIcon, ActiveEffectsBar
│   ├── pages/
│   │   ├── dashboard/    # Dashboard widgets, CycleProgressCard, FreezeModal, etc.
│   │   │   └── rewards/  # RewardRoadmap, RoadmapMilestoneNode, ClaimCelebrationModal
│   │   └── landing/      # Landing page sections (Hero, Navbar, Why, CTA, etc.)
│   ├── power-level/      # Power score charts & breakdowns
│   ├── power-score-guide/ # Tier progression & scoring metrics
│   └── weekly-plan/      # Prebuilt & custom workout plan selectors
├── lib/                  # Application state, context, types, domain logic
│   ├── auth-context.tsx  # Global Auth provider & session sync
│   ├── gym-service.ts    # Go backend service methods
│   ├── inventory-service.ts # Item catalog & inventory API calls
│   ├── rewards-service.ts# Reward roadmap & claim API calls
│   ├── streak-service.ts # Streak restore, freeze & unfreeze API calls
│   ├── scientific-power.ts # Power score calculation algorithms
│   ├── scientific-streak.ts# Streak & rest day analysis
│   └── types.ts          # Core domain TypeScript interfaces
└── utils/                # Supabase & API utility clients
    ├── api.ts            # Centralized API fetch wrapper with JWT & timezone injection
    └── supabase/         # Client, Server, and Middleware Supabase helpers
```

---

## 2. TypeScript & Code Standards

1. **Strict Types:** Always define explicit interfaces in [lib/types.ts](file:///lib/types.ts) or local component props interfaces. Avoid `any` except where parsing heterogeneous third-party payloads before validation.
2. **Client Boundaries:** Add `'use client';` at the top of files that utilize hooks (`useState`, `useEffect`, `useCallback`, `useContext`) or browser-only APIs.
3. **No Unused Imports / Lint Compliance:** Run `npm run lint` and verify clean builds before committing.
4. **Clean Async/Await:** Prefer async/await over raw `.then()/.catch()` chains.

---

## 3. Tailwind CSS v4 & Styling Guidelines

### A. Theme Variables in [app/globals.css](file:///app/globals.css)
* The project uses Tailwind CSS v4 `@theme inline` with CSS variable bindings:
  * Brand Primary: `--neon-green` (`rgb(0, 255, 136)`) -> `text-neon-green`, `bg-neon-green`.
  * Brand Secondary: `--neon-cyan` (`rgb(34, 211, 238)`) -> `text-neon-cyan`, `bg-neon-cyan`.
  * Brand Accent: `--neon-purple` (`rgb(168, 85, 247)`) -> `text-neon-purple`, `bg-neon-purple`.

### B. Aesthetic Guidelines (Cyber-Fitness & Glassmorphism)
* **Background:** Deep dark canvas (`bg-zinc-950` / `bg-zinc-900/80`).
* **Glass Cards:** High-translucency containers with subtle border highlights (`bg-zinc-900/80 backdrop-blur-xl border border-zinc-800 rounded-2xl`).
* **Hover Accents:** Smooth transitions with cyan/purple glow effects (`hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300`).
* **Interactive Elements:** Ensure buttons, links, and switches have explicit pointer cursor and hover states.

### C. RPG Item Inventory & Rarity Standards
* **Common:** `border-zinc-700 bg-zinc-900/60`
* **Uncommon:** `border-emerald-500/50 shadow-[0_0_10px_rgba(16,185,129,0.2)]`
* **Rare:** `border-cyan-400/60 shadow-[0_0_15px_rgba(34,211,238,0.25)]`
* **Epic:** `border-purple-500/70 shadow-[0_0_20px_rgba(168,85,247,0.3)]`
* **Legendary:** `border-amber-400/80 shadow-[0_0_25px_rgba(251,191,36,0.4)]`
* **Stack Counter:** Neon green/cyan badge pinned top-right (`text-[10px] font-black`).

### D. Contribution Heatmap Tile Aesthetic
* **Active Workout:** Vibrant green gradient ramp (`#166534` to `#22c55e`).
* **Frozen Day ("Ice Pause"):** Icy blue frost tile (`#38bdf8` with subtle frost glow).
* **Rest Token Day:** Neutral slate indicator (`#334155`).
* **Missed Day:** Deep dark canvas (`#0d1117`).
