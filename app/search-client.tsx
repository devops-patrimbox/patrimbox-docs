'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Search } from 'nextra/components';

/**
 * Renders the Nextra Search component only on the client.
 *
 * The built-in search uses headlessui's Combobox which calls useId() — the
 * generated IDs can differ between server and client when next-themes'
 * ThemeProvider changes the fiber tree during hydration. By returning null
 * during SSR the server and the initial client render are identical, so React
 * never sees a mismatch. The search appears as soon as the component mounts.
 *
 * The search is hidden on the home page.
 */
export function SearchClient() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || pathname === '/') return null;

  return <Search placeholder="Rechercher…" />;
}
