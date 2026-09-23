import { Roboto } from 'next/font/google';
import { Footer, Layout, Navbar } from 'nextra-theme-docs';
import { getPageMap } from 'nextra/page-map';

import 'nextra-theme-docs/style.css';
import './globals.css';

import type { Metadata } from 'next';
import type { PropsWithChildren } from 'react';

import { AudienceScope } from './audience-scope';
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
        <img src="/brand/logo.svg" alt="PatrimBox" height={56} width={81} className="logo-light" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo-white.svg"
          alt="PatrimBox"
          height={56}
          width={81}
          className="logo-dark"
        />
      </span>
    }
  />
);

export default async function RootLayout({ children }: PropsWithChildren) {
  const footer = (
    <Footer>
      <div className="footer-content">
        <span>© {new Date().getFullYear()} PatrimBox. Tous droits réservés.</span>
        <nav className="footer-links">
          <a href="/aide">Aide &amp; dépannage</a>
          <a href="/aide/faq">Foire aux questions</a>
        </nav>
      </div>
    </Footer>
  );

  return (
    <html lang="fr" dir="ltr" suppressHydrationWarning className={roboto.variable}>
      {/* La classe d'audience est ajoutée au <body> par le script ci-dessous avant l'hydratation */}
      <body suppressHydrationWarning>
        {/* Applique la classe d'audience avant l'hydratation React, pour éviter un flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.body.classList.add(
              location.pathname.indexOf('/espace-professionnel-avocat') === 0
                ? 'audience-avocat'
                : location.pathname.indexOf('/espace-professionnel') === 0
                  ? 'audience-notaire'
                  : 'audience-client'
            )`,
          }}
        />
        <AudienceScope />
        <Layout
          navbar={navbar}
          pageMap={await getPageMap()}
          footer={footer}
          search={<SearchClient />}
          editLink={null}
          feedback={{ content: null }}
          sidebar={{ defaultMenuCollapseLevel: 1 }}
          darkMode={false}
          toc={{ title: 'Sur cette page', backToTop: 'Revenir en haut' }}
          copyPageButton={false}
        >
          {children}
        </Layout>
      </body>
    </html>
  );
}
