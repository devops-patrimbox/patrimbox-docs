'use server';

import { redirect } from 'next/navigation';

import { getSupabaseServerInstance } from '../supabase/server';
import { safeRedirectPath } from './redirect';

export type LoginState = { error?: string };

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = formData.get('email');
  const password = formData.get('password');

  if (typeof email !== 'string' || typeof password !== 'string' || !email || !password) {
    return { error: 'Veuillez saisir votre adresse e-mail et votre mot de passe.' };
  }

  const supabase = await getSupabaseServerInstance();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // One message whatever the cause, so the form does not tell which accounts exist.
    return { error: 'Adresse e-mail ou mot de passe incorrect.' };
  }

  redirect(safeRedirectPath(formData.get('next')));
}

export async function logout() {
  const supabase = await getSupabaseServerInstance();
  await supabase.auth.signOut();
  redirect('/login');
}
