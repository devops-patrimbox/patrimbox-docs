import { createServerClient } from '@supabase/ssr';
import { NextResponse } from 'next/server';

import { hardenSupabaseCookie } from './lib/supabase/cookieOptions';

import type { NextRequest } from 'next/server';

const LOGIN_PATH = '/login';

/**
 * Gates the whole site — pages and the Pagefind index alike — behind a Supabase
 * session shared with patrimbox-app (same project, same accounts).
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, hardenSupabaseCookie(options))
          );
        },
      },
    }
  );

  // Nothing between createServerClient and getUser(): getUser() refreshes the
  // session and validates it against Supabase (getSession() would trust the cookie).
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname, search } = request.nextUrl;
  const onLoginPage = pathname === LOGIN_PATH;

  if (!user && !onLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN_PATH;
    url.search = '';
    if (pathname !== '/') url.searchParams.set('next', pathname + search);
    return NextResponse.redirect(url);
  }

  if (user && onLoginPage) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    url.search = '';
    const redirect = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
    return redirect;
  }

  return response;
}

export const config = {
  // Everything except Next's build assets, the icons and the brand files the
  // login page itself needs. `_pagefind` stays gated: it holds the full content.
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico|icon\\.png|icon\\.svg|apple-icon\\.png|brand/).*)'],
};
