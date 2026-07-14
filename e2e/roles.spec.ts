import { test, expect } from './fixtures/base.fixture';

// Kein Auth-State: der Default-`page` ist nicht eingeloggt.
test('anonym: sieht den Sign-In-Link', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible();
});

// Eingeloggt als normaler User.
test('user: sieht das Profilmenü', async ({ userPage }) => {
  await userPage.goto('/');
  await expect(
    userPage.getByRole('button', { name: 'User profile actions menu' }),
  ).toBeVisible();
});

// Eingeloggt als Admin.
test('admin: sieht das Profilmenü', async ({ adminPage }) => {
  await adminPage.goto('/');
  await expect(
    adminPage.getByRole('button', { name: 'User profile actions menu' }),
  ).toBeVisible();
});
