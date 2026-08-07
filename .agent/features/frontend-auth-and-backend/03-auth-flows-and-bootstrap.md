# Authentication Flows & Backend Bootstrap Handshake

> **Feature:** `frontend-auth-and-backend`  
> **Phase:** `03-auth-flows-and-bootstrap`

---

### Task 3.1: Sign Up, Sign In & Go Backend Bootstrap

* **Context Bundle:**
  1. [.agent/rules/01-architecture.md](file:///.agent/rules/01-architecture.md)
  2. [FRONTEND_AUTH_SPEC.md](file:///FRONTEND_AUTH_SPEC.md)
  3. [lib/types.ts](file:///lib/types.ts)
* **Owns:**
  - `lib/auth-context.tsx`
  - `app/login/page.tsx`
  - `app/auth/callback/route.ts`
* **Forbidden:**
  - `components/pages/landing/**`
  - `components/weekly-plan/**`
* **Acceptance Criteria:**
  - **WHEN** a user logs in or registers via email/password or Google OAuth, **THE SYSTEM SHALL** call `POST /api/v1/auth/bootstrap` with `{ selectedPlanId: "ppl-standard" }` using the Supabase JWT.
  - **WHEN** bootstrap succeeds, **THE SYSTEM SHALL** call `GET /api/v1/auth/me` to hydrate the global user profile and active weekly plan in `AuthContext`.
  - **WHEN** `logout()` is invoked, **THE SYSTEM SHALL** execute `supabase.auth.signOut()`, notify the backend via `POST /api/v1/auth/logout`, clear local user state, and redirect to `/login`.
