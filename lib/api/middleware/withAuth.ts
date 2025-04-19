import { authOptions } from '@/app/api/auth/[...nextauth]/auth.config';
import { jsonUnauthorized } from '@/lib/utils/api';
import type { Session } from 'next-auth';
import { getServerSession } from 'next-auth/next';
import { NextRequest, NextResponse } from 'next/server';

type AuthenticatedHandler = (
  req: NextRequest,
  session: Session,
) => Promise<NextResponse>;

/**
 * Middleware function to protect API routes that require authentication.
 * It checks for a valid NextAuth session and passes it to the handler.
 * If no valid session is found, it returns a 401 Unauthorized response.
 *
 * @param handler - The API route handler function to wrap.
 * @returns A new function that performs the authentication check before calling the handler.
 */
export const withAuth = (
  handler: AuthenticatedHandler,
): ((req: NextRequest) => Promise<NextResponse>) => {
  return async (req: NextRequest): Promise<NextResponse> => {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return jsonUnauthorized();
    }

    return handler(req, session);
  };
};
