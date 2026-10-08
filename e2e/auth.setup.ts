import { test as setup, expect, type Page } from '@playwright/test';
import path from 'path';

const authDir = path.join(import.meta.dirname, '../playwright/.auth');
const userAuthFile = path.join(authDir, 'user.json');
const adminAuthFile = path.join(authDir, 'admin.json');
const userApiAuthFile = path.join(authDir, 'user-api.json');

const userMenu = (page: Page) =>
  page.getByRole('button', { name: /user profile actions menu/i });

// Auth.js setzt das CSRF-Cookie beim Laden der Session: erst danach einloggen.
async function loginViaUi(page: Page, email: string, password: string) {
  const sessionLoaded = page.waitForResponse('**/api/auth/session');
  await page.goto('/auth/signin');
  await sessionLoaded;

  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Submit sign in form' }).click();

  // Erfolgreiche Anmeldung: Umleitung zur Startseite
  await page.waitForURL('/');
}

setup('authenticate as user', async ({ page }) => {
  await loginViaUi(
    page,
    process.env.TEST_USER_EMAIL || 'test@example.com',
    process.env.TEST_USER_PASSWORD || 'password',
  );
  await expect(userMenu(page)).toBeVisible();
  await page.context().storageState({ path: userAuthFile });
});

// Bonus A: derselbe Login ohne Browser (CSRF-Token holen, Formular-POST)
setup('authenticate as user via API', async ({ request }) => {
  const email = process.env.TEST_USER_EMAIL || 'test@example.com';
  const { csrfToken } = await (await request.get('/api/auth/csrf')).json();

  const login = await request.post('/api/auth/callback/credentials', {
    form: {
      email,
      password: process.env.TEST_USER_PASSWORD || 'password',
      csrfToken,
    },
  });
  expect(login.ok()).toBeTruthy();

  const session = await (await request.get('/api/auth/session')).json();
  expect(session.user.email).toBe(email);

  await request.storageState({ path: userApiAuthFile });
});

// Bonus B: zweite Rolle (Seed-Daten in config/data.json)
setup('authenticate as admin', async ({ page }) => {
  await loginViaUi(page, 'admin@example.com', 'admin123');
  await expect(userMenu(page)).toBeVisible();
  await page.context().storageState({ path: adminAuthFile });
});
