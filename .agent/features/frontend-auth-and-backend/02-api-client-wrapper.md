# Centralized API Client Wrapper

> **Feature:** `frontend-auth-and-backend`  
> **Phase:** `02-api-client-wrapper`

---

### Task 2.1: Intercepted API Wrapper with JWT Injection

* **Context Bundle:**
  1. [.agent/rules/01-architecture.md](file:///.agent/rules/01-architecture.md)
  2. [.agent/rules/03-testing-and-errors.md](file:///.agent/rules/03-testing-and-errors.md)
* **Owns:**
  - `utils/api.ts`
* **Forbidden:**
  - `components/ui/**`
  - `app/layout.tsx`
* **Acceptance Criteria:**
  - **WHEN** any request is executed via `api.get`, `api.post`, `api.put`, or `api.delete`, **THE SYSTEM SHALL** automatically fetch the current Supabase session token and attach `Authorization: Bearer <token>`.
  - **WHEN** the backend returns an envelope `{ success: true, data: T }`, **THE SYSTEM SHALL** unwrap and directly return `data`.
  - **WHEN** the backend responds with HTTP 401, **THE SYSTEM SHALL** throw an `ApiError` with code `UNAUTHORIZED` without forcing an uncoordinated signOut.
