// import { test as setup, expect } from '@playwright/test';
import { test as setup } from './fixtures/base.fixture';
import path from 'path';

const authFile = path.join(path.dirname(new URL(import.meta.url).pathname), '../playwright/.auth/user.json');

setup('authenticate', { tag: ['@fixture'] }, async ({ page, testUser, loginPage, sharedDB }) => {
  const { email, password } = testUser;
  await loginPage.login(email, password);

  console.log(`Shared database is ready: ${sharedDB}`);

  await page.context().storageState({ path: authFile });
});

setup('authenticate again', { tag: ['@fixture'] }, async ({ testUser, loginPage, sharedDB }) => {
  const { email, password } = testUser;
  await loginPage.login(email, password);
  console.log(`Shared database is ready: ${sharedDB}`);
  // await page.context().storageState({ path: authFile });
});
