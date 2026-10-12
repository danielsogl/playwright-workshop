import { siteConfig } from '@/config/site';
import { Navbar } from '@/components/navbar';

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main
        id="main-content"
        // tabIndex=-1 lets the skip link move focus here when activated.
        tabIndex={-1}
        className="mx-auto w-full max-w-310 px-6 grow outline-hidden"
      >
        {children}
      </main>
      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-310 flex-wrap justify-between gap-3 px-6 py-7 text-sm text-muted">
          <span>{siteConfig.name} – a playground for workshop exercises</span>
          <span className="font-mono">npm run e2e</span>
        </div>
      </footer>
    </>
  );
}
