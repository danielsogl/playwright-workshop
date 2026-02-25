import { test as base } from '@playwright/test';

export const test = base.extend<{ loginUser: (username: string, password: string) => Promise<void> }>({
  loginUser: async ({ page }, use) => {

    const loginPage = {
      async login(username: string, password: string) {
        await page.goto("/auth/signin");

        await page.getByLabel("Email").fill(username);
        await page.getByLabel("Password").fill(password);
        await page.getByRole("button", { name: "Submit sign in form" }).click();

        await page.waitForURL("/");
      }
    }

    await use(loginPage.login);
  }
});