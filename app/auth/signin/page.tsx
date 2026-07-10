'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { TextField, Label, Input, Button, Card, Separator } from '@heroui/react';
import NextLink from 'next/link';
import clsx from 'clsx';
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
      <Card className="w-full max-w-md shadow-lg border border-border">
        <Card.Header className="flex flex-col items-center gap-2 pt-8 pb-0">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-2">
            <LogIn className="w-7 h-7 text-accent" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold" id="signin-title">
            Welcome Back
          </h1>
          <p className="text-muted text-sm">
            Sign in to access your account
          </p>
        </Card.Header>
        <Separator className="mt-4" />
        <Card.Content className="px-8 py-6">
          <form
            aria-label="Sign in form"
            className="space-y-5"
            onSubmit={handleSubmit}
            name="signin-form"
          >
            {error && (
              <div
                className="p-3 bg-danger/10 text-danger border border-danger rounded-lg text-sm"
                role="alert"
                aria-live="assertive"
              >
                {error}
              </div>
            )}

            <TextField
              isRequired
              aria-label="Email address for sign in"
              isDisabled={isLoading}
              type="email"
              value={email}
              name="email"
              onChange={setEmail}
            >
              <Label>Email</Label>
              <Input
                placeholder="you@example.com"
                autoComplete="email"
                spellCheck="false"
              />
            </TextField>
            <TextField
              isRequired
              aria-label="Password for sign in"
              isDisabled={isLoading}
              type="password"
              value={password}
              name="password"
              onChange={setPassword}
            >
              <Label>Password</Label>
              <Input
                placeholder="Your password"
                autoComplete="current-password"
              />
            </TextField>
            <Button
              className="w-full font-semibold"
              variant="primary"
              size="lg"
              isDisabled={isLoading}
              isPending={isLoading}
              type="submit"
              aria-label={
                isLoading ? 'Submitting sign in form' : 'Submit sign in form'
              }
            >
              {isLoading ? 'Signing In…' : 'Sign In'}
            </Button>
            <div className="text-center text-sm pt-2">
              <p className="text-muted">
                Don&#39;t have an account?{' '}
                <NextLink
                  aria-label="Navigate to sign up page"
                  href="/auth/signup"
                  aria-disabled={isLoading}
                  className={clsx(
                    'font-semibold text-sm text-accent hover:opacity-80',
                    isLoading && 'pointer-events-none opacity-50',
                  )}
                >
                  Sign Up
                </NextLink>
              </p>
            </div>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
}
