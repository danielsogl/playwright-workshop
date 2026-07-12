import '@/styles/globals.css';
import { Metadata, Viewport } from 'next';
import { Providers } from './providers';

import { siteConfig } from '@/config/site';
import { fontSans } from '@/config/fonts';
import { Navbar } from '@/components/navbar';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="de">
      <body
        className={`min-h-dvh bg-background font-sans antialiased ${fontSans.variable}`}
      >
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'dark' }}>
          <div className="relative flex flex-col min-h-dvh">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-accent focus:text-white focus:rounded-md"
            >
              Skip to main content
            </a>
            <Navbar />
            <main
              id="main-content"
              // tabIndex=-1 lets the skip link move focus here when activated.
              tabIndex={-1}
              className="container mx-auto max-w-7xl pt-16 px-6 grow outline-hidden"
            >
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
