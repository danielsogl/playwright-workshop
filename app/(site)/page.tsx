import type { Route } from 'next';

import NextLink from 'next/link';
import { ArrowRight } from 'lucide-react';

import { eyebrow, title } from '@/components/primitives';

const features = [
  {
    id: 'auth',
    title: 'Authentication Testing',
    description:
      'Test user authentication flows with protected routes and role-based access control.',
    api: 'storageState',
    href: '/auth/signin',
  },
  {
    id: 'api',
    title: 'API Integration',
    description:
      'Explore API interactions with both public and protected endpoints.',
    api: 'page.route()',
    href: '/news/public',
  },
  {
    id: 'clock',
    title: 'Clock & Timers',
    description:
      'Test time-dependent UI with real-time updates and countdown timers.',
    api: 'page.clock',
    href: '/clock',
  },
  {
    id: 'download',
    title: 'File Downloads',
    description:
      'Practice testing file download scenarios with PDF, JSON, CSV and text files.',
    api: "waitForEvent('download')",
    href: '/file-download',
  },
  {
    id: 'fixtures',
    title: 'Fixtures Demo',
    description:
      'CRUD operations for learning Playwright fixtures with user management.',
    api: 'test.extend()',
    href: '/fixtures-demo',
  },
  {
    id: 'dialogs',
    title: 'Dialog Handling',
    description:
      'Test alert, confirm, prompt and custom modal dialog interactions.',
    api: "page.on('dialog')",
    href: '/dialog-demo',
  },
  {
    id: 'settings',
    title: 'User Settings',
    description:
      'Profile management and password changes with form validation testing.',
    api: 'getByLabel()',
    href: '/settings',
  },
];

// Decorative sample output; the ✘ line shows what a failing test looks like.
const terminalLines = [
  { ok: true, text: 'auth/signin.spec.ts' },
  { ok: true, text: 'news/public-feed.spec.ts' },
  { ok: true, text: 'clock/countdown.spec.ts' },
  { ok: true, text: 'downloads/csv.spec.ts' },
  { ok: true, text: 'fixtures/users.spec.ts' },
  { ok: false, text: 'dialogs/confirm.spec.ts' },
];

const pillLink =
  'inline-flex min-h-12 items-center gap-2 rounded-full px-[22px] font-semibold transition-colors';

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section
        className="flex flex-wrap items-center gap-14 pt-16 pb-16 md:pt-22 md:pb-18"
        aria-labelledby="hero-title"
      >
        <div className="flex min-w-0 flex-[1_1_520px] flex-col gap-7">
          <span className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-[13px] text-muted">
            <span
              className="size-2 rounded-full bg-accent"
              aria-hidden="true"
            />
            Playwright Workshop
          </span>
          <h1 id="hero-title" className={title({ size: 'lg' })}>
            Welcome to the{' '}
            <span className="text-accent">Playwright Demo App</span>
          </h1>
          <p className="max-w-[560px] text-[19px] leading-relaxed text-muted">
            Explore various features and testing scenarios for the Playwright
            testing framework. From authentication flows to file downloads.
          </p>
          <div className="flex flex-wrap gap-3">
            <NextLink
              className={`${pillLink} bg-accent text-accent-foreground hover:bg-accent-hover`}
              href="/news/public"
            >
              View Public News
              <ArrowRight className="size-[18px]" aria-hidden="true" />
            </NextLink>
            <NextLink
              className={`${pillLink} border border-foreground text-foreground hover:bg-default`}
              href="/news/private"
            >
              View Private News
            </NextLink>
            <NextLink
              className={`${pillLink} text-foreground underline underline-offset-4 hover:bg-default`}
              href="/auth/signin"
            >
              Sign In
            </NextLink>
          </div>
        </div>

        <figure
          aria-label="Example test run in the terminal"
          className="m-0 min-w-0 flex-[1_1_420px] overflow-hidden rounded-[18px] border border-terminal-border bg-terminal shadow-[0_30px_60px_-30px_rgba(18,22,19,.55)] dark:shadow-none"
        >
          <div
            className="flex items-center gap-2 border-b border-terminal-border px-[18px] py-3.5"
            aria-hidden="true"
          >
            <span className="size-2.5 rounded-full bg-[#3a413c]" />
            <span className="size-2.5 rounded-full bg-[#3a413c]" />
            <span className="size-2.5 rounded-full bg-[#3a413c]" />
            <span className="ml-2 font-mono text-xs text-terminal-muted">
              terminal
            </span>
          </div>
          <pre className="m-0 whitespace-pre-wrap px-[22px] pt-[22px] pb-[26px] font-mono text-sm leading-[1.85] text-[#d7ddd8]">
            <span className="text-terminal-muted">$</span> npx playwright test
            {terminalLines.map((line) => (
              <span key={line.text} className="block">
                <span
                  className={
                    line.ok ? 'text-terminal-accent' : 'text-[#ff9b6a]'
                  }
                >
                  {line.ok ? '  ✓ ' : '  ✘ '}
                </span>
                {line.text}
              </span>
            ))}
            <span className="block text-terminal-muted">
              {' '}
              ↳ expect(locator).toHaveText()
            </span>
            <span className="text-terminal-muted">$</span>{' '}
            <span className="inline-block h-[17px] w-[9px] bg-terminal-accent align-[-3px]" />
          </pre>
        </figure>
      </section>

      {/* Scenarios */}
      <section
        className="flex flex-col gap-9 pt-6 pb-24"
        aria-labelledby="features-title"
      >
        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-foreground pt-5">
          <div className="flex flex-col gap-1.5">
            <span className={eyebrow()}>Scenarios</span>
            <h2 id="features-title" className={title({ size: 'sm' })}>
              Key Features
            </h2>
          </div>
          <p className="max-w-[420px] text-muted">
            Each page is designed for specific Playwright testing scenarios
          </p>
        </div>

        <ul
          className="m-0 grid list-none grid-cols-1 gap-4 p-0 md:grid-cols-2 lg:grid-cols-3"
          aria-labelledby="features-title"
        >
          {features.map((feature, index) => (
            <li key={feature.id} className="flex">
              <NextLink
                href={feature.href as Route}
                aria-labelledby={`${feature.id}-feature-title`}
                className="group flex flex-1 flex-col gap-[18px] rounded-2xl border border-border bg-surface p-6 text-foreground transition-[border-color,box-shadow] hover:border-foreground hover:shadow-[0_1px_0_var(--foreground),0_12px_24px_-16px_rgba(18,22,19,.35)]"
              >
                <div className="flex items-center justify-between">
                  <span className={eyebrow()}>
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <ArrowRight
                    className="size-5 transition-transform group-hover:translate-x-1"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h3
                    id={`${feature.id}-feature-title`}
                    className="font-display text-[22px] font-bold tracking-[-0.01em]"
                  >
                    {feature.title}
                  </h3>
                  <p className="text-[15px] text-muted">
                    {feature.description}
                  </p>
                </div>
                <code className="mt-auto self-start rounded-lg bg-accent-soft px-2.5 py-1 font-mono text-[13px] text-accent-soft-foreground">
                  {feature.api}
                </code>
              </NextLink>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
