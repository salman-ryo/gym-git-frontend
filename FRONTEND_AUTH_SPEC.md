# Gym-Git Frontend: Real Authentication & Backend Integration Spec

## 1. Context & Architecture Goal
We are transitioning the Next.js TypeScript frontend from mocked authentication to a real production authentication flow. 
- **Identity Provider:** Supabase Auth.
- **Custom Backend:** A Go/Gin API running at `http://localhost:8080/api/v1`.
- **The Flow:** Next.js communicates with Supabase to get a JWT session. It then uses that JWT to authenticate requests against the Go backend.

## 2. Supabase SSR & Cookie Management
We must use `@supabase/ssr` for secure cookie-based session management across Next.js Server Components, Client Components, and Middleware.
- Create the standard utility files:
  - `utils/supabase/client.ts` (Browser client)
  - `utils/supabase/server.ts` (Server component client)
  - `utils/supabase/middleware.ts` (Middleware client to refresh tokens)
- Next.js must store the Supabase session in `HttpOnly` cookies.

## 3. The API Client Wrapper (The Bridge)
Create a centralized API utility (e.g., `utils/api.ts` or an Axios instance) that intercepts all requests to the Go backend and attaches the Supabase JWT.
- **Base URL:** `NEXT_PUBLIC_API_URL` (default `http://localhost:8080/api/v1`).
- **Token Injection:** Before any request is sent, retrieve the current Supabase session (via `supabase.auth.getSession()` on client, or reading cookies on server). 
- Attach the `access_token` to the request headers: `Authorization: Bearer <token>`.
- **Standard Error Handling:** Handle standard backend error envelopes. If a `401 Unauthorized` is returned, trigger a client-side logout and redirect to `/login`.

## 4. The Auth Flows (Sign Up & Login)
Replace mock login/signup functions with real Supabase SDK calls.

**Sign Up / Log In Flow:**
1. Call `supabase.auth.signUp()` or `supabase.auth.signInWithPassword()`.
2. **CRITICAL BOOTSTRAP STEP:** Upon successful login/signup, you MUST immediately make an authenticated `POST` request to the Go backend: `POST /api/v1/auth/bootstrap`.
   - Body: `{ "selectedPlanId": "ppl-standard" }`
   - Why? This ensures the custom Go backend creates the user's application profile in the Postgres `users` table.
3. Fetch the full profile by calling `GET /api/v1/auth/me`.
4. Redirect the user to `/dashboard`.

**Logout Flow:**
1. Call `supabase.auth.signOut()`.
2. Clear local React state/Zustand/Context.
3. Redirect to `/login`.

## 5. Next.js Middleware Route Protection
Implement `middleware.ts` at the root of the project.
- It must call `supabase.auth.getUser()` to verify the session.
- If a user is NOT authenticated, redirect any requests aiming for `/dashboard`, `/logs`, or `/settings` to the `/login` page.
- If a user IS authenticated, redirect requests aiming for `/login` or `/signup` to the `/dashboard`.

## 6. Removing Mocks & Integrating API
Remove all mocked API functions and replace them with real calls using the API Client Wrapper:
- **Profile:** Map `GET /api/v1/auth/me` to the global user state.
- **Logs:** Replace mock log saving with `POST /api/v1/logs` and `GET /api/v1/logs`.
- **Stats:** Replace mock dashboard stats with `GET /api/v1/stats` and `GET /api/v1/stats/power`.