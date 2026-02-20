'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Input } from '@heroui/input';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Divider } from '@heroui/divider';
import { LogIn } from 'lucide-react';

export default function SignInPage() {
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
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        setError('Invalid email or password. Please try again.');
      } else if (result?.ok) {
        router.push('/');
        router.refresh();
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
      <Card className="w-full max-w-md shadow-lg border border-default-200">
        <CardHeader className="flex flex-col items-center gap-2 pt-8 pb-0">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-2">
            <LogIn className="w-7 h-7 text-primary" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold" id="signin-title">
            Welcome Back
          </h1>
          <p className="text-default-500 text-sm">
            Sign in to access your account
          </p>
        </CardHeader>
        <Divider className="mt-4" />
        <CardBody className="px-8 py-6">
          <form
            aria-label="Sign in form"
            className="space-y-5"
            onSubmit={handleSubmit}
            name="signin-form"
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
              aria-label="Email address for sign in"
              autoComplete="email"
              spellCheck="false"
              disabled={isLoading}
              label="Email"
              placeholder="you@example.com"
              type="email"
              value={email}
              name="email"
              variant="bordered"
              size="lg"
              onValueChange={setEmail}
            />
            <Input
              isRequired
              aria-label="Password for sign in"
              autoComplete="current-password"
              disabled={isLoading}
              label="Password"
              placeholder="Your password"
              type="password"
              value={password}
              name="password"
              variant="bordered"
              size="lg"
              onValueChange={setPassword}
            />
            <Button
              className="w-full font-semibold"
              color="primary"
              size="lg"
              disabled={isLoading}
              isLoading={isLoading}
              type="submit"
              aria-label={
                isLoading ? 'Submitting sign in form' : 'Submit sign in form'
              }
            >
              {isLoading ? 'Signing In…' : 'Sign In'}
            </Button>
            <div className="text-center text-sm pt-2">
              <p className="text-default-500">
                Don&#39;t have an account?{' '}
                <Link
                  aria-label="Navigate to sign up page"
                  href="/auth/signup"
                  isDisabled={isLoading}
                  size="sm"
                  className="font-semibold"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
