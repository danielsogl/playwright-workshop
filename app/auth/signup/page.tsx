'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { Input, Button, Link, Card, CardBody, CardHeader, Divider } from '@heroui/react';
import { UserPlus } from 'lucide-react';

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

      const signInResult = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (signInResult?.error) {
        setError(
          'Sign up successful, but auto sign-in failed. Please sign in manually.',
        );
        router.push(
          `/auth/signin?message=${encodeURIComponent('Sign up successful. Please sign in.')}`,
        );
        setIsLoading(false);
      } else if (signInResult?.ok) {
        router.push('/');
        router.refresh();
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
      <Card className="w-full max-w-md shadow-lg border border-default-200">
        <CardHeader className="flex flex-col items-center gap-2 pt-8 pb-0">
          <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center mb-2">
            <UserPlus className="w-7 h-7 text-secondary" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold" id="signup-title">
            Create Account
          </h1>
          <p className="text-default-500 text-sm">
            Get started with your free account
          </p>
        </CardHeader>
        <Divider className="mt-4" />
        <CardBody className="px-8 py-6">
          <form
            aria-label="Sign up form"
            className="space-y-5"
            onSubmit={handleSubmit}
            name="signup-form"
          >
            {error && (
              <div
                className="p-3 bg-danger-50 text-danger border border-danger-200 rounded-lg text-sm"
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
              variant="bordered"
              size="lg"
              onValueChange={setName}
            />
            <Input
              isRequired
              aria-label="Email address for sign up"
              autoComplete="email"
              spellCheck="false"
              disabled={isLoading}
              label="Email"
              placeholder="you@example.com"
              type="email"
              value={email}
              id="signup-email"
              name="email"
              variant="bordered"
              size="lg"
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
              variant="bordered"
              size="lg"
              onValueChange={setPassword}
            />
            <Button
              className="w-full font-semibold"
              color="primary"
              size="lg"
              disabled={isLoading || !name || !email || !password}
              isLoading={isLoading}
              type="submit"
              aria-label={
                isLoading ? 'Submitting sign up form' : 'Submit sign up form'
              }
              id="signup-submit"
            >
              {isLoading ? 'Signing Up…' : 'Create Account'}
            </Button>

            <div className="text-center text-sm pt-2">
              <p className="text-default-500">
                Already have an account?{' '}
                <Link
                  aria-label="Navigate to sign in page"
                  href="/auth/signin"
                  size="sm"
                  className="font-semibold"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
