import { test as base, expect, type Page } from '@playwright/test';

/**
 * Auth-Fixture zu Übung 8 – kapselt den API-Login aus Übung 7 (CSRF → credentials).
 *
 * Wiederverwendet in Übung 17 (Capstone). Der Login läuft über `page.request`,
 * damit der Session-Cookie mit dem Browser-Context der Page geteilt wird
 * (dieselbe Technik wie in Übung 13).
 */
export async function loginViaApi(page: Page): Promise<void> {
  const api = page.request;

  const csrf = await api.get('/api/auth/csrf');
  const { csrfToken } = await csrf.json();

  const login = await api.post('/api/auth/callback/credentials', {
    form: {
      email: process.env.TEST_USER_EMAIL || 'test@example.com',
      password: process.env.TEST_USER_PASSWORD || 'password',
      csrfToken,
      callbackUrl: '/',
      json: 'true',
    },
  });
  expect([200, 302]).toContain(login.status());

  // Session verifizieren, damit die Fixture früh und deutlich fehlschlägt.
  const session = await api.get('/api/auth/session');
  const sessionData = await session.json();
  expect(sessionData.user?.email).toBe(
    process.env.TEST_USER_EMAIL || 'test@example.com',
  );
}

interface AuthFixtures {
  authenticatedPage: Page;
}

/**
 * `test` mit einer `authenticatedPage`-Fixture: eine bereits eingeloggte Page.
 * Import: `import { test, expect } from './fixtures/auth.fixture';`
 */
export const test = base.extend<AuthFixtures>({
  authenticatedPage: async ({ page }, use) => {
    await loginViaApi(page);
    await use(page);
  },
});

export { expect };
