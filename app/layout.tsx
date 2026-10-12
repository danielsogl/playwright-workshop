import '@/styles/globals.css';
import { Metadata, Viewport } from 'next';
import { Providers } from './providers';

import { siteConfig } from '@/config/site';
import { fontDisplay, fontMono, fontSans } from '@/config/fonts';

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
    { media: '(prefers-color-scheme: light)', color: '#f3f4f1' },
    { media: '(prefers-color-scheme: dark)', color: '#0e110f' },
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
        className={`min-h-dvh bg-background text-foreground font-sans antialiased ${fontSans.variable} ${fontDisplay.variable} ${fontMono.variable}`}
      >
        <Providers themeProps={{ attribute: 'class', defaultTheme: 'system' }}>
          <div className="relative flex flex-col min-h-dvh">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:p-4 focus:bg-accent focus:text-accent-foreground focus:rounded-full"
            >
              Skip to main content
            </a>
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
