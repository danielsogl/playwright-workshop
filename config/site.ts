import type { Route } from 'next';

interface NavItem {
  label: string;
  href: Route;
}

const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Public News', href: '/news/public' },
  { label: 'Private News', href: '/news/private' },
  { label: 'Clock', href: '/clock' },
  { label: 'File Download', href: '/file-download' },
  { label: 'Fixtures Demo', href: '/fixtures-demo' },
] satisfies NavItem[];

export const siteConfig = {
  name: 'Playwright Demo App',
  description: 'A demo application for Playwright testing workshops',
  navItems,
  // Mobile menu: same links plus Settings.
  navMenuItems: [
    ...navItems,
    { label: 'Settings', href: '/settings' },
  ] satisfies NavItem[],
};
