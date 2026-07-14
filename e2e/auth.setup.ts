import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(path.dirname(new URL(import.meta.url).pathname), '../playwright/.auth/user.json');

setup('authenticate', async ({ page }) => {
  await page.goto('/auth/signin');

  const email = process.env.TEST_USER_EMAIL || '';
  const password = process.env.TEST_USER_PASSWORD || '';

  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Submit sign in form' }).click();

  await page.waitForURL('/');
  await expect(page.getByRole('button', { name: 'User profile actions menu' })).toBeVisible();

  await page.context().storageState({ path: authFile });
});
