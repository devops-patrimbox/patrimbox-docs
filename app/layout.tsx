import { Roboto } from 'next/font/google';
import { Footer, Layout, Navbar } from 'nextra-theme-docs';
import { getPageMap } from 'nextra/page-map';

import 'nextra-theme-docs/style.css';
import './globals.css';

import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

import { SearchClient } from './search-client';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['300', '400', '500', '700', '900'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'PatrimBox — Centre d’aide',
    template: '%s — Aide PatrimBox',
  },
  description:
    'Centre d’aide PatrimBox : guides pour les clients et les professionnels (notaires, avocats, agents immobiliers, courtiers) sur la gestion sécurisée de vos coffres-forts et documents.',
};

const navbar = (
  <Navbar
    logo={
      <span className="patrimbox-logo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/brand/logo.svg" alt="PatrimBox" height={28} width={29} className="logo-light" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo-white.svg"
          alt="PatrimBox"
          height={28}
          width={29}
          className="logo-dark"
        />
        <span className="patrimbox-logo__name">PatrimBox</span>
      </span>
    }
  />
);

export default async function RootLayout({ children }: PropsWithChildren) {
  const footer = (
    <Footer>© {new Date().getFullYear()} PatrimBox. Tous droits réservés.</Footer>
  );

  return (
    <html lang="fr" dir="ltr" suppressHydrationWarning className={roboto.variable}>
      <body>
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          footer={footer}
          search={<SearchClient />}
          editLink={null}
          feedback={{ content: null }}
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          themeSwitch={{ light: 'Clair', dark: 'Sombre', system: 'Système' }}
          toc={{ title: 'Sur cette page', backToTop: 'Revenir en haut' }}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
