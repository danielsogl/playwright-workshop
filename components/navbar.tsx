'use client'; // Add client directive for useSession hook

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
import { useSession, signOut } from 'next-auth/react'; // Import useSession and signOut
import { useState } from 'react';

import { siteConfig } from '@/config/site';
import { ThemeSwitch } from '@/components/theme-switch';
import { Logo } from '@/components/icons'; // Added Logo import

export const Navbar = () => {
  const { data: session, status } = useSession(); // Get session data and status
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
    >
      <NavbarContent
        className="basis-1/5 sm:basis-full"
        data-testid="navbar-content-start"
        justify="start"
      >
        <NavbarBrand
          as="li"
          className="gap-3 max-w-fit"
          data-testid="navbar-brand"
        >
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
          data-testid="navbar-links-desktop"
        >
          {siteConfig.navItems.map((item) => (
            <NavbarItem
              key={item.href}
              data-testid={`nav-item-${item.label.toLowerCase()}`}
            >
              <NextLink
                aria-label={`Navigate to ${item.label}`} // Added aria-label
                className={clsx(
                  linkStyles({ color: 'foreground' }),
                  'data-[active=true]:text-primary data-[active=true]:font-medium',
                )}
                color="foreground"
                href={item.href}
              >
                {item.label}
              </NextLink>
            </NavbarItem>
          ))}
        </ul>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        data-testid="navbar-content-end" // Added data-testid
        justify="end"
      >
        <NavbarItem
          className="hidden sm:flex gap-2"
          data-testid="nav-item-theme-switch"
        >
          <ThemeSwitch />
        </NavbarItem>
        <NavbarItem
          className="hidden md:flex"
          data-testid="nav-item-auth-status"
        >
          {isLoading ? (
            <Button
              isLoading
              color="default"
              data-testid="btn-auth-loading"
              variant="flat"
            >
              Loading...
            </Button>
          ) : session ? (
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  isBordered
                  aria-label="User profile actions menu" // Added aria-label
                  as="button"
                  className="transition-transform"
                  color="secondary"
                  data-testid="dropdown-trigger-user" // Added data-testid
                  name={getInitials(session.user?.name)}
                  size="sm"
                  src={session.user?.image || undefined}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem
                  key="profile"
                  className="h-14 gap-2"
                  data-testid="dropdown-item-user-info"
                >
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">{session.user?.email}</p>
                </DropdownItem>
                <DropdownItem
                  key="settings"
                  as={NextLink}
                  data-testid="dropdown-item-settings"
                  href="/settings"
                >
                  Settings
                </DropdownItem>
                <DropdownItem
                  key="logout"
                  color="danger"
                  data-testid="dropdown-item-logout" // Added data-testid
                  onClick={() => signOut()}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          ) : (
            <Button
              aria-label="Sign in to your account" // Added aria-label
              as={NextLink}
              color="primary"
              data-testid="btn-signin" // Added data-testid
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
        <div className="mx-4 mt-2 flex flex-col gap-2">
          {siteConfig.navMenuItems
            .filter((item) => item.href !== '/logout') // Keep filtering logout if needed
            .map((item, index) => (
              <NavbarMenuItem
                key={`${item.href}-${index}`}
                data-testid={`nav-menu-item-${item.label.toLowerCase()}`}
              >
                <Link
                  aria-label={`Navigate to ${item.label}`} // Added aria-label
                  color={
                    index === 2
                      ? 'primary'
                      : index === siteConfig.navMenuItems.length - 2 // Adjust index if filter changes length
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
          <NavbarMenuItem data-testid="nav-menu-item-auth-action">
            {isLoading ? (
              <span
                className="text-default-500"
                data-testid="text-auth-loading-menu"
              >
                Loading...
              </span>
            ) : session ? (
              <Button
                aria-label="Sign out" // Added aria-label
                className="w-full"
                color="warning"
                data-testid="btn-signout-menu" // Added data-testid
                variant="flat"
                onClick={() => signOut()}
              >
                Sign Out ({session.user?.name || session.user?.email})
              </Button>
            ) : (
              <Button
                aria-label="Sign in to your account" // Added aria-label
                as={NextLink}
                className="w-full"
                color="primary"
                data-testid="btn-signin-menu" // Added data-testid
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
