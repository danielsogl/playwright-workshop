import test from "@playwright/test";


test.describe("Actions", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/news/public');
  });

  test("should filter news by text", async ({ page }) => {
    const searchInput = page.getByRole('textbox', { name: 'Search news articles' });
    const categorySelect = page.getByRole('combobox', { name: 'Filter news by category' });
    const newsFeed = page.getByRole('feed', { name: 'News articles' });


    await searchInput.fill('Trump', { timeout: 50_000 });
    await searchInput.clear();

    const newsItems = await newsFeed.getByRole('article').count();
    console.log(`Number of news items after filtering by text: ${newsItems}`);
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
