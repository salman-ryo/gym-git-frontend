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
│   └── page.tsx          # Main Dashboard entry point
├── components/           # Reusable UI & Feature-specific components
│   ├── ui/               # Base primitives (dialog, button, tooltip)
│   ├── contribution-graph/ # Year, Month, Week heatmap views
│   ├── power-level/      # Power score charts & breakdowns
│   ├── power-score-guide/ # Tier progression & scoring metrics
│   ├── weekly-plan/      # Prebuilt & custom workout plan selectors
│   └── pages/landing/    # Landing page sections (Hero, Navbar, Why, CTA, etc.)
├── lib/                  # Application state, context, types, domain logic
│   ├── auth-context.tsx  # Global Auth provider & session sync
│   ├── gym-service.ts    # Go backend service methods
│   ├── scientific-power.ts # Power score calculation algorithms
│   ├── scientific-streak.ts# Streak & rest day analysis
│   └── types.ts          # Core domain TypeScript interfaces
└── utils/                # Supabase & API utility clients
    ├── api.ts            # Centralized API fetch wrapper with JWT injection
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
