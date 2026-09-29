'use client';

import { usePathname } from 'next/navigation';

import { logout } from '../lib/auth/actions';

export function LogoutButton() {
  // The proxy lets no one reach any other page without a session.
  if (usePathname() === '/login') return null;

  return (
    <form action={logout}>
      <button type="submit" className="patrimbox-logout">
        Se déconnecter
      </button>
    </form>
  );
}
