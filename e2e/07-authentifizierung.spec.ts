import { test, expect, type Page } from '@playwright/test';

// Zustände, die das Setup-Projekt (e2e/auth.setup.ts) erzeugt
const userAuthFile = 'playwright/.auth/user.json';
const adminAuthFile = 'playwright/.auth/admin.json';

// Liest die Session über die API aus
async function validateSession(page: Page) {
  const response = await page.request.get('/api/auth/session');
  await expect(response).toBeOK();
  const session = await response.json();
  return session?.user;
}

test.describe('Übung 7: Tests mit gespeichertem Login', () => {
  // Jeder Test lädt den Zustand frisch aus user.json, ohne eigenen Login
  test.use({ storageState: userAuthFile });

  test('zeigt die privaten News-Feeds', async ({ page }) => {
    await page.goto('/news/private');

    await expect(
      page.getByRole('heading', { name: 'Your Private News Feeds' }),
    ).toBeVisible();
    await expect(
      page.getByRole('list', { name: 'Your RSS feeds' }),
    ).toBeVisible();
  });

  test('kann auf Settings zugreifen', async ({ page }) => {
    await page.goto('/settings');

    // Keine Umleitung zur Login-Seite
    await expect(page).not.toHaveURL(/auth\/signin/);
    await expect(page).toHaveURL(/\/settings/);
  });

  test('zeigt Benutzerinformationen an', async ({ page }) => {
    await page.goto('/');

    const userMenuButton = page.getByRole('button', {
      name: /user profile actions menu/i,
    });
    await expect(userMenuButton).toBeVisible();
    await userMenuButton.click();

    await expect(
      page.getByText(process.env.TEST_USER_EMAIL || 'test@example.com'),
    ).toBeVisible();
  });

  test('Session bleibt über Seiten-Reload erhalten', async ({ page }) => {
    await page.goto('/');
    expect(await validateSession(page)).toBeTruthy();

    await page.reload();
    expect(await validateSession(page)).toBeTruthy();
  });

  test('kann sich abmelden', async ({ page }) => {
    await page.goto('/');

    await page
      .getByRole('button', { name: /user profile actions menu/i })
      .click();
    await page.getByRole('menuitem', { name: /log out/i }).click();

    // Umleitung zur Homepage, der Sign-In-Link ist wieder sichtbar
    await page.waitForURL((url) => url.pathname === '/');
    await expect(
      page.getByRole('link', { name: /sign in to your account/i }),
    ).toBeVisible();
  });
});

// Bonus B: Multi-Role-Testing
test.describe('Admin-spezifische Tests', () => {
  test.use({ storageState: adminAuthFile });

  test('ist als Admin angemeldet', async ({ page }) => {
    await page.goto('/');

    await page
      .getByRole('button', { name: /user profile actions menu/i })
      .click();
    await expect(page.getByText('admin@example.com')).toBeVisible();
  });
});
