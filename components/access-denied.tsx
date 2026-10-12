import NextLink from 'next/link';
import { Lock } from 'lucide-react';

interface AccessDeniedProps {
  /** Accessible name of the sign-in link, e.g. "Sign in to view settings" */
  linkLabel: string;
  linkId?: string;
}

export function AccessDenied({ linkLabel, linkId }: AccessDeniedProps) {
  return (
    <div className="flex min-h-[calc(100vh-14rem)] items-center justify-center py-14">
      <div className="flex w-full max-w-md flex-col items-center gap-3.5 rounded-[20px] border border-border bg-surface px-8 py-10 text-center">
        <span className="flex size-16 items-center justify-center rounded-[18px] bg-danger-soft text-danger">
          <Lock className="size-7" aria-hidden="true" />
        </span>
        <h1
          className="font-display text-[32px] font-extrabold tracking-[-0.02em]"
          id="access-denied-title"
        >
          Access Denied
        </h1>
        <p className="text-muted">You must be signed in to view this page.</p>
        <NextLink
          aria-label={linkLabel}
          className="mt-1.5 inline-flex min-h-12 items-center rounded-full bg-accent px-6 font-semibold text-accent-foreground hover:bg-accent-hover"
          href="/auth/signin"
          id={linkId}
        >
          Sign In
        </NextLink>
      </div>
    </div>
  );
}
