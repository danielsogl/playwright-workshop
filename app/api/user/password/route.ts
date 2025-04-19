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
import { updateUserPassword } from '@/lib/db/repositories/users';

const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters long'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'New passwords do not match',
    path: ['confirmPassword'],
  });

const putHandler = async (req: NextRequest, session: Session) => {
  try {
    const body = await req.json();

    const validationResult = ChangePasswordSchema.safeParse(body);

    if (!validationResult.success) {
      return jsonValidationError(validationResult.error);
    }

    const { currentPassword, newPassword } = validationResult.data;
    const userId = session.user.id;

    await updateUserPassword(userId, currentPassword, newPassword);

    return jsonSuccess({ message: 'Password updated successfully' });
  } catch (error: unknown) {
    console.error('Password update error:', error);

    if (
      error instanceof Error &&
      error.message === 'Incorrect current password'
    ) {
      return jsonError('Incorrect current password', 400);
    }
    if (error instanceof Error && error.message === 'User not found') {
      return jsonNotFound('User');
    }

    return jsonError('An internal server error occurred');
  }
};

export const PUT = withAuth(putHandler);
