'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Sign up failed. Please try again.');
        setIsLoading(false);

        return;
      }

      // Automatically sign in the user after successful sign up
      const signInResult = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (signInResult?.error) {
        // This might happen if something goes wrong immediately after signup
        // Redirect to sign-in page with an error message maybe?
        setError(
          'Sign up successful, but auto sign-in failed. Please sign in manually.',
        );
        router.push(
          `/auth/signin?message=${encodeURIComponent('Sign up successful. Please sign in.')}`,
        );
        setIsLoading(false);
      } else if (signInResult?.ok) {
        // Redirect to home page upon successful sign-in
        router.push('/');
        router.refresh(); // Refresh server components
      } else {
        setError(
          'Sign up successful, but auto sign-in failed unexpectedly. Please sign in manually.',
        );
        router.push(
          `/auth/signin?message=${encodeURIComponent('Sign up successful. Please sign in.')}`,
        );
        setIsLoading(false);
      }
    } catch {
      setError(
        'An unexpected error occurred during sign up. Please try again.',
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
      <form
        aria-label="Sign up form"
        className="w-full max-w-sm p-8 space-y-6 bg-content1 rounded-lg shadow-md"
        onSubmit={handleSubmit}
        name="signup-form"
      >
        <h1 className="text-2xl font-bold text-center" id="signup-title">
          Sign Up
        </h1>

        {error && (
          <div
            className="p-3 bg-danger-100 text-danger-700 rounded-md"
            role="alert"
            aria-live="assertive"
          >
            {error}
          </div>
        )}

        <Input
          isRequired
          aria-label="Your name for sign up"
          autoComplete="name"
          disabled={isLoading}
          label="Name"
          placeholder="Your Name"
          type="text"
          value={name}
          id="signup-name"
          name="name"
          onValueChange={setName}
        />
        <Input
          isRequired
          aria-label="Email address for sign up"
          autoComplete="email"
          disabled={isLoading}
          label="Email"
          placeholder="you@example.com"
          type="email"
          value={email}
          id="signup-email"
          name="email"
          onValueChange={setEmail}
        />
        <Input
          isRequired
          aria-label="Password for sign up"
          autoComplete="new-password"
          disabled={isLoading}
          label="Password"
          placeholder="Choose a password"
          type="password"
          value={password}
          id="signup-password"
          name="password"
          onValueChange={setPassword}
        />
        {/* Optional: Add password confirmation field */}
        <Button
          className="w-full"
          color="primary"
          disabled={isLoading || !name || !email || !password}
          isLoading={isLoading}
          type="submit"
          aria-label={
            isLoading ? 'Submitting sign up form' : 'Submit sign up form'
          }
          id="signup-submit"
        >
          {isLoading ? 'Signing Up...' : 'Sign Up'}
        </Button>

        <div className="text-center text-sm">
          <p>
            Already have an account?{' '}
            <Link
              aria-label="Navigate to sign in page"
              href="/auth/signin"
              size="sm"
              role="link"
            >
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
}
