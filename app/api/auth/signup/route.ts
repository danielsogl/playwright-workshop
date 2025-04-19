import { NextRequest } from 'next/server';
import { z } from 'zod';

import { addUser } from '@/lib/db/repositories/users';
import { jsonSuccess, jsonError, jsonValidationError } from '@/lib/utils/api';

const SignUpSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validationResult = SignUpSchema.safeParse(body);

    if (!validationResult.success) {
      return jsonValidationError(validationResult.error);
    }

    const { name, email, password } = validationResult.data;

    const newUser = await addUser({ name, email, password });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...userWithoutPassword } = newUser;

    return jsonSuccess(
      {
        message: 'User created successfully',
        user: userWithoutPassword,
      },
      201,
    );
  } catch (error: unknown) {
    console.error('Signup error:', error);

    if (error instanceof Error && error.message === 'Email already exists') {
      return jsonError('Email already registered', 409);
    }

    return jsonError('An internal server error occurred');
  }
}
