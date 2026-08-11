import { createClient as createBrowserClient } from '@/utils/supabase/client';
import { env } from '@/lib/env';

export interface ApiSuccessResponse<T = any> {
  success: true;
  data: T;
  message?: string;
}

export interface ApiErrorEnvelope {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{ field: string; issue: string }>;
  };
  timestamp?: string;
}

export class ApiError extends Error {
  code: string;
  status: number;
  details?: Array<{ field: string; issue: string }>;

  constructor(
    message: string,
    code: string = 'API_ERROR',
    status: number = 500,
    details?: Array<{ field: string; issue: string }>
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code;
    this.status = status;
    this.details = details;
  }
}

export interface ApiOptions extends RequestInit {
  token?: string;
}

const getBaseUrl = (): string => {
  return env.API_URL.replace(/\/$/, '');
};

async function getAccessToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  try {
    const supabase = createBrowserClient();
    
    // 1. Retrieve active session from shared Supabase client
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session?.access_token) {
      return session.access_token;
    }

    // 2. Fallback: Attempt to refresh session if token is missing/expired
    const {
      data: { session: refreshedSession },
    } = await supabase.auth.refreshSession();

    if (refreshedSession?.access_token) {
      return refreshedSession.access_token;
    }

    return null;
  } catch (err) {
    console.warn('[API Wrapper] Failed to retrieve Supabase session token:', err);
    return null;
  }
}

/**
 * Main API fetch wrapper that automatically retrieves the active Supabase token,
 * attaches the Authorization: Bearer <token> header to requests.
 */
export async function apiFetch<T = any>(
  endpoint: string,
  options: ApiOptions = {}
): Promise<T> {
  const baseUrl = getBaseUrl();
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${cleanEndpoint}`;

  // Use explicitly passed token or retrieve from active session
  const token = options.token || (await getAccessToken());

  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  // Inject X-Timezone header if running in the client
  if (!headers.has('X-Timezone') && typeof window !== 'undefined') {
    try {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timezone) {
        headers.set('X-Timezone', timezone);
      }
    } catch (e) {
      console.warn('[API Client] Failed to resolve timezone:', e);
    }
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const { token: _, ...fetchOptions } = options;

  const config: RequestInit = {
    ...fetchOptions,
    headers,
  };

  const response = await fetch(url, config);

  // Handle 401 Unauthorized - log error details and throw ApiError without forcing signOut
  if (response.status === 401) {
    let errorPayload: any = null;
    try {
      errorPayload = await response.clone().json();
    } catch {
      // ignore
    }
    console.error(
      `[API 401 Unauthorized] Request to ${cleanEndpoint} failed with status 401. Token attached: ${!!token}`,
      errorPayload
    );

    const message =
      errorPayload?.error?.message || 'Unauthorized session. Please log in again.';
    const code = errorPayload?.error?.code || 'UNAUTHORIZED';
    const details = errorPayload?.error?.details;
    throw new ApiError(message, code, 401, details);
  }

  let json: any;
  try {
    json = await response.json();
  } catch {
    if (!response.ok) {
      throw new ApiError(
        `HTTP Error ${response.status}: ${response.statusText}`,
        'HTTP_ERROR',
        response.status
      );
    }
    return {} as T;
  }

  if (!response.ok || (json && json.success === false)) {
    const errorData = json?.error;
    const message =
      errorData?.message || json?.message || `API request failed with status ${response.status}`;
    const code = errorData?.code || `HTTP_${response.status}`;
    const details = errorData?.details;
    throw new ApiError(message, code, response.status, details);
  }

  // Automatically unpack envelope if response follows { success: true, data: ... }
  return (json && typeof json === 'object' && 'data' in json ? json.data : json) as T;
}

export const api = {
  get: <T = any>(endpoint: string, options?: ApiOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'GET' }),

  post: <T = any>(endpoint: string, body?: any, options?: ApiOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  put: <T = any>(endpoint: string, body?: any, options?: ApiOptions) =>
    apiFetch<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  delete: <T = any>(endpoint: string, options?: ApiOptions) =>
    apiFetch<T>(endpoint, { ...options, method: 'DELETE' }),
};
