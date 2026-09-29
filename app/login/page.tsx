import { LoginForm } from './login-form';

import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Connexion' };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const { next } = await searchParams;

  return (
    <div className="patrimbox-login-page">
      <div className="patrimbox-login">
        <h1 className="patrimbox-login__title">Connexion</h1>
        <p className="patrimbox-login__intro">
          Connectez-vous avec votre compte PatrimBox pour accéder au centre d’aide.
        </p>
        <LoginForm next={typeof next === 'string' ? next : undefined} />
      </div>
    </div>
  );
}
