# Next.js Route Protection & Middleware

> **Feature:** `frontend-auth-and-backend`  
> **Phase:** `04-middleware-protection`

---

### Task 4.1: Middleware & Route Guard Implementation

* **Context Bundle:**
  1. [.agent/rules/01-architecture.md](file:///.agent/rules/01-architecture.md)
  2. [utils/supabase/middleware.ts](file:///utils/supabase/middleware.ts)
* **Owns:**
  - `proxy.ts` / `middleware.ts`
  - `components/AuthGuard.tsx`
* **Forbidden:**
  - `components/pages/landing/**`
  - `components/contribution-graph/**`
* **Acceptance Criteria:**
  - **WHEN** an unauthenticated visitor attempts to access protected routes (`/`, `/dashboard`, `/logs`, `/settings`), **THE SYSTEM SHALL** redirect them to `/login`.
  - **WHEN** an authenticated user attempts to access `/login` or `/signup`, **THE SYSTEM SHALL** redirect them to `/`.
  - **WHEN** static assets (`_next/*`, favicon, public media) are requested, **THE SYSTEM SHALL** bypass auth redirection.
