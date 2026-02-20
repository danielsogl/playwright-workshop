import { test as base, expect } from '@playwright/test';

// Simple fixture for test data
const test = base.extend<{
  testUser: { name: string; email: string; role: string };
}>({
  testUser: async ({}, use) => {
    // Setup: Create unique test data
    const userData = {
      name: `Test User ${Date.now()}`,
      email: `test-${Date.now()}@example.com`,
      role: 'user',
    };

    console.log('✅ Test user data prepared:', userData.name);

    // Provide fixture
    await use(userData);

    // Teardown (optional here)
    console.log('🧹 Test user data cleanup completed');
  },
});

test.describe('Fixtures Demo - Basic Tests', () => {
  test('fügt einen Benutzer mit Fixture-Daten hinzu', async ({
    page,
    testUser,
  }) => {
    await page.goto('/fixtures-demo');

    // Use fixture data with semantic locators
    await page.getByLabel('Name').fill(testUser.name);
    await page.getByLabel('Email').fill(testUser.email);
    await page.getByLabel('Role').selectOption(testUser.role);

    await page.getByRole('button', { name: /add user|update user/i }).click();

    // Check that user was added
    await expect(page.getByText(testUser.name)).toBeVisible();
    await expect(page.getByText(/3 users/)).toBeVisible();
  });
});

// Extended fixtures with page helpers
interface FixturesDemo {
  testUser: { name: string; email: string; role: string };
  userPage: {
    addUser: (user: {
      name: string;
      email: string;
      role: string;
    }) => Promise<void>;
    getUserCount: () => Promise<number>;
  };
}

const testWithHelpers = base.extend<FixturesDemo>({
  testUser: async ({}, use) => {
    const userData = {
      name: `Test User ${Date.now()}`,
      email: `test-${Date.now()}@example.com`,
      role: 'moderator',
    };
    await use(userData);
  },

  userPage: async ({ page }, use) => {
    // Navigate to the fixtures demo page
    await page.goto('/fixtures-demo');

    // Wait for page to be fully loaded
    await expect(page.getByText(/\d+ users/)).toBeVisible();

    const userPage = {
      addUser: async (user: { name: string; email: string; role: string }) => {
        await page.getByLabel('Name').fill(user.name);
        await page.getByLabel('Email').fill(user.email);
        await page.getByLabel('Role').selectOption(user.role);
        await page
          .getByRole('button', { name: /add user|update user/i })
          .click();

        // Wait until user is added
        await expect(page.getByText(user.name)).toBeVisible();
      },

      getUserCount: async () => {
        // Make sure the count is visible and has proper content (not "0 users")
        const countElement = page.getByText(/\d+ users/);
        await expect(countElement).toBeVisible();

        // Wait until the count shows at least 1 user (the initial demo data)
        await expect(countElement).toContainText(/[1-9]\d* users/);

        const countText = await countElement.textContent();
        const match = countText?.match(/(\d+)/);
        return match ? parseInt(match[1]) : 2;
      },
    };

    await use(userPage);
  },
});

testWithHelpers.describe('Fixtures Demo - With Helpers', () => {
  testWithHelpers(
    'verwendet Page Helper Fixture',
    async ({ testUser, userPage }) => {
      const initialCount = await userPage.getUserCount();

      await userPage.addUser(testUser);

      const finalCount = await userPage.getUserCount();
      expect(finalCount).toBe(initialCount + 1);
    },
  );

  testWithHelpers('fügt mehrere Benutzer hinzu', async ({ userPage }) => {
    const user1 = {
      name: 'Alice Test',
      email: 'alice@test.com',
      role: 'admin',
    };
    const user2 = { name: 'Bob Test', email: 'bob@test.com', role: 'user' };

    const initialCount = await userPage.getUserCount();

    await userPage.addUser(user1);
    await userPage.addUser(user2);

    const finalCount = await userPage.getUserCount();
    expect(finalCount).toBe(initialCount + 2);
  });
});

export { test, testWithHelpers };
