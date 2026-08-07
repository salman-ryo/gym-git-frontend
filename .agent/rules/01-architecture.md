# Architecture & Infrastructure Specification

> **Rule ID:** `01-architecture`  
> **Applicable Globs:** `app/**`, `utils/**`, `lib/**`, `proxy.ts`, `middleware.ts`

---

## 1. Technology Stack

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router) | React 19, Server & Client Components (`'use client'`) |
| **Language** | TypeScript 5+ | Strict type checking enabled, no implicit `any` |
| **Identity Provider** | Supabase Auth | `@supabase/ssr` with HttpOnly cookie sessions |
| **Custom Backend** | Go / Gin REST API | Running locally at `http://localhost:8080/api/v1` (or `NEXT_PUBLIC_API_URL`) |
| **Database** | PostgreSQL | Managed via Go backend models (Users, Logs, Plans, Stats) |
| **Styling** | Tailwind CSS v4 | `@tailwindcss/postcss`, CSS Variables, Radix UI |
| **Deployment / CI** | Vercel / Docker | Local dev via `npm run dev`, production builds via `npm run build` |

---

## 2. Environment Variables & Configuration

All environment variables are validated through [lib/env.ts](file:///lib/env.ts):

* `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL (e.g., `https://xyz.supabase.co`).
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase public anonymous API key.
* `NEXT_PUBLIC_API_URL`: Custom Go backend API base URL (defaults to `http://localhost:8080/api/v1`).

---

## 3. Authentication & Cookie Architecture

### A. `@supabase/ssr` Cookie Clients
1. **Browser Client** ([utils/supabase/client.ts](file:///utils/supabase/client.ts)):
   - Singleton instance for client-side interactions (sign in, sign up, OAuth).
2. **Server Component Client** ([utils/supabase/server.ts](file:///utils/supabase/server.ts)):
   - Uses `next/headers` `cookies()` with `getAll()` and `setAll()` to read and persist tokens securely.
3. **Middleware Client** ([utils/supabase/middleware.ts](file:///utils/supabase/middleware.ts) / [proxy.ts](file:///proxy.ts)):
   - Refreshes session tokens on every navigation request to prevent stale sessions.

### B. Custom Go Backend Bootstrap Handshake
* **The Problem:** Supabase handles identity, but the application data (workout logs, stats, weekly plans) resides in the custom Go PostgreSQL backend.
* **The Bootstrap Contract:**
  1. User authenticates via Supabase (`signInWithPassword`, `signUp`, or `signInWithOAuth`).
  2. Frontend immediately calls `POST /api/v1/auth/bootstrap` with payload `{ selectedPlanId: "ppl-standard" }` and header `Authorization: Bearer <supabase_access_token>`.
  3. Go backend idempotently creates or verifies the `users` table record and assigns the initial plan.
  4. Frontend calls `GET /api/v1/auth/me` to hydrate global user state in [lib/auth-context.tsx](file:///lib/auth-context.tsx).

---

## 4. API Client Wrapper Pattern ([utils/api.ts](file:///utils/api.ts))

All communication with the Go backend **MUST** pass through the centralized `apiFetch` / `api` helper:
1. **Base URL Resolution:** Automatically strips trailing slashes and prefixes endpoints.
2. **Automatic Token Injection:** Retrieves active Supabase JWT session and attaches `Authorization: Bearer <token>`.
3. **Response Envelope Unwrapping:** Automatically extracts `data` from responses conforming to `{ success: true, data: T }`.
4. **Standard Error Handling:** Converts failed HTTP statuses into typed `ApiError` instances.
