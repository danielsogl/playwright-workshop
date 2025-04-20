export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: 'Next.js + HeroUI',
  description: 'Make beautiful websites regardless of your design experience.',
  navItems: [
    {
      label: 'Home',
      href: '/',
      // Removed Docs, Pricing, Blog, About
    },
    {
      label: 'Public News',
      href: '/news/public',
    },
    {
      label: 'Private News',
      href: '/news/private', // This will show access denied if not logged in
    },
  ],
  // Updated navMenuItems for mobile view to reflect actual pages
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
    // Corrected object: Only keep Settings for now
    {
      label: 'Settings',
      href: '/settings',
    },
  ],
  links: {
    github: 'https://github.com/heroui-inc/heroui',
    twitter: 'https://twitter.com/hero_ui',
    docs: 'https://heroui.com',
    discord: 'https://discord.gg/9b6yyZKmH4',
    sponsor: 'https://patreon.com/jrgarciadev',
  },
};
