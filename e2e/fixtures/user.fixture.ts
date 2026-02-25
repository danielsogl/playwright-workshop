import { test as base } from '@playwright/test';

export const test = base.extend<{ testUser: { username: string; password: string } }>({
  testUser: async ({ }, use) => {
    const username = process.env.TEST_USERNAME || '';
    const password = process.env.TEST_PASSWORD || '';

    await use({ username, password });

    // clean up
    console.log("Cleaning up test user session...");
  }
});