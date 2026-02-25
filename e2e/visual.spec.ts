import test, { expect } from "@playwright/test";

test.describe('Visually Regression', { tag: ['@visual'] }, () => {
  test('welcome page should look as it should', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveScreenshot({
      animations: 'disabled',
      mask: [
        page.getByRole('button', { name: 'Open Next.js Dev Tools' }),
        page.getByRole('link', { name: 'Navigate to public news page' }),
      ],
    });
  });

  test('welcome text should match snapshot', async ({ page }) => {
    await page.goto('/');
    const welcomeText = await page.locator('#hero-title').textContent();
    expect(welcomeText).toMatchSnapshot('hero-title-snapshot.txt');
  });

  // test('welcome page should look as it should', async ({ page }) => {
  //   const dataResponse = page.waitForResponse('**/api/stats');
  //   await page.goto('/');

  //   const data = (await dataResponse).json();

  //   for (const item of data) {
  //     // screenshot 

  //     // klicke auf next
  //   }
  // });
});