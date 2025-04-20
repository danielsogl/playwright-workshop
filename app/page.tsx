import { Link } from '@heroui/link';
import { button as buttonStyles } from '@heroui/theme';
import NextLink from 'next/link'; // Import NextLink for internal navigation
import { Card, CardBody } from '@heroui/card';

import { title, subtitle } from '@/components/primitives';
// Keep GithubIcon if needed, or remove if not

export default function Home() {
  return (
    <div className="flex flex-col gap-10 py-8 md:py-10" data-testid="page-home">
      {/* Hero Section */}
      <section
        className="flex flex-col items-center justify-center gap-6"
        data-testid="section-hero"
      >
        <div className="inline-block max-w-2xl text-center justify-center">
          <h1 className={title()} data-testid="hero-title-1">
            Welcome to the&nbsp;
          </h1>
          <h1 className={title({ color: 'violet' })} data-testid="hero-title-2">
            Playwright Demo App
          </h1>
          <p className={subtitle({ class: 'mt-4' })}>
            This application is designed to showcase various features and
            testing scenarios for the Playwright testing framework. Explore the
            different sections to see examples of authentication, API
            interactions, and dynamic content.
          </p>
        </div>

        <div
          className="flex flex-wrap justify-center gap-4"
          data-testid="hero-links"
        >
          <Link
            aria-label="Navigate to public news page" // Added aria-label
            as={NextLink}
            className={buttonStyles({
              color: 'primary',
              radius: 'md',
              variant: 'solid',
            })}
            data-testid="link-public-news" // Added data-testid
            href="/news/public" // Link to Public News
          >
            View Public News
          </Link>
          <Link
            aria-label="Navigate to private news page" // Added aria-label
            as={NextLink}
            className={buttonStyles({
              color: 'secondary',
              radius: 'md',
              variant: 'solid',
            })}
            data-testid="link-private-news" // Added data-testid
            href="/news/private" // Link to Private News (will show access denied if not logged in)
          >
            View Private News
          </Link>
          <Link
            aria-label="Navigate to sign in page" // Added aria-label
            as={NextLink}
            className={buttonStyles({
              color: 'default',
              radius: 'md',
              variant: 'bordered',
            })}
            data-testid="link-signin" // Added data-testid
            href="/auth/signin" // Link to Sign In
          >
            Sign In
          </Link>
          {/* Optional: Link to GitHub repo if relevant */}
          {/* <Link
            isExternal
            className={buttonStyles({ variant: 'bordered', radius: 'full' })}
            href={siteConfig.links.github}
          >
            <GithubIcon size={20} />
            GitHub
          </Link> */}
        </div>
      </section>

      {/* Features Section */}
      <section className="flex flex-col gap-8" data-testid="section-features">
        <h2
          className={title({ size: 'sm', class: 'text-center' })}
          data-testid="features-title"
        >
          Key Features
        </h2>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          data-testid="features-grid"
        >
          <Card data-testid="feature-card-auth">
            <CardBody className="text-center">
              <h3 className="text-xl font-bold mb-2">Authentication Testing</h3>
              <p className="text-default-500">
                Test user authentication flows with protected routes and
                role-based access control.
              </p>
            </CardBody>
          </Card>
          <Card data-testid="feature-card-api">
            <CardBody className="text-center">
              <h3 className="text-xl font-bold mb-2">API Integration</h3>
              <p className="text-default-500">
                Explore API interactions with both public and protected
                endpoints.
              </p>
            </CardBody>
          </Card>
          <Card data-testid="feature-card-dynamic">
            <CardBody className="text-center">
              <h3 className="text-xl font-bold mb-2">Dynamic Content</h3>
              <p className="text-default-500">
                Test handling of dynamic content updates and state management.
              </p>
            </CardBody>
          </Card>
        </div>
      </section>
    </div>
  );
}
