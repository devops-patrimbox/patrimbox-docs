import type { CookieOptions } from '@supabase/ssr';

/**
 * Same hardening as patrimbox-app (`@services/supabase/cookieOptions`): the auth
 * tokens are not readable by page scripts, and `secure` only in production since
 * the dev server is plain http.
 */
export const hardenSupabaseCookie = (options: CookieOptions): CookieOptions => ({
  ...options,
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
});
