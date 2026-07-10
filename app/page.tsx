'use client';

import type { Route } from 'next';

import { Card, Chip, Separator } from '@heroui/react';
import { buttonVariants } from '@heroui/styles';
import NextLink from 'next/link';
import {
  Shield,
  Rss,
  Clock,
  Download,
  Users,
  MessageSquare,
  ArrowRight,
  Sparkles,
  Settings,
} from 'lucide-react';

import { title, subtitle } from '@/components/primitives';

const features = [
  {
    id: 'auth',
    icon: Shield,
    title: 'Authentication Testing',
    description:
      'Test user authentication flows with protected routes and role-based access control.',
    color: 'accent' as const,
    href: '/auth/signin',
  },
  {
    id: 'api',
    icon: Rss,
    title: 'API Integration',
    description:
      'Explore API interactions with both public and protected endpoints.',
    color: 'accent' as const,
    href: '/news/public',
  },
  {
    id: 'clock',
    icon: Clock,
    title: 'Clock & Timers',
    description:
      'Test time-dependent UI with real-time updates and countdown timers.',
    color: 'success' as const,
    href: '/clock',
  },
  {
    id: 'download',
    icon: Download,
    title: 'File Downloads',
    description:
      'Practice testing file download scenarios with PDF, JSON, CSV and text files.',
    color: 'warning' as const,
    href: '/file-download',
  },
  {
    id: 'fixtures',
    icon: Users,
    title: 'Fixtures Demo',
    description:
      'CRUD operations for learning Playwright fixtures with user management.',
    color: 'danger' as const,
    href: '/fixtures-demo',
  },
  {
    id: 'dialogs',
    icon: MessageSquare,
    title: 'Dialog Handling',
    description:
      'Test alert, confirm, prompt and custom modal dialog interactions.',
    color: 'accent' as const,
    href: '/dialog-demo',
  },
  {
    id: 'settings',
    icon: Settings,
    title: 'User Settings',
    description:
      'Profile management and password changes with form validation testing.',
    color: 'accent' as const,
    href: '/settings',
  },
];

// Static classes so Tailwind can generate them (dynamic `bg-${color}` is never emitted).
const featureColorClasses: Record<
  (typeof features)[number]['color'],
  { bg: string; text: string }
> = {
  accent: { bg: 'bg-accent/10', text: 'text-accent' },
  success: { bg: 'bg-success/10', text: 'text-success' },
  warning: { bg: 'bg-warning/10', text: 'text-warning' },
  danger: { bg: 'bg-danger/10', text: 'text-danger' },
};

export default function Home() {
  return (
    <div className="flex flex-col gap-20 py-8 md:py-16">
      {/* Hero Section */}
      <section
        className="flex flex-col items-center justify-center gap-8 relative overflow-x-clip"
        aria-labelledby="hero-title"
      >
        {/* Decorative gradient blobs */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-150 h-150 bg-linear-to-r from-accent/20 via-accent/20 to-success/20 rounded-full blur-3xl opacity-30 pointer-events-none" />

        <div className="relative flex flex-col items-center gap-6">
          <Chip color="default" variant="soft" size="md">
            <Sparkles className="w-3.5 h-3.5 ml-1" aria-hidden="true" />
            Playwright Workshop
          </Chip>

          <div className="inline-block max-w-3xl text-center">
            <h1 id="hero-title" className="text-pretty">
              <span className={title({ size: 'lg' })}>Welcome to the&nbsp;</span>
              <br />
              <span className={title({ color: 'violet', size: 'lg' })}>
                Playwright Demo App
              </span>
            </h1>
            <p className={subtitle({ class: 'mt-6 mx-auto' })}>
              Explore various features and testing scenarios for the Playwright
              testing framework. From authentication flows to file downloads.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 mt-2">
            <NextLink
              className={buttonVariants({ variant: 'primary', size: 'lg' }) + ' rounded-full'}
              href="/news/public"
            >
              View Public News
              <ArrowRight className="w-4 h-4 ml-1" aria-hidden="true" />
            </NextLink>
            <NextLink
              className={buttonVariants({ variant: 'tertiary', size: 'lg' }) + ' rounded-full'}
              href="/news/private"
            >
              View Private News
            </NextLink>
            <NextLink
              className={buttonVariants({ variant: 'tertiary', size: 'lg' }) + ' rounded-full'}
              href="/auth/signin"
            >
              Sign In
            </NextLink>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: '7+', label: 'Test Pages' },
          { value: '4', label: 'Download Types' },
          { value: 'CRUD', label: 'Operations' },
          { value: 'a11y', label: 'Accessible' },
        ].map((stat) => (
          <Card key={stat.label} className="border border-border">
            <Card.Content className="p-4 text-center">
              <p className="text-2xl font-bold bg-clip-text text-transparent bg-linear-to-r from-accent to-success">
                {stat.value}
              </p>
              <p className="text-xs text-muted mt-1">{stat.label}</p>
            </Card.Content>
          </Card>
        ))}
      </section>

      <Separator />

      {/* Features Section */}
      <section className="flex flex-col gap-12">
        <div className="text-center">
          <Chip variant="soft" size="sm" className="mb-4">
            Explore
          </Chip>
          <h2
            className={title({ size: 'sm' })}
            id="features-title"
          >
            Key Features
          </h2>
          <p className="text-muted mt-3 text-lg max-w-lg mx-auto">
            Each page is designed for specific Playwright testing scenarios
          </p>
        </div>
        <ul
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0"
          aria-labelledby="features-title"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <li key={feature.id}>
                <NextLink
                  href={feature.href as Route}
                  className="block h-full group"
                >
                  <Card
                    aria-labelledby={`${feature.id}-feature-title`}
                    className="border border-border hover:border-border transition-all h-full group-hover:shadow-lg group-hover:-translate-y-1"
                  >
                    <Card.Content className="p-6 gap-4">
                      <div className="flex items-center justify-between">
                        <div
                          className={`w-12 h-12 rounded-xl ${featureColorClasses[feature.color].bg} flex items-center justify-center`}
                        >
                          <Icon
                            className={`w-6 h-6 ${featureColorClasses[feature.color].text}`}
                            aria-hidden="true"
                          />
                        </div>
                        <ArrowRight
                          className="w-4 h-4 text-muted group-hover:text-foreground group-hover:translate-x-1 transition-all"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <h3
                          className="text-lg font-semibold mb-1"
                          id={`${feature.id}-feature-title`}
                        >
                          {feature.title}
                        </h3>
                        <p className="text-muted text-sm leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </Card.Content>
                  </Card>
                </NextLink>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
