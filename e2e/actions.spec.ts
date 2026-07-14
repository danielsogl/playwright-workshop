import { test, expect } from "./fixtures/base.fixture"


test.describe("Actions", () => {
  test.beforeEach(async ({ publicNewsPage }) => {
    await publicNewsPage.navigateTo();
  });

  test('should filter news by text "Trump"', async ({ publicNewsPage }) => {
    await publicNewsPage.search("Trump");
    const resultsText = await publicNewsPage.resultsText();

    const newsItemsCount = await publicNewsPage.items().count();
    const newsItemWithTrump = await publicNewsPage.item(0).title();

    expect(resultsText).toContain("articles found");
    expect(newsItemsCount).toBeGreaterThan(0);
    expect(newsItemWithTrump).toContain("Trump");
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
