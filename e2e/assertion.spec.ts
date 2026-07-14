import test, { expect } from "@playwright/test";


test.describe("Assertions", () => {
  // Arrange
  test.beforeEach(async ({ page }) => {
    await page.goto('/news/public');
    await expect(page).toHaveURL('/news/public');
    await expect(page).toHaveTitle('Playwright Demo App');
  });

  test("should filter news by text", async ({ page }) => {
    // Act
    const searchInput = page.getByRole('textbox', { name: 'Search news articles' });
    const categorySelect = page.getByRole('combobox', { name: 'Filter news by category' });
    const newsFeed = page.getByRole('feed', { name: 'News articles' });


    await searchInput.fill('Trump', { timeout: 50_000 });

    const newsItems = newsFeed.getByRole('article');

    const newsItemCount = await newsFeed.getByRole('article').count();
    console.log(`Number of news items after filtering by text: ${newsItemCount}`);

    const newsItemWithTrump = newsItems.filter({ hasText: 'Trump' });

    // Assert
    const expectSoft = expect.configure({ soft: true });
    expectSoft(newsItemCount).toBe(1000);
    await expectSoft(newsItems).toHaveCount(newsItemCount);
    await expectSoft(newsItems.first()).toContainText('Trump');
    await expectSoft(newsItemWithTrump).toBeVisible();
    expectSoft(newsItemCount).toBe(newsItemCount);
  });

  test("should filter news by category", async ({ page }) => {
    const searchInput = page.getByRole('textbox', { name: 'Search news articles' });
    const categorySelect = page.getByRole('combobox', { name: 'Filter news by category' });
    const newsFeed = page.getByRole('feed', { name: 'News articles' });

    await categorySelect.selectOption({ label: "Technology" });

    const newsItems = await newsFeed.getByRole('article').count();
    console.log(`Number of news items after filtering by category: ${newsItems}`);
  });
});
