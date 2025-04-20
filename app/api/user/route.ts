import { NextRequest } from 'next/server';
import { z } from 'zod';
import type { Session } from 'next-auth';

import { withAuth } from '@/lib/api/middleware/withAuth';
import {
  jsonSuccess,
  jsonError,
  jsonValidationError,
  jsonNotFound,
} from '@/lib/utils/api';
import { findUserById, updateUserProfile } from '@/lib/db/repositories/users';

const getHandler = async (_req: NextRequest, session: Session) => {
  try {
    const user = await findUserById(session.user.id);

    if (!user) {
      return jsonNotFound('User');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...userData } = user;

    return jsonSuccess(userData);
  } catch (error) {
    console.error('Failed to fetch user details:', error);

    return jsonError('Failed to fetch user details');
  }
};

const UpdateUserSchema = z.object({
  name: z.string().min(1, 'Name cannot be empty'),
});

const putHandler = async (req: NextRequest, session: Session) => {
  try {
    const body = await req.json();

    const validationResult = UpdateUserSchema.safeParse(body);

    if (!validationResult.success) {
      return jsonValidationError(validationResult.error);
    }

    const { name } = validationResult.data;

    const updatedUser = await updateUserProfile(session.user.id, { name });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...userData } = updatedUser;

    return jsonSuccess(userData);
  } catch (error: unknown) {
    console.error('Failed to update user profile:', error);
    if (error instanceof Error && error.message === 'User not found') {
      return jsonNotFound('User');
    }

    return jsonError('Failed to update user profile');
  }
};

export const GET = withAuth(getHandler);
export const PUT = withAuth(putHandler);
