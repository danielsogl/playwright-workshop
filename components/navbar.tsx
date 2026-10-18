'use client';

import { Button, Dropdown, Avatar } from '@heroui/react';
import NextLink from 'next/link';
import { buttonVariants } from '@heroui/styles';
import clsx from 'clsx';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Check } from 'lucide-react';

import { siteConfig } from '@/config/site';
import { ThemeSwitch } from '@/components/theme-switch';

export const Navbar = () => {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  // Helper function to get initials
  const getInitials = (name?: string | null) => {
    if (!name) return '';

    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/85 backdrop-blur-lg border-b border-border">
      <nav
        aria-label="Main navigation bar"
        className="mx-auto flex max-w-310 items-center justify-between gap-4 px-6 min-h-16 py-2.5"
      >
        {/* Brand + desktop nav */}
        <div className="flex items-center gap-7">
          <NextLink
            aria-label="Go to homepage"
            className="flex justify-start items-center gap-2.5 max-w-fit text-foreground"
            href="/"
          >
            <span
              aria-hidden="true"
              className="flex size-8 items-center justify-center rounded-lg bg-foreground text-background dark:bg-accent dark:text-accent-foreground"
            >
              <Check
                className="size-[18px] text-terminal-accent dark:text-accent-foreground"
                strokeWidth={3}
              />
            </span>
            <span className="font-display text-lg font-bold tracking-tight">
              Demo App
            </span>
          </NextLink>
          <nav aria-label="Main navigation" className="hidden lg:flex">
            <ul className="flex gap-1 justify-start">
              {siteConfig.navItems.map((item) => (
                <li key={item.href}>
                  <NextLink
                    aria-label={`Navigate to ${item.label}`}
                    aria-current={pathname === item.href ? 'page' : undefined}
                    className="block whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-hover aria-[current=page]:bg-foreground aria-[current=page]:text-background"
                    href={item.href}
                  >
                    {item.label}
                  </NextLink>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Desktop right side */}
        <div className="hidden sm:flex items-center gap-2 justify-end">
          <ThemeSwitch />
          <div className="hidden md:flex">
            {isLoading ? (
              <Button
                isPending
                aria-label="Loading authentication status"
                variant="secondary"
              >
                Loading…
              </Button>
            ) : session ? (
              <Dropdown>
                <Dropdown.Trigger
                  aria-label="User profile actions menu"
                  className="rounded-full transition-transform"
                >
                  <Avatar size="sm" color="default" className="size-11">
                    <Avatar.Image
                      src={session.user?.image || undefined}
                      alt={session.user?.name || 'User'}
                    />
                    <Avatar.Fallback className="bg-accent font-semibold text-accent-foreground">
                      {getInitials(session.user?.name)}
                    </Avatar.Fallback>
                  </Avatar>
                </Dropdown.Trigger>
                <Dropdown.Popover placement="bottom end">
                  <Dropdown.Menu aria-label="Profile Actions">
                    <Dropdown.Item
                      id="profile"
                      textValue="Signed in"
                      className="h-14 gap-2"
                    >
                      <div className="flex flex-col">
                        <p className="font-semibold">Signed in as</p>
                        <p className="font-semibold">{session.user?.email}</p>
                      </div>
                    </Dropdown.Item>
                    <Dropdown.Item
                      id="settings"
                      href="/settings"
                      textValue="Settings"
                    >
                      Settings
                    </Dropdown.Item>
                    <Dropdown.Item
                      id="logout"
                      textValue="Log Out"
                      variant="danger"
                      onAction={() => signOut({ callbackUrl: '/' })}
                    >
                      Log Out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            ) : (
              <NextLink
                aria-label="Sign in to your account"
                className="inline-flex min-h-11 items-center rounded-full bg-foreground px-[18px] text-sm font-semibold text-background transition-colors hover:bg-accent hover:text-accent-foreground"
                href="/auth/signin"
              >
                Sign In
              </NextLink>
            )}
          </div>
        </div>

        {/* Mobile right side */}
        <div className="sm:hidden flex items-center gap-2 justify-end">
          <ThemeSwitch />
          <button
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            className="flex size-11 flex-col items-center justify-center gap-1 rounded-full border border-border"
            type="button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden border-t border-border bg-background">
          <div
            className="mx-4 mt-2 pb-4 flex flex-col gap-1"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {siteConfig.navMenuItems.map((item) => (
              <NextLink
                key={item.href}
                aria-label={`Navigate to ${item.label}`}
                aria-current={pathname === item.href ? 'page' : undefined}
                className="rounded-xl px-3 py-2.5 text-lg font-medium text-foreground aria-[current=page]:bg-foreground aria-[current=page]:text-background"
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NextLink>
            ))}
            {isLoading ? (
              <span
                className="text-muted"
                aria-label="Loading authentication status"
              >
                Loading…
              </span>
            ) : session ? (
              <Button
                aria-label="Sign out"
                className="w-full rounded-full"
                variant="primary"
                onPress={() => signOut({ callbackUrl: '/' })}
              >
                Sign Out ({session.user?.name || session.user?.email})
              </Button>
            ) : (
              <NextLink
                aria-label="Sign in to your account"
                className={clsx(
                  buttonVariants({ variant: 'primary' }),
                  'w-full rounded-full',
                )}
                href="/auth/signin"
              >
                Sign In
              </NextLink>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
