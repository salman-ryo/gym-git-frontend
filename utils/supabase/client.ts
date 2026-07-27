import { createBrowserClient } from '@supabase/ssr';
import { env } from '@/lib/env';

let client: ReturnType<typeof createBrowserClient> | null = null;

export function createClient() {
  if (typeof window === 'undefined') {
    return createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  }

  if (!client) {
    client = createBrowserClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);
  }

  return client;
}
