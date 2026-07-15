import { expect, test } from "@/e2e/fixtures/base.fixture";

test.describe("Visual Regression Tests", { tag: '@visual' }, () => {
  test("landing page should match the baseline snapshot", async ({ page }) => {
    await page.goto("/");
    expect(await page.screenshot({
      mask: [
        page.getByRole('button', { name: 'Open Next.js Dev Tools' })
      ],
      maskColor: '#ffbbcc',
      animations: 'disabled'
    })).toMatchSnapshot();
  });
});
