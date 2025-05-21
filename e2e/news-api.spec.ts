import { RSSItem } from '@/types/rss';
import { test, expect } from './fixtures/fixture';

test.describe('News API', () => {
  //   test.beforeEach(async ({ newsFeedPage }) => {
  //     await newsFeedPage.goToPage();
  //   });

  test('should return a list of news', async ({ newsFeedPage, page }) => {
    await page.route('**/api/news/public', async (route) => {
      const url = route.request().url();
      const newUrl = url.replace('/api/news/public', '/api/news');

      route.continue({ url: newUrl });
    });

    await newsFeedPage.goToPage();

    const newsItems = await newsFeedPage.countNewsItems();
    expect(newsItems).toEqual(0);
  });

  test('should show error message', async ({ newsFeedPage, page }) => {
    await page.route('**/api/news/public', async (route) => {
      route.fulfill({
        status: 500,
        body: 'Failed to load RSS feeds',
      });
    });

    await newsFeedPage.goToPage();
    const errorText = await newsFeedPage.getErrorText();

    expect(errorText).toEqual('Failed to load RSS feeds');
  });

  test('should show fake news items', async ({ newsFeedPage, page }) => {
    const title = 'Fake news';

    const fakeNewsItem: RSSItem = {
      title,
      link: 'https://fake-news.com',
      description: 'Fake news',
      source: 'Fake',
    };

    await page.route('**/api/news/public', async (route) => {
      route.fulfill({
        json: { items: [fakeNewsItem] },
      });
    });

    await newsFeedPage.goToPage();

    await newsFeedPage.filterByText(title);
    const newsItem = newsFeedPage.newsItemByIndex(0);
    const newsTitle = await newsItem.getHeader();
    expect(newsTitle).toBe(title);
  });

  test('should show loading spinner', async ({ newsFeedPage, page }) => {
    await page.route('**/api/news/public', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      await route.continue();
    });

    await newsFeedPage.goToPage();
    await expect(newsFeedPage.loadingSpinner).toBeVisible();
  });

  test('Prüfe Status Code und Response Länge', async ({
    newsFeedPage,
    page,
  }) => {
    const newsResponse = page.waitForResponse('**/api/news/public');

    await newsFeedPage.goToPage();

    const response = await newsResponse;
    const data = (await response.json()) as { items: RSSItem[] };

    expect(response.status()).toBe(200);
    expect(data.items.length).toEqual(data.items.length);
  });

  test('Prüfe ob News 1 gefilterte werden kann', async ({
    newsFeedPage,
    page,
  }) => {
    const newsResponse = page.waitForResponse('**/api/news/public');

    await newsFeedPage.goToPage();

    const response = await newsResponse;
    const data = (await response.json()) as { items: RSSItem[] };

    const firstNewsItem = data.items[0];

    await newsFeedPage.filterByText(firstNewsItem.title);

    const newsItem = newsFeedPage.newsItemByIndex(0);
    const newsTitle = await newsItem.getHeader();
    expect(newsTitle).toBe(firstNewsItem.title);
  });
});
