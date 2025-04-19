import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod"; // Import Zod for validation

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { findUserById, updateUserProfile } from "@/lib/db/repositories/users";
// TODO: Import updateUser function when created in users repository

/**
 * API handler to get the current authenticated user's details.
 */
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user.id;
    const user = await findUserById(userId);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Return user data, excluding the password hash
    const { passwordHash: _, ...userData } = user;

    return NextResponse.json(userData);
  } catch {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

/**
 * API handler to update the current authenticated user's details.
 * Currently only supports updating the name.
 */

// Define validation schema for update
const UpdateUserSchema = z.object({
  name: z.string().min(1, "Name cannot be empty"),
  // Add other fields here if they become updatable
});

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user.id;
    const body = await request.json();

    // Validate input
    const validationResult = UpdateUserSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name } = validationResult.data; // Destructure validated data

    // Perform the update using the repository function
    const updatedUser = await updateUserProfile(userId, { name });

    // Return the updated user data, excluding the password hash
    const { passwordHash: _, ...userData } = updatedUser;

    return NextResponse.json(userData);
  } catch (error: any) {
    if (error.message === "User not found") {
      // This shouldn't happen if the session is valid, but handle defensively
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
}

// TODO: Implement password change functionality (likely a separate endpoint)
