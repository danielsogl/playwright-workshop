'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { TextField, Label, Input, Button } from '@heroui/react';
import NextLink from 'next/link';

import { AuthShell, Str } from '@/components/auth-shell';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.SyntheticEvent) => {
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
    <AuthShell
      code={
        <>
          {'await page.getByLabel('}
          <Str>'Name'</Str>
          {').fill('}
          <Str>'Ada'</Str>
          {');\nawait page.getByRole('}
          <Str>'button'</Str>
          {', {\n  name: '}
          <Str>'Create Account'</Str>
          {',\n}).click();'}
        </>
      }
      headline="Every field has a label. Your locators will thank you."
      label="01 · getByRole"
      subtitle="Get started with your free account"
      title="Create Account"
      titleId="signup-title"
    >
      <form
        aria-label="Sign up form"
        className="space-y-5"
        onSubmit={handleSubmit}
        name="signup-form"
      >
        {error && (
          <div
            className="rounded-xl bg-danger-soft p-3 text-sm text-danger-soft-foreground"
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
          <Input placeholder="Your Name" autoComplete="name" id="signup-name" />
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
          className="w-full rounded-full font-semibold"
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
              className="font-semibold text-sm text-accent underline-offset-4 hover:underline"
            >
              Sign In
            </NextLink>
          </p>
        </div>
      </form>
    </AuthShell>
  );
}
