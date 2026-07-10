import type { NextAuthConfig } from 'next-auth';

// v5 reads AUTH_SECRET by default; keep NEXTAUTH_SECRET as a fallback for
// existing setups. Explicit `secret` lets both the full config (Node) and the
// middleware (Edge) share the same signing key.
const secret =
  process.env.AUTH_SECRET ??
  process.env.NEXTAUTH_SECRET ??
  'fallback-super-secret-for-dev';

if (
  !process.env.AUTH_SECRET &&
  !process.env.NEXTAUTH_SECRET &&
  process.env.NODE_ENV === 'production'
) {
  throw new Error('AUTH_SECRET environment variable is not set for production');
}

/**
 * Edge-safe base config: no providers, no Node-only imports (bcrypt/sqlite).
 * Imported by both `auth.ts` (full config) and `middleware.ts` (Edge runtime).
 */
export const authConfig = {
  trustHost: true,
  secret,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: '/auth/signin',
  },
  providers: [],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }
      // Handle session update trigger (e.g. after profile update)
      if (trigger === 'update' && session?.name) {
        token.name = session.name;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
      }

      return session;
    },
  },
} satisfies NextAuthConfig;
