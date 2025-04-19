import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";

import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path as needed
import { updateUserPassword } from "@/lib/db/repositories/users"; // Adjust path as needed

// Define validation schema using Zod
const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(6, "New password must be at least 6 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "New passwords do not match",
    path: ["confirmPassword"], // Path of the error
  });

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Validate input
    const validationResult = ChangePasswordSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { currentPassword, newPassword } = validationResult.data;
    const userId = session.user.id;

    // Attempt to update the password
    await updateUserPassword(userId, currentPassword, newPassword);

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    // Handle specific errors from the repository
    if (error.message === "Incorrect current password") {
      return NextResponse.json(
        { message: "Incorrect current password" },
        { status: 400 }, // Bad Request might be more appropriate than 401/403
      );
    }
    if (error.message === "User not found") {
      // This shouldn't happen if the session is valid, but handle defensively
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Generic error response
    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 },
    );
  }
}
