# Supabase SSR & Cookie Management

> **Feature:** `frontend-auth-and-backend`  
> **Phase:** `01-supabase-ssr-cookies`

---

### Task 1.1: Supabase SSR Client Suite Implementation

* **Context Bundle:**
  1. [.agent/rules/01-architecture.md](file:///.agent/rules/01-architecture.md)
  2. [FRONTEND_AUTH_SPEC.md](file:///FRONTEND_AUTH_SPEC.md)
* **Owns:**
  - `utils/supabase/client.ts`
  - `utils/supabase/server.ts`
  - `utils/supabase/middleware.ts`
* **Forbidden:**
  - `components/pages/landing/**`
  - `components/power-level/**`
* **Acceptance Criteria:**
  - **WHEN** client-side components call `createClient()` from `utils/supabase/client.ts`, **THE SYSTEM SHALL** return a memoized browser-compatible Supabase client.
  - **WHEN** server components access `createClient()` in `utils/supabase/server.ts`, **THE SYSTEM SHALL** read and mutate cookies using Next.js `cookies()` storage adapter.
  - **WHEN** requests transit through `updateSession()`, **THE SYSTEM SHALL** refresh user session tokens and forward updated cookies in response headers.
