// Fullscreen layout for sign-in and sign-up: no navbar, no footer.
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main
      id="main-content"
      // tabIndex=-1 lets the skip link move focus here when activated.
      tabIndex={-1}
      className="flex min-h-dvh grow outline-hidden"
    >
      {children}
    </main>
  );
}
