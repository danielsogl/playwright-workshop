import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

import { findUserByEmail } from '@/lib/db/repositories/users'; // Import user repository functions

// Note: Ensure NEXTAUTH_SECRET environment variable is set in production!
const secret = process.env.NEXTAUTH_SECRET;

if (!secret && process.env.NODE_ENV === 'production') {
  throw new Error(
    'NEXTAUTH_SECRET environment variable is not set for production',
  );
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
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
        if (!credentials?.email || !credentials?.password) {
          return null; // Missing credentials
        }

        const user = await findUserByEmail(credentials.email);

        if (!user) {
          return null; // User not found
        }

        // Validate password
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.passwordHash,
        );

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
  session: {
    strategy: 'jwt', // Use JWT for session management
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours - How often to update session data
  },
  secret: secret || 'fallback-super-secret-for-dev', // Use env var or fallback for dev
  pages: {
    signIn: '/auth/signin', // Custom sign-in page path
    // Add other custom pages if needed (e.g., signUp, error)
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.name = user.name;
      }

      // Handle session update trigger (e.g., after profile update)
      if (trigger === 'update' && session?.name) {
        token.name = session.name;
        // Optional: Could re-fetch user data here if more fields needed updating
        // const dbUser = await findUserById(token.id as string);
        // if (dbUser) { token.name = dbUser.name; /* ... other fields */ }
      }

      return token;
    },
    async session({ session, token }) {
      // Ensure session.user exists
      if (session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        // Add other properties from token if needed
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
