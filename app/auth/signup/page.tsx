'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { TextField, Label, Input, Button, Card, Separator } from '@heroui/react';
import NextLink from 'next/link';
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
      <Card className="w-full max-w-md shadow-lg border border-border">
        <Card.Header className="flex flex-col items-center gap-2 pt-8 pb-0">
          <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-2">
            <UserPlus className="w-7 h-7 text-accent" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-bold" id="signup-title">
            Create Account
          </h1>
          <p className="text-muted text-sm">
            Get started with your free account
          </p>
        </Card.Header>
        <Separator className="mt-4" />
        <Card.Content className="px-8 py-6">
          <form
            aria-label="Sign up form"
            className="space-y-5"
            onSubmit={handleSubmit}
            name="signup-form"
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
              aria-label="Your name for sign up"
              isDisabled={isLoading}
              type="text"
              value={name}
              name="name"
              onChange={setName}
            >
              <Label>Name</Label>
              <Input
                placeholder="Your Name"
                autoComplete="name"
                id="signup-name"
              />
            </TextField>
            <TextField
              isRequired
              aria-label="Email address for sign up"
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
                id="signup-email"
              />
            </TextField>
            <TextField
              isRequired
              aria-label="Password for sign up"
              isDisabled={isLoading}
              type="password"
              value={password}
              name="password"
              onChange={setPassword}
            >
              <Label>Password</Label>
              <Input
                placeholder="Choose a password"
                autoComplete="new-password"
                id="signup-password"
              />
            </TextField>
            <Button
              className="w-full font-semibold"
              variant="primary"
              size="lg"
              isDisabled={isLoading || !name || !email || !password}
              isPending={isLoading}
              type="submit"
              aria-label={
                isLoading ? 'Submitting sign up form' : 'Submit sign up form'
              }
              id="signup-submit"
            >
              {isLoading ? 'Signing Up…' : 'Create Account'}
            </Button>

            <div className="text-center text-sm pt-2">
              <p className="text-muted">
                Already have an account?{' '}
                <NextLink
                  aria-label="Navigate to sign in page"
                  href="/auth/signin"
                  className="font-semibold text-sm text-accent hover:opacity-80"
                >
                  Sign In
                </NextLink>
              </p>
            </div>
          </form>
        </Card.Content>
      </Card>
    </div>
  );
}
