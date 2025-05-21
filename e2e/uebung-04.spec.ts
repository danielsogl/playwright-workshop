import { expect, test } from './fixtures/fixture';
import { NewsCategory } from './pom/news-feed.pom';

test.describe('News Feed POM', () => {
  test.beforeEach(async ({ newsFeedPage }) => {
    await newsFeedPage.goToPage();
  });

  test('should filter news by Title', async ({ newsFeedPage }) => {
    const title = "Cheers stars pay tribute to 'Norm' actor George Wendt";

    await newsFeedPage.filterByText(title);
    const newsItem = newsFeedPage.newsItemByIndex(0);
    const newsTitle = await newsItem.getHeader();

    expect(newsTitle).toBe(title);
  });

  test('should filter news by Category', async ({ newsFeedPage }) => {
    await newsFeedPage.filterByCategory('World News');

    const count = await newsFeedPage.countNewsItems();
    expect(count).toBe(35);
  });

  (
    [
      { category: 'Technology', expected: 20 },
      { category: 'Business', expected: 0 },
      { category: 'World News', expected: 35 },
    ] as { category: NewsCategory; expected: number }[]
  ).forEach(({ category, expected }) => {
    test(`Filter by ${category}`, async ({ newsFeedPage }) => {
      await newsFeedPage.filterByCategory(category as NewsCategory);

      const count = await newsFeedPage.countNewsItems();
      expect(count).toBe(expected);
    });
  });
});
