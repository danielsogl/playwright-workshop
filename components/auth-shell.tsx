import NextLink from 'next/link';
import { Check } from 'lucide-react';

import { title } from '@/components/primitives';

interface AuthShellProps {
  label: string;
  headline: string;
  code: React.ReactNode;
  titleId: string;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

/** Fullscreen split layout: dark code panel next to the form (stacks on mobile). */
export function AuthShell({
  label,
  headline,
  code,
  titleId,
  title: heading,
  subtitle,
  children,
}: AuthShellProps) {
  return (
    <div className="flex w-full flex-col lg:flex-row">
      <aside className="flex flex-col justify-between gap-12 bg-terminal px-6 py-5 text-terminal-foreground lg:flex-1 lg:px-12 lg:py-10">
        <NextLink
          aria-label="Go to homepage"
          className="flex items-center gap-2.5 self-start text-terminal-foreground"
          href="/"
        >
          <span
            aria-hidden="true"
            className="flex size-8 items-center justify-center rounded-lg bg-terminal-accent text-terminal"
          >
            <Check className="size-[18px]" strokeWidth={3} />
          </span>
          <span className="font-display text-lg font-bold">Demo App</span>
        </NextLink>
        <div className="hidden max-w-[460px] flex-col gap-5 lg:flex">
          <span className="font-mono text-[13px] text-terminal-muted">
            {label}
          </span>
          <p className="font-display text-[40px] leading-[1.08] font-bold tracking-[-0.02em]">
            {headline}
          </p>
          <pre className="m-0 rounded-xl border border-terminal-border px-[18px] py-4 font-mono text-[13px] leading-[1.7] whitespace-pre-wrap text-[#d7ddd8]">
            {code}
          </pre>
        </div>
        <span className="hidden text-sm text-terminal-muted lg:block">
          Playwright Workshop
        </span>
      </aside>
      <div className="flex flex-1 items-center justify-center px-6 py-14">
        <div className="flex w-full max-w-[400px] flex-col gap-6">
          <div className="flex flex-col gap-1.5">
            <h1 className={title({ size: 'md' })} id={titleId}>
              {heading}
            </h1>
            <p className="text-muted">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

/** Highlights a string literal inside the code panel */
export const Str = ({ children }: { children: string }) => (
  <span className="text-terminal-accent">{children}</span>
);
