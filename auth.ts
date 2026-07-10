import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';

import { authConfig } from './auth.config';

import { findUserByEmail } from '@/lib/db/repositories/users';

/**
 * Full Auth.js v5 config (Node runtime): base config + the Credentials provider,
 * whose `authorize` uses bcrypt + the sqlite user repository.
 * Exposes `handlers` (route), `auth` (server session), `signIn`/`signOut`.
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'jsmith@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;

        if (!email || !password) {
          return null; // Missing credentials
        }

        const user = await findUserByEmail(email);

        if (!user) {
          return null; // User not found
        }

        const isValidPassword = await compare(password, user.passwordHash);

        if (!isValidPassword) {
          return null; // Invalid password
        }

        // Return user object without the password hash
        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
});
