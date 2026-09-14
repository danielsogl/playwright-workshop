import { test, expect } from '@playwright/test';

// Musterlösung zu Übung 3 – Interaktionen in der Feed App
test.describe('Übung 3 - Interaktionen', () => {
  test('Theme umschalten', async ({ page }) => {
    await page.goto('/');

    // Den Toggle gibt es für Desktop und Mobile, visible() nimmt nur den sichtbaren
    const themeToggle = page
      .getByRole('switch', { name: /dark|light/i })
      .visible();

    const htmlElement = page.locator('html');
    const initialTheme = (await htmlElement.getAttribute('class')) || '';

    await themeToggle.click();
    await expect(htmlElement).not.toHaveClass(initialTheme);

    await themeToggle.click();
    await expect(htmlElement).toHaveClass(initialTheme);
  });

  test('Suche mit Tastatur bedienen', async ({ page }) => {
    await page.goto('/news/public');

    const results = page.getByRole('article');
    await expect(results.first()).toBeVisible();
    const initialCount = await results.count();

    // Klick auf die Überschrift setzt den Startpunkt der Tab-Navigation direkt vor das Suchfeld
    await page.getByRole('heading', { name: 'News Feed' }).click();
    await page.keyboard.press('Tab');

    const searchInput = page.getByRole('textbox', {
      name: 'Search news articles',
    });
    await expect(searchInput).toBeFocused();

    await searchInput.pressSequentially('Playwright');
    await page.keyboard.press('Enter');

    await expect(results).not.toHaveCount(initialCount);
  });

  test('News nach Kategorie filtern', async ({ page }) => {
    await page.goto('/news/public');

    const articles = page
      .getByRole('feed', { name: 'News articles' })
      .getByRole('article');

    // Offline-Feed (RSS_OFFLINE_MODE=true): 20 Artikel, davon 5 in "Business"
    await expect(articles).toHaveCount(20);

    await page
      .getByRole('combobox', { name: 'Filter news by category' })
      .selectOption('Business');

    await expect(
      page.getByText('5 articles found', { exact: true }),
    ).toBeVisible();
    await expect(articles).toHaveCount(5);
  });

  test('Login Formular Validierung', async ({ page }) => {
    await page.goto('/auth/signin');

    const emailInput = page.getByLabel('Email');
    const passwordInput = page.getByLabel('Password');
    const submitButton = page.getByRole('button', {
      name: 'Submit sign in form',
    });

    // Leeres Formular: wir bleiben auf der Login-Seite
    await submitButton.click();
    await expect(page).toHaveURL('/auth/signin');

    // Nur Email: Passwort fehlt, wir bleiben auf der Login-Seite
    await emailInput.fill('test@example.com');
    await submitButton.click();
    await expect(page).toHaveURL('/auth/signin');

    // Falsches Passwort (per Text, denn auch der Next.js Route Announcer hat role="alert")
    await passwordInput.fill('wrongpassword');
    await submitButton.click();
    await expect(
      page.getByRole('alert').filter({ hasText: 'Invalid email or password' }),
    ).toBeVisible();

    // Korrekte Daten des Test-Users aus der .env
    await emailInput.fill(process.env.TEST_USER_EMAIL ?? 'test@example.com');
    await passwordInput.fill(process.env.TEST_USER_PASSWORD ?? 'password');
    await submitButton.click();
    await expect(page).not.toHaveURL('/auth/signin');
  });
});
