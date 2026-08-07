# Scaffolding & Environment Setup: Auth & Backend

> **Feature:** `frontend-auth-and-backend`  
> **Phase:** `00-scaffolding`

---

### Task 0.1: Package Installation & Environment Variable Validation

* **Context Bundle:**
  1. [.agent/rules/01-architecture.md](file:///.agent/rules/01-architecture.md)
  2. [.agent/rules/03-testing-and-errors.md](file:///.agent/rules/03-testing-and-errors.md)
* **Owns:**
  - `package.json`
  - `lib/env.ts`
  - `.env.example` / `.env.local`
* **Forbidden:**
  - `app/globals.css`
  - `components/pages/landing/**`
  - `components/contribution-graph/**`
* **Acceptance Criteria:**
  - **WHEN** the application is started, **THE SYSTEM SHALL** validate the presence of `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_API_URL` through `lib/env.ts`.
  - **WHEN** dependencies are verified, **THE SYSTEM SHALL** ensure `@supabase/ssr` and `@supabase/supabase-js` are installed in `package.json`.
