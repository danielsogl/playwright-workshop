"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false, // Prevent NextAuth from redirecting automatically
        email,
        password,
      });

      if (result?.error) {
        setError("Invalid email or password. Please try again.");
      } else if (result?.ok) {
        // Redirect to home page or dashboard upon successful sign-in
        router.push("/"); // Or '/dashboard' or wherever appropriate
        router.refresh(); // Refresh server components
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
      <form
        aria-label="Sign in form" // Added aria-label
        className="w-full max-w-sm p-8 space-y-6 bg-content1 rounded-lg shadow-md"
        data-testid="form-signin" // Added data-testid
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold text-center">Sign In</h1>

        {error && (
          <div
            className="p-3 bg-danger-100 text-danger-700 rounded-md"
            data-testid="error-signin" // Added data-testid
            role="alert" // Added role for accessibility
          >
            {error}
          </div>
        )}

        <Input
          isRequired
          aria-label="Email address for sign in" // Added aria-label
          autoComplete="email"
          data-testid="input-signin-email" // Added data-testid
          disabled={isLoading}
          label="Email"
          placeholder="you@example.com"
          type="email"
          value={email}
          onValueChange={setEmail}
        />
        <Input
          isRequired
          aria-label="Password for sign in" // Added aria-label
          autoComplete="current-password"
          data-testid="input-signin-password" // Added data-testid
          disabled={isLoading}
          label="Password"
          placeholder="Your password"
          type="password"
          value={password}
          onValueChange={setPassword}
        />
        <Button
          className="w-full"
          color="primary"
          data-testid="btn-signin-submit" // Added data-testid
          disabled={isLoading}
          isLoading={isLoading}
          type="submit"
          aria-label={
            isLoading ? "Submitting sign in form" : "Submit sign in form"
          } // Added aria-label
        >
          {isLoading ? "Signing In..." : "Sign In"}
        </Button>
        <div className="text-center text-sm">
          {/* Link to Sign Up page - to be created later */}
          {/* <p>
            Don't have an account?{' '}
            <Link href="/auth/signup" size="sm">
              Sign Up
            </Link>
          </p> */}
          <p>
            Don&#39;t have an account?{" "}
            <Link
              aria-label="Navigate to sign up page" // Sorted props
              data-testid="link-signup" // Sorted props
              href="/auth/signup"
              isDisabled={isLoading}
              size="sm"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
