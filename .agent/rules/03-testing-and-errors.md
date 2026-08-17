# Testing, Error Handling & API Envelope Specification

> **Rule ID:** `03-testing-and-errors`  
> **Applicable Globs:** `utils/api.ts`, `lib/auth-context.tsx`, `components/AuthGuard.tsx`, `app/login/page.tsx`

---

## 1. Backend Error Envelopes

The Go backend and API client wrapper communicate using a standard response envelope:

```typescript
export interface ApiErrorEnvelope {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{ field: string; issue: string }>;
  };
  timestamp?: string;
}
```

When an error status code is encountered, [utils/api.ts](file:///utils/api.ts) throws an instance of `ApiError`:
```typescript
export class ApiError extends Error {
  code: string;
  status: number;
  details?: Array<{ field: string; issue: string }>;
}
```

---

## 2. Domain Error Handling & Business Rules

1. **Past Log Editing Restrictions (`RESTRICTED`):**  
   Editing historical logs is restricted based on plan consistency rules. The backend returns code `RESTRICTED` or `FORBIDDEN`. The UI must display an informative toast/alert explaining why past dates cannot be modified without power-ups.
2. **Restore Shield Lookback Window:**  
   `POST /api/v1/streak/restore` only permits restoration within the 3-day lookback window. If expired, the backend returns `EXPIRED_RESTORE_WINDOW`.
3. **Inventory & Token Validation:**  
   Consuming items (`POST /api/v1/inventory/use`) returns `INSUFFICIENT_QUANTITY` if user balance is zero.

---

## 3. Authentication & 401 Handling Strategy

1. **Token Refresh Fallback:**  
   Before dispatching requests, `getAccessToken()` queries `supabase.auth.getSession()`. If missing or expiring, it attempts `supabase.auth.refreshSession()`.
2. **401 Unauthorized Response:**  
   When the Go backend returns HTTP 401:
   - The API wrapper logs the failure and throws `ApiError(message, 'UNAUTHORIZED', 401)`.
   - `AuthGuard.tsx` and `middleware.ts` automatically redirect unauthenticated clients to `/login`.
3. **Graceful Fallbacks:**  
   In components where backend analytics may be temporarily unreachable (e.g. power score endpoint), fallback algorithms (such as [lib/scientific-power.ts](file:///lib/scientific-power.ts)) execute locally to avoid blank screens.

---

## 4. Verification & Circuit Breaker Workflow

1. **Local Build Check:**  
   Run `npm run build` to verify type safety and Next.js route compilation.
2. **Lint Validation:**  
   Run `npm run lint` to enforce formatting and import standards.
3. **The 3-Attempt Circuit Breaker Rule:**  
   If a build error, API contract bug, or visual flaw fails to resolve after **3 consecutive attempts**:
   - Revert modified files to the previous working Git commit.
   - Record the failure log in the active feature's `STATE.md`.
   - Halt execution and ask the human engineer for architectural guidance.
