import { test as base, Locator } from '@playwright/test';

interface LoginPageFixtures {
  emailField: Locator;
  passwordField: Locator;
  loginButton: Locator;
  testUsers: {
    user1: {
      email: string;
      password: string;
    };
    user2: {
      email: string;
      password: string;
    };
  };
}

export const test = base.extend<LoginPageFixtures>({
  emailField: async ({ page }, use) => {
    await use(page.getByLabel('Email'));
  },
  passwordField: async ({ page }, use) => {
    await use(page.getByLabel('Password'));
  },
  loginButton: async ({ page }, use) => {
    await use(page.getByRole('button', { name: 'Submit sign in form' }));
  },
  testUsers: async ({}, use) => {
    await use({
      user1: {
        email: process.env.TEST_USER || '',
        password: process.env.TEST_USER_PASSWORD || '',
      },
      user2: {
        email: process.env.TEST_USER_2 || '',
        password: process.env.TEST_USER_PASSWORD_2 || '',
      },
    });
  },
});

export const expect = test.expect;
