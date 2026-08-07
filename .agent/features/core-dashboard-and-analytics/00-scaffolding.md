# Scaffolding & Layout: Core Dashboard & Analytics

> **Feature:** `core-dashboard-and-analytics`  
> **Phase:** `00-scaffolding`

---

### Task 0.1: Main Dashboard Page Structure & Guards

* **Context Bundle:**
  1. [.agent/rules/01-architecture.md](file:///.agent/rules/01-architecture.md)
  2. [.agent/rules/02-code-style.md](file:///.agent/rules/02-code-style.md)
* **Owns:**
  - `app/page.tsx`
  - `components/Header.tsx`
  - `components/Footer.tsx`
  - `components/CyberpunkLoader.tsx`
* **Forbidden:**
  - `components/pages/landing/**`
  - `utils/supabase/**`
* **Acceptance Criteria:**
  - **WHEN** an authenticated user opens `/`, **THE SYSTEM SHALL** render the main Cyber-Fitness dashboard enclosed by `AuthGuard`.
  - **WHEN** data is actively loading from the Go backend, **THE SYSTEM SHALL** render the `CyberpunkLoader` component with loading status text.
