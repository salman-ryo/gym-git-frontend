/**
 * Centralized Environment Configuration & Validation
 *
 * Note: In Next.js, process.env.NEXT_PUBLIC_* variables MUST be accessed
 * explicitly via dot notation (e.g., process.env.NEXT_PUBLIC_SUPABASE_URL)
 * so that Turbopack/Webpack can statically replace them in browser bundles.
 */

function validateEnv(value: string | undefined, name: string, fallback?: string): string {
  const result = value || fallback;

  if (!result || result.trim() === '') {
    const banner = [
      '========================================================',
      `❌ MISSING ENVIRONMENT VARIABLE: ${name}`,
      '',
      `Please define ${name} in your frontend/.env or .env.local file.`,
      'See frontend/.env.example for template environment values.',
      '========================================================',
    ].join('\n');

    console.error(banner);
    throw new Error(`[ENV ERROR] Required environment variable "${name}" is not set.`);
  }

  return result.trim();
}

export const env = {
  SUPABASE_URL: validateEnv(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    'NEXT_PUBLIC_SUPABASE_URL'
  ),
  SUPABASE_ANON_KEY: validateEnv(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    'NEXT_PUBLIC_SUPABASE_ANON_KEY'
  ),
  API_URL: validateEnv(
    process.env.NEXT_PUBLIC_API_URL,
    'NEXT_PUBLIC_API_URL',
    'http://localhost:8080/api/v1'
  ),
};
