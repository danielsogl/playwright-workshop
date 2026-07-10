import type { Route } from 'next';

export type SiteConfig = typeof siteConfig;

interface NavItem {
  label: string;
  href: Route;
}

export const siteConfig = {
  name: 'Playwright Demo App',
  description: 'A demo application for Playwright testing workshops',
  navItems: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Public News',
      href: '/news/public',
    },
    {
      label: 'Private News',
      href: '/news/private',
    },
    {
      label: 'Clock',
      href: '/clock',
    },
    {
      label: 'File Download',
      href: '/file-download',
    },
    {
      label: 'Fixtures Demo',
      href: '/fixtures-demo',
    },
  ] satisfies NavItem[],
  navMenuItems: [
    {
      label: 'Home',
      href: '/',
    },
    {
      label: 'Public News',
      href: '/news/public',
    },
    {
      label: 'Private News',
      href: '/news/private',
    },
    {
      label: 'Clock',
      href: '/clock',
    },
    {
      label: 'File Download',
      href: '/file-download',
    },
    {
      label: 'Fixtures Demo',
      href: '/fixtures-demo',
    },
    {
      label: 'Settings',
      href: '/settings',
    },
  ] satisfies NavItem[],
};
