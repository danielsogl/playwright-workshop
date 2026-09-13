---
applyTo: "**/*.spec.ts,**/e2e/**,**/playwright.config.ts"
---

# Playwright Testing Guidelines

## General Principles

- **Test User-Visible Behavior:** Focus tests on how users interact with your application, not on internal implementation details. The end user will see or interact with what is rendered on the page, so your test should typically only see/interact with the same rendered output.
- **Isolate Tests:** Each test should be completely isolated from another test and should run independently with its own local storage, session storage, data, cookies etc. Test isolation improves reproducibility, makes debugging easier and prevents cascading test failures.
- **Avoid Testing Third-Party Dependencies:** Only test what you control. Don't try to test links to external sites or third party servers. Use Playwright's Network API to mock responses instead.

## Code Organization and Structure

- **Directory Structure:**
  - `e2e/<domain>/**`: Contains all e2e test files in sub folders named by domains
  - `e2e/utils/`: Helper functions and page object models
- **File Naming Conventions:**
  - Use `.spec.ts` for test files (e.g., `login.spec.ts`)
  - Group related tests in the same file
- **Module Organization:**
  - Employ Page Object Model (POM) to encapsulate UI elements and interactions

## Locators and Selectors

- **Use Playwright's Built-in Locators:** They provide auto-waiting and retry-ability, making tests more resilient
- **Prefer User-Facing Attributes:** Use role-based and accessible name locators over XPath or CSS selectors
- **Avoid Brittle Selectors:** Never use long CSS chains or XPath based on DOM structure

```typescript
// Preferred - User-facing locators
page.getByRole('button', { name: 'Submit' });
page.getByLabel('Email');
page.getByPlaceholder('Enter your name');
page.getByTestId('submit-button');
page.getByText('Welcome');

// Avoid - Brittle selectors
page.locator('#tsf > div:nth-child(2) > div.A8SBwf > input');
page.locator('//button[@class="btn-primary"]');
```

## Page Object Model Pattern

```typescript
import type { Page, Locator } from '@playwright/test';

export class LoginPage {
  private readonly emailInput: Locator;
  private readonly passwordInput: Locator;
  private readonly submitButton: Locator;

  constructor(public readonly page: Page) {
    this.emailInput = this.page.getByLabel('Email');
    this.passwordInput = this.page.getByLabel('Password');
    this.submitButton = this.page.getByRole('button', { name: 'Sign in' });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

## Custom Fixtures

```typescript
import { test as base } from '@playwright/test';
import { LoginPage } from './login-page';

type MyFixtures = {
  loginPage: LoginPage;
};

export const test = base.extend<MyFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
});

export { expect } from '@playwright/test';
```

## Assertions

- **Use Web-First Assertions:** They auto-wait and retry until conditions are met
- **Use Custom Messages:** For better error context in reports
- **Use Soft Assertions:** For non-critical checks that shouldn't fail the test immediately

```typescript
// Web-first assertions (auto-waiting)
await expect(page.getByRole('heading')).toBeVisible();
await expect(page.getByRole('button')).toBeEnabled();
await expect(page.locator('.status')).toHaveText('Success');

// Custom message for clarity
await expect(page.getByText('Welcome'), 'User should be logged in').toBeVisible();

// Soft assertions for non-critical checks
await expect.soft(page.locator('.notification')).toBeVisible();

// Configured expect with custom timeout
const slowExpect = expect.configure({ timeout: 10000 });
await slowExpect(page.locator('.loading')).toBeHidden();
```

## API Mocking

```typescript
// Mock API responses
await page.route('**/api/users', async (route) => {
  await route.fulfill({
    status: 200,
    json: [{ id: 1, name: 'John' }],
  });
});

// Intercept and modify responses
await page.route('**/api/data', async (route) => {
  const response = await route.fetch();
  const json = await response.json();
  json.modified = true;
  await route.fulfill({ response, json });
});
```

## Configuration Best Practices

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    video: 'on',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Test Hooks

```typescript
import { test } from '@playwright/test';

test.describe('Authentication', () => {
  test.beforeEach(async ({ page }) => {
    // Runs before each test - setup
    await page.goto('/login');
  });

  test.afterEach(async ({ page }) => {
    // Runs after each test - cleanup
    await page.evaluate(() => localStorage.clear());
  });

  test('should login successfully', async ({ page }) => {
    // Test implementation
  });
});
```

## Authentication Handling

```typescript
// Save authentication state
import { test as setup } from '@playwright/test';

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('user@example.com');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Sign in' }).click();

  await page.waitForURL('/dashboard');
  await page.context().storageState({ path: 'playwright/.auth/user.json' });
});

// Use authentication state in tests
export const test = base.extend({
  storageState: 'playwright/.auth/user.json',
});
```

## Debugging

- Use `await page.pause()` to pause test execution and inspect
- Use Playwright Inspector: `npx playwright test --ui`
- Use trace viewer for failed tests: `npx playwright show-trace trace.zip`
- Add `console.log` for debugging specific values

## Anti-patterns to Avoid

- Hardcoding URLs instead of using `baseURL`
- Using XPath or complex CSS selectors
- Writing tests that depend on each other
- Not using auto-waiting features
- Using explicit waits (`waitForTimeout`) when not necessary
- Testing third-party dependencies
- Using `page.evaluate` when locators would work
- Not cleaning up test data after tests

## Performance Tips

- Run tests in parallel with `fullyParallel: true`
- Use `reuseExistingServer: true` during development
- Share authentication state across tests
- Use `test.describe.configure({ mode: 'parallel' })` for independent test groups
- Minimize unnecessary navigation between tests
