import NextAuth from 'next-auth';

import { authConfig } from './auth.config';

// Edge-safe instance (base config only, no Credentials provider / Node deps).
const { auth } = NextAuth(authConfig);

// Next.js 16 renamed the `middleware` convention to `proxy`.
export default auth((req) => {
  // `req.auth` is the decoded session; null when unauthenticated.
  if (!req.auth) {
    const signInUrl = req.nextUrl.clone();

    signInUrl.pathname = '/auth/signin';
    signInUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);

    return Response.redirect(signInUrl);
  }
});

// Only run on the protected routes.
export const config = {
  matcher: ['/news/private/:path*', '/settings/:path*'],
};
