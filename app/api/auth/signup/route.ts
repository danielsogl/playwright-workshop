import { NextResponse } from "next/server";
import { z } from "zod";

import { addUser } from "@/lib/db/repositories/users"; // Adjust path as needed

// Define validation schema using Zod
const SignUpSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate input
    const validationResult = SignUpSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          message: "Invalid input",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { name, email, password } = validationResult.data;

    // Attempt to add the user
    const newUser = await addUser({ name, email, password });

    // Exclude passwordHash from the response - We don't need passwordHash here
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        message: "User created successfully",
        user: userWithoutPassword,
      },
      { status: 201 },
    );
  } catch (error: unknown) {
    // Handle specific error for existing email
    if (error instanceof Error && error.message === "Email already exists") {
      return NextResponse.json(
        { message: "Email already registered" },
        { status: 409 }, // Conflict
      );
    }

    // Generic error response
    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 },
    );
  }
}
