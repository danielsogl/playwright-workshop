import test from "@playwright/test";


test.describe("Public News Tests", {
  tag: ["@public", "@news"]
}, () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("https://playwright.dev");
  });


  test.describe("Search Filter Tests", () => {
    test.beforeEach(async ({ page }) => {
      await page.goto("https://playwright.dev");
    });
  });

  test.describe("Category Filter Tests", () => { });

  test.describe("Count News Tests", () => { });
});