'use client';

import {
  Navbar as HeroUINavbar,
  NavbarContent,
  NavbarMenu,
  NavbarMenuToggle,
  NavbarBrand,
  NavbarItem,
  NavbarMenuItem,
} from '@heroui/navbar';
import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import { link as linkStyles } from '@heroui/theme';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from '@heroui/dropdown';
import { Avatar } from '@heroui/avatar';
import NextLink from 'next/link';
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
    <HeroUINavbar
      maxWidth="xl"
      position="sticky"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      aria-label="Main navigation bar"
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink
            aria-label="Go to homepage"
            className="flex justify-start items-center gap-1"
            href="/"
          >
            <Logo />
            <p className="font-bold text-inherit">Feeds</p>
          </NextLink>
        </NavbarBrand>
        <ul
          className="hidden lg:flex gap-4 justify-start ml-2"
          role="navigation"
          aria-label="Main navigation"
        >
          {siteConfig.navItems.map((item) => (
            <NavbarItem key={item.href}>
              <NextLink
                aria-label={`Navigate to ${item.label}`}
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:text-primary data-[active=true]:font-medium',
                )}
                color="foreground"
                href={item.href}
                role="menuitem"
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem className="hidden md:flex">
          {isLoading ? (
            <Button
              isLoading
              color="default"
              aria-label="Loading authentication status"
              variant="flat"
            >
              Loading...
            </Button>
          ) : session ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  aria-label="User profile actions menu"
                  as="button"
                  className="transition-transform"
                  color="secondary"
                  name={getInitials(session.user?.name)}
                  size="sm"
                  src={session.user?.image || undefined}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem
                  key="profile"
                  className="h-14 gap-2"
                  role="menuitem"
                >
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{session.user?.email}</p>
                </DropdownItem>
                <DropdownItem
                  key="settings"
                  as={NextLink}
                  href="/settings"
                  role="menuitem"
                >
                  Settings
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  onClick={() => signOut()}
                  role="menuitem"
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button
              aria-label="Sign in to your account"
              as={NextLink}
              color="primary"
              href="/auth/signin"
              size="sm"
              variant="flat"
            >
              Sign In
            </Button>
          )}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitch />
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        />
      </NavbarContent>

      <NavbarMenu>
        <div
          className="mx-4 mt-2 flex flex-col gap-2"
          role="navigation"
          aria-label="Mobile navigation"
        >
          {siteConfig.navMenuItems
            .filter((item) => item.href !== '/logout')
            .map((item, index) => (
              <NavbarMenuItem key={`${item.href}-${index}`}>
                <Link
                  aria-label={`Navigate to ${item.label}`}
                  color={
                    index === 2
                      ? 'primary'
                      : index === siteConfig.navMenuItems.length - 2
                        ? 'danger'
                        : 'foreground'
                  }
                  href={item.href}
                  size="lg"
                >
                  {item.label}
                </Link>
              </NavbarMenuItem>
            ))}
          <NavbarMenuItem>
            {isLoading ? (
              <span
                className="text-default-500"
                aria-label="Loading authentication status"
              >
                Loading...
              </span>
            ) : session ? (
              <Button
                aria-label="Sign out"
                className="w-full"
                color="warning"
                variant="flat"
                onClick={() => signOut()}
              >
                Sign Out ({session.user?.name || session.user?.email})
              </Button>
            ) : (
              <Button
                aria-label="Sign in to your account"
                as={NextLink}
                className="w-full"
                color="primary"
                href="/auth/signin"
                variant="flat"
              >
                Sign In
              </Button>
            )}
          </NavbarMenuItem>
        </div>
      </NavbarMenu>
    </HeroUINavbar>
  );
};
