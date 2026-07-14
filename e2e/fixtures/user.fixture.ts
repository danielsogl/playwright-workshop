import { test as base } from '@playwright/test';

interface Fixtures {
  testUser: { email: string, password: string }
}

export interface UserOptions {
  user: 'user' | 'admin';
}

export const userFixture = base.extend<Fixtures & UserOptions>({
  user: ['user', { option: true }],
  testUser: async ({ user }, use) => {
    const email = user === 'admin' ? process.env.TEST_ADMIN_EMAIL || '' : process.env.TEST_USER_EMAIL || '';
    const password = user === 'admin' ? process.env.TEST_ADMIN_PASSWORD || '' : process.env.TEST_USER_PASSWORD || '';

    console.log(`Using test user: ${email}`);

    await use({ email, password });

    console.log(`Finished using test user: ${email}`);
  }
});
