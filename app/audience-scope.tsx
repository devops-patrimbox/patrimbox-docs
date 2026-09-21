'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export type Audience = 'client' | 'notaire' | 'avocat';

export function getAudience(pathname: string): Audience {
  if (pathname.startsWith('/espace-professionnel-avocat')) return 'avocat';
  if (pathname.startsWith('/espace-professionnel')) return 'notaire';
  return 'client';
}

const AUDIENCE_CLASSES = ['audience-client', 'audience-notaire', 'audience-avocat'];

// Bascule une classe sur <body> selon la zone visitée, pour que le CSS
// (voir globals.css) masque les espaces professionnels qui ne concernent pas
// l'audience courante (client, notaire ou avocat) dans la nav et la sidebar.
export function AudienceScope() {
  const pathname = usePathname();

  useEffect(() => {
    const audience = getAudience(pathname);
    document.body.classList.remove(...AUDIENCE_CLASSES);
    document.body.classList.add(`audience-${audience}`);
  }, [pathname]);

  return null;
}
