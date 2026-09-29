/**
 * Keeps a post-login redirect on this site: only a local absolute path is
 * accepted (`//host` and `/\host` would be read by browsers as another origin).
 */
export const safeRedirectPath = (value: unknown): string => {
  if (typeof value !== 'string' || !value.startsWith('/')) return '/';
  if (value.startsWith('//') || value.startsWith('/\\')) return '/';
  if (value === '/login' || value.startsWith('/login?')) return '/';
  return value;
};
