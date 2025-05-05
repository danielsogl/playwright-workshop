import { Link } from '@heroui/link';
import { button as buttonStyles } from '@heroui/theme';
import NextLink from 'next/link';
import { Card, CardBody } from '@heroui/card';

import { title, subtitle } from '@/components/primitives';

export default function Home() {
  return (
    <div
      className="flex flex-col gap-10 py-8 md:py-10"
      role="main"
      aria-labelledby="hero-title-1 hero-title-2"
    >
      {/* Hero Section */}
      <section
        className="flex flex-col items-center justify-center gap-6"
        aria-labelledby="hero-title-1 hero-title-2"
      >
        <div className="inline-block max-w-2xl text-center justify-center">
          <h1 className={title()} id="hero-title-1">
            Welcome to the&nbsp;
          </h1>
          <h1 className={title({ color: 'violet' })} id="hero-title-2">
            Playwright Demo App
          </h1>
          <p className={subtitle({ class: 'mt-4' })}>
            This application is designed to showcase various features and
            testing scenarios for the Playwright testing framework. Explore the
            different sections to see examples of authentication, API
            interactions, and dynamic content.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          <Link
            aria-label="Navigate to public news page"
            as={NextLink}
            className={buttonStyles({
              color: 'primary',
              radius: 'md',
              variant: 'solid',
            })}
            href="/news/public"
          >
            View Public News
          </Link>
          <Link
            aria-label="Navigate to private news page"
            as={NextLink}
            className={buttonStyles({
              color: 'secondary',
              radius: 'md',
              variant: 'solid',
            })}
            href="/news/private"
          >
            View Private News
          </Link>
          <Link
            aria-label="Navigate to sign in page"
            as={NextLink}
            className={buttonStyles({
              color: 'default',
              radius: 'md',
              variant: 'bordered',
            })}
            href="/auth/signin"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className="flex flex-col gap-8">
        <h2
          className={title({ size: 'sm', class: 'text-center' })}
          id="features-title"
        >
          Key Features
        </h2>
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          role="list"
          aria-labelledby="features-title"
        >
          <Card role="listitem" aria-labelledby="auth-feature-title">
            <CardBody className="text-center">
              <h3 className="text-xl font-bold mb-2" id="auth-feature-title">
                Authentication Testing
              </h3>
              <p className="text-default-500">
                Test user authentication flows with protected routes and
                role-based access control.
              </p>
            </CardBody>
          </Card>
          <Card role="listitem" aria-labelledby="api-feature-title">
            <CardBody className="text-center">
              <h3 className="text-xl font-bold mb-2" id="api-feature-title">
                API Integration
              </h3>
              <p className="text-default-500">
                Explore API interactions with both public and protected
                endpoints.
              </p>
            </CardBody>
          </Card>
          <Card role="listitem" aria-labelledby="dynamic-feature-title">
            <CardBody className="text-center">
              <h3 className="text-xl font-bold mb-2" id="dynamic-feature-title">
                Dynamic Content
              </h3>
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
