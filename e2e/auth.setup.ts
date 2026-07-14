// import { test as setup, expect } from '@playwright/test';
import { test as setup } from './fixtures/base.fixture';
import path from 'path';

const authDir = path.join(import.meta.dirname, '../../playwright/.auth');

setup('authenticate user', { tag: ['@fixture'] }, async ({ page, testUser, loginPage }) => {
  const { email, password } = testUser;
  await loginPage.login(email, password);
  await page.context().storageState({ path: path.join(authDir, 'user.json') });
});

setup('authenticate admin', { tag: ['@fixture'] }, async ({ page, loginPage }) => {
  const email = process.env.TEST_ADMIN_EMAIL || '';
  const password = process.env.TEST_ADMIN_PASSWORD || '';

  await loginPage.login(email, password);
  await page.context().storageState({ path: path.join(authDir, 'admin.json') });

});
