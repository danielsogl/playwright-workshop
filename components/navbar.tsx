'use client';

import { Button, Dropdown, Avatar } from '@heroui/react';
import NextLink from 'next/link';
import { buttonVariants } from '@heroui/styles';
import clsx from 'clsx';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

import { siteConfig } from '@/config/site';
import { ThemeSwitch } from '@/components/theme-switch';
import { Logo } from '@/components/icons';

export const Navbar = () => {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Helper function to get initials
  const getInitials = (name?: string | null) => {
    if (!name) return '';

    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/70 backdrop-blur-lg border-b border-border">
      <nav
        aria-label="Main navigation bar"
        className="mx-auto flex max-w-304 items-center justify-between gap-4 px-6 h-16"
      >
        {/* Brand + desktop nav */}
        <div className="flex items-center gap-6">
          <NextLink
            aria-label="Go to homepage"
            className="flex justify-start items-center gap-1 max-w-fit"
            href="/"
          >
            <Logo aria-hidden="true" />
            <span className="font-bold text-inherit">Feeds</span>
          </NextLink>
          <nav aria-label="Main navigation" className="hidden lg:flex">
            <ul className="flex gap-4 justify-start">
              {siteConfig.navItems.map((item) => (
                <li key={item.href}>
                  <NextLink
                    aria-label={`Navigate to ${item.label}`}
                    className="whitespace-nowrap text-foreground hover:text-accent data-[active=true]:text-accent data-[active=true]:font-medium"
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
        <div className="hidden sm:flex items-center gap-3 justify-end">
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
                  <Avatar
                    size="sm"
                    color="default"
                    className="ring-2 ring-background"
                  >
                    <Avatar.Image
                      src={session.user?.image || undefined}
                      alt={session.user?.name || 'User'}
                    />
                    <Avatar.Fallback>
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
                      onAction={() => signOut()}
                    >
                      Log Out
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown.Popover>
              </Dropdown>
            ) : (
              <NextLink
                aria-label="Sign in to your account"
                className={buttonVariants({ variant: 'tertiary', size: 'sm' })}
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
            className="flex flex-col justify-center gap-1 p-2"
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
            className="mx-4 mt-2 pb-4 flex flex-col gap-2"
            role="navigation"
            aria-label="Mobile navigation"
          >
            {siteConfig.navMenuItems.map((item, index) => (
                <NextLink
                  key={`${item.href}-${index}`}
                  aria-label={`Navigate to ${item.label}`}
                  className={clsx(
                    'text-lg py-1',
                    index === 2
                      ? 'text-accent'
                      : index === siteConfig.navMenuItems.length - 2
                        ? 'text-danger'
                        : 'text-foreground',
                  )}
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
                className="w-full"
                variant="primary"
                onPress={() => signOut()}
              >
                Sign Out ({session.user?.name || session.user?.email})
              </Button>
            ) : (
              <NextLink
                aria-label="Sign in to your account"
                className={clsx(
                  buttonVariants({ variant: 'primary' }),
                  'w-full',
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
