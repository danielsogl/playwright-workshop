import { test } from "@/e2e/fixtures/base.fixture";

const breakpoints = {
  xs: { width: 320, height: 568 }, // iPhone SE
  sm: { width: 375, height: 667 }, // iPhone 8
  md: { width: 768, height: 1024 }, // iPad
  lg: { width: 1024, height: 768 }, // iPad Landscape
  xl: { width: 1280, height: 800 }, // Desktop
  xxl: { width: 1920, height: 1080 }, // Large Desktop
};


test.describe("Mobile Tests", () => {
  test("should work on mobile iPhone", async ({ page }) => {
    await page.goto("/");
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole('button', { name: 'Open Next.js Dev Tools' }).click();
    await page.getByRole('button', { name: 'Close Next.js Dev Tools' }).click();
  });

  // Tests für alle Breakpoints
  for (const [name, viewport] of Object.entries(breakpoints)) {
    test(`Navigation auf ${name} Breakpoint`, async ({ page }) => {
      await page.setViewportSize(viewport);
      await page.goto("/");

      await page.getByRole('button', { name: 'Open Next.js Dev Tools' }).click();
      await page.getByRole('button', { name: 'Close Next.js Dev Tools' }).click();
    });
  }
});
