import { test, expect } from "@playwright/test";


test.describe("Login Page", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  // login flow tests
  test.describe("Login Flow", () => {

    test.beforeEach(async ({ page }) => {
      await page.goto("/login")
    });

    test("Login with valid credentials", async ({ page }) => {
      await page.getByLabel("Username").fill("testuser");
      await page.getByLabel("Password").fill("password123");
      await page.getByRole("button", { name: "Login" }).click();
      await expect(page).toHaveURL("BASE_URL/dashboard");
    });

    test("Login with invalid credentials", async ({ page }) => {
      await page.getByLabel("Username").fill("invaliduser");
      await page.getByLabel("Password").fill("wrongpassword");
      await page.getByRole("button", { name: "Login" }).click();
      await expect(page.getByText("Invalid username or password")).toBeVisible();
    });
  });

  // login page navigation tests
  test.describe("Login Page Navigation", () => { });
});
