'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { TextField, Label, Input, Button } from '@heroui/react';
import NextLink from 'next/link';
import clsx from 'clsx';

import { AuthShell, Str } from '@/components/auth-shell';
import { useIsSSR } from '@react-aria/ssr';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  // Vor der Hydration würde ein Klick das Formular nativ abschicken (ohne signIn).
  // Deaktiviert wartet Playwright beim Klick automatisch, bis der Button bereit ist.
  const isSSR = useIsSSR();

  const handleSubmit = async (e: React.SyntheticEvent) => {
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
    <AuthShell
      code={
        <>
          {'await page.context().storageState({\n  path: '}
          <Str>'.auth/user.json'</Str>
          {',\n});'}
        </>
      }
      headline="Log in once, reuse the session in every test."
      label="01 · storageState"
      subtitle="Sign in to access your account"
      title="Welcome Back"
      titleId="signin-title"
    >
      <form
        aria-label="Sign in form"
        className="space-y-5"
        onSubmit={handleSubmit}
        name="signin-form"
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
          aria-label="Email address for sign in"
          isDisabled={isLoading || isSSR}
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
          isDisabled={isLoading || isSSR}
          type="password"
          value={password}
          name="password"
          onChange={setPassword}
        >
          <Label>Password</Label>
          <Input placeholder="Your password" autoComplete="current-password" />
        </TextField>
        <Button
          className="w-full rounded-full font-semibold"
          variant="primary"
          size="lg"
          isDisabled={isLoading || isSSR}
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
                'font-semibold text-sm text-accent underline-offset-4 hover:underline',
                isLoading && 'pointer-events-none opacity-50',
              )}
            >
              Sign Up
            </NextLink>
          </p>
        </div>
      </form>
    </AuthShell>
  );
}
