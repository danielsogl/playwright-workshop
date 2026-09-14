import { test as setup, expect, Page } from '@playwright/test';
import path from 'path';

const authFile = path.join(
  import.meta.dirname,
  '../../playwright/.auth/user.json',
);

// Setup-Test für Authentifizierung
// Lock (seit 1.63): Setup und Consumer teilen sich user.json und laufen
// daher nie gleichzeitig – auch nicht über Worker hinweg.
setup.describe(
  'Exercise 7: Authentication Setup',
  { lock: 'user-auth-state' },
  () => {
    setup('authenticate as user', async ({ page }) => {
      // Use UI-Login for reliable authentication.
      // Auth.js setzt das CSRF-Cookie beim Laden der Session – erst danach einloggen.
      const sessionLoaded = page.waitForResponse('**/api/auth/session');
      await page.goto('/auth/signin');
      await sessionLoaded;

      // Fülle Login-Formular aus
      const emailInput = page.getByRole('textbox', {
        name: 'Email address for sign in',
      });
      const passwordInput = page.getByRole('textbox', {
        name: 'Password for sign in Password*',
      });
      const submitButton = page.getByRole('button', {
        name: 'Submit sign in form',
      });

      await emailInput.fill(process.env.TEST_USER_EMAIL || 'test@example.com');
      await passwordInput.fill(process.env.TEST_USER_PASSWORD || 'password');
      await submitButton.click();

      // Warte auf erfolgreiche Anmeldung (Umleitung zur Homepage)
      await page.waitForURL((url) => !url.pathname.includes('/auth/signin'));

      // Prüfe ob angemeldet - User Profile Menu sollte sichtbar sein
      const userMenu = page.getByRole('button', {
        name: /user profile actions menu/i,
      });
      await expect(userMenu).toBeVisible();

      // Speichere Storage State
      await page.context().storageState({ path: authFile });
      console.log('UI Authentication successful');
    });
  },
);

// Tests die Authentifizierung benötigen
import { test } from '@playwright/test';

// Liest die Session über die API aus
async function validateSession(page: Page) {
  const response = await page.request.get('/api/auth/session');
  await expect(response).toBeOK();
  const session = await response.json();
  return session?.user;
}

test.describe(
  'Exercise 7: Authenticated Tests',
  { lock: 'user-auth-state' },
  () => {
    // Use-Klausel lädt den gespeicherten Auth-State
    test.use({ storageState: authFile });

    test('kann auf private Inhalte zugreifen', async ({ page }) => {
      await page.goto('/');

      // Prüfe ob angemeldet - User Profile Menu sollte sichtbar sein
      const userMenu = page.getByRole('button', {
        name: /user profile actions menu/i,
      });
      await expect(userMenu).toBeVisible();

      // Navigiere zu geschütztem Bereich (Settings)
      await page.goto('/settings');

      // Sollte nicht zur Login-Seite umgeleitet werden
      await expect(page).not.toHaveURL(/auth\/signin/);

      // Settings-Seite sollte sichtbar sein - prüfe URL da Settings-Seite existiert
      await expect(page).toHaveURL(/\/settings/);
    });

    test('zeigt Benutzerinformationen an', async ({ page }) => {
      await page.goto('/');

      // Öffne User-Menü
      const userMenuButton = page.getByRole('button', {
        name: /user profile actions menu/i,
      });
      await expect(userMenuButton).toBeVisible();
      await userMenuButton.click();

      // Prüfe ob Email im Menü angezeigt wird
      const emailDisplay = page.getByText(
        process.env.TEST_USER_EMAIL || 'test@example.com',
      );
      await expect(emailDisplay).toBeVisible();
    });

    test('Session bleibt über Seiten-Reload erhalten', async ({ page }) => {
      await page.goto('/');
      expect(await validateSession(page)).toBeTruthy();

      await page.reload();
      expect(await validateSession(page)).toBeTruthy();
    });

    test('kann sich abmelden', async ({ page }) => {
      await page.goto('/');

      // Öffne User-Menü
      const userMenuButton = page.getByRole('button', {
        name: /user profile actions menu/i,
      });
      await expect(userMenuButton).toBeVisible();
      await userMenuButton.click();

      // Klicke auf Log Out
      const logOutButton = page.getByRole('menuitem', { name: /log out/i });
      await expect(logOutButton).toBeVisible();
      await logOutButton.click();

      // Warte auf Umleitung zur Homepage
      await page.waitForURL((url) => url.pathname === '/');

      // Prüfe ob abgemeldet - Sign In Link sollte wieder sichtbar sein
      const signInButton = page.getByRole('link', {
        name: /sign in to your account/i,
      });
      await expect(signInButton).toBeVisible();
    });
  },
);

// Multi-Role Testing
const adminAuthFile = path.join(
  import.meta.dirname,
  '../../playwright/.auth/admin.json',
);

setup(
  'authenticate as admin',
  { lock: 'admin-auth-state' },
  async ({ page }) => {
    const sessionLoaded = page.waitForResponse('**/api/auth/session');
    await page.goto('/auth/signin');
    await sessionLoaded;

    const emailInput = page.getByRole('textbox', {
      name: 'Email address for sign in',
    });
    const passwordInput = page.getByRole('textbox', {
      name: 'Password for sign in Password*',
    });
    const submitButton = page.getByRole('button', {
      name: 'Submit sign in form',
    });

    // Admin-Credentials (Seed-Daten in config/data.json)
    await emailInput.fill('admin@example.com');
    await passwordInput.fill('admin123');
    await submitButton.click();

    // Warte auf erfolgreiche Anmeldung
    await page.waitForURL((url) => !url.pathname.includes('/auth/signin'));
    await expect(
      page.getByRole('button', { name: /user profile actions menu/i }),
    ).toBeVisible();

    // Speichere Admin Storage State
    await page.context().storageState({ path: adminAuthFile });
  },
);

test.describe('Admin-specific Tests', { lock: 'admin-auth-state' }, () => {
  test.use({ storageState: adminAuthFile });

  test('ist als Admin angemeldet', async ({ page }) => {
    await page.goto('/');

    await page
      .getByRole('button', { name: /user profile actions menu/i })
      .click();
    await expect(page.getByText('admin@example.com')).toBeVisible();
  });
});
