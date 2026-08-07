# Gym-Git Context Index & Feature Router

> **Central Context Gateway**: Map file paths, globs, task types, and features directly to rule definitions and phase files.

---

## 1. Project Rules Router

| Task Category / Path Glob | Applicable Rule File | Core Responsibility |
| :--- | :--- | :--- |
| **Global Architecture & Backend** (`app/**`, `utils/api.ts`, `utils/supabase/**`, `lib/**`) | [.agent/rules/01-architecture.md](file:///.agent/rules/01-architecture.md) | Next.js 16 App Router, Supabase Auth SSR, Go/Gin backend integration, environment config |
| **Styling & Components** (`app/globals.css`, `components/**`, `app/**/*.tsx`) | [.agent/rules/02-code-style.md](file:///.agent/rules/02-code-style.md) | Tailwind CSS v4 `@theme inline`, design tokens, glassmorphism, responsive patterns, component conventions |
| **Testing, Error Handling & API Envelope** (`utils/api.ts`, `components/AuthGuard.tsx`, modals, handlers) | [.agent/rules/03-testing-and-errors.md](file:///.agent/rules/03-testing-and-errors.md) | Standard `ApiErrorEnvelope`, HTTP 401 handling, session refresh, error boundaries, validation |

---

## 2. Feature Workspaces & State Trackers

| Feature | Directory | Description & Current State |
| :--- | :--- | :--- |
| **1. Frontend Auth & Backend Integration** | [.agent/features/frontend-auth-and-backend/](file:///.agent/features/frontend-auth-and-backend/) | Supabase SSR cookie session, Go backend `/api/v1/auth/bootstrap` & `/api/v1/auth/me`, API Client wrapper, route middleware. [View STATE.md](file:///.agent/features/frontend-auth-and-backend/STATE.md) |
| **2. Landing Page & CSS Refactoring** | [.agent/features/landing-and-css-refactor/](file:///.agent/features/landing-and-css-refactor/) | Modern neon cyber-fitness landing page, Tailwind v4 theme consolidation, component refactoring into `app/globals.css`. [View STATE.md](file:///.agent/features/landing-and-css-refactor/STATE.md) |
| **3. Core Dashboard & Analytics** | [.agent/features/core-dashboard-and-analytics/](file:///.agent/features/core-dashboard-and-analytics/) | Multi-view contribution graph (Year/Month/Week), scientific power scoring, daily check-in modal, weekly plan selector. [View STATE.md](file:///.agent/features/core-dashboard-and-analytics/STATE.md) |

---

## 3. Master Operating Procedures (MOP) Quick Reference

1. **Context Read:** Read ONLY this index and the target feature's `STATE.md` to identify the required 2–3 context files.
2. **No Ghosting:** Write full, production-ready code. No `TODO` comments or empty stubs.
3. **Circuit Breaker:** If 3 consecutive attempts fail, revert to last known working state, log in `STATE.md`, and request user assistance.
4. **Post-Execution Hook (MANDATORY):** Mark tasks `[x]` in `STATE.md` and append a timestamped log to the execution table before finishing.
