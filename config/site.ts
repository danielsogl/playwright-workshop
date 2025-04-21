export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'Next.js + HeroUI',
  description: 'Make beautiful websites regardless of your design experience.',
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
  ],
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
      label: 'Settings',
      href: '/settings',
    },
  ],
};
