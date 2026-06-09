'use client';

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
 */
export function SearchClient() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <Search placeholder="Rechercher dans la documentation…" />;
}
