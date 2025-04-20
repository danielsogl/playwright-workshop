import { NextResponse } from 'next/server';
import { ZodError } from 'zod';

/**
 * Creates a standardized success JSON response.
 * @param data - The data payload to include in the response.
 * @param status - The HTTP status code (default: 200).
 * @returns A NextResponse object with the JSON payload and status.
 */
export const jsonSuccess = <T>(data: T, status = 200): NextResponse => {
  return NextResponse.json(data, { status });
};

/**
 * Creates a standardized error JSON response.
 * @param message - The error message.
 * @param status - The HTTP status code (default: 500).
 * @param details - Optional additional details or error object.
 * @returns A NextResponse object with the error message and status.
 */
export const jsonError = (
  message: string,
  status = 500,
  details?: unknown,
): NextResponse => {
  const responsePayload: { message: string; details?: unknown } = { message };

  if (details) {
    responsePayload.details = details;
  }

  return NextResponse.json(responsePayload, { status });
};

/**
 * Creates a standardized validation error response from a ZodError.
 * @param error - The ZodError instance.
 * @returns A NextResponse object with validation errors and a 400 status.
 */
export const jsonValidationError = (error: ZodError): NextResponse => {
  return NextResponse.json(
    {
      message: 'Validation failed',
      errors: error.flatten().fieldErrors,
    },
    { status: 400 },
  );
};

/**
 * Creates a standardized "Unauthorized" error response.
 * @returns A NextResponse object with a 401 status.
 */
export const jsonUnauthorized = (): NextResponse => {
  return jsonError('Unauthorized', 401);
};

/**
 * Creates a standardized "Not Found" error response.
 * @param resourceName - Optional name of the resource not found.
 * @returns A NextResponse object with a 404 status.
 */
export const jsonNotFound = (resourceName?: string): NextResponse => {
  const message = resourceName ? `${resourceName} not found` : 'Not found';

  return jsonError(message, 404);
};
