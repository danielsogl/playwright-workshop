import { expect, test } from "@/e2e/fixtures/base.fixture";
import type { RSSFeedResponse } from "@/types/rss";

test.describe("API Mocking", () => {
  test("should handle fake api endpoint", async ({ publicNewsPage, page }) => {
    await page.route("/api/news/public", (route) => {
      console.log(route.request().url());

      const newUrl = route.request().url().replace("/api/news/public", "/api-mock");

      route.continue({ url: newUrl });
    });
    await publicNewsPage.navigateTo();

    await expect(publicNewsPage.errorAlert).toContainText("Failed to load RSS feeds");
  });

  test("should handle API errors", async ({ publicNewsPage, page }) => {
    await page.route("/api/news/public", (route) => {
      console.log(route.request().url());

      route.fulfill({
        status: 500,
        json: { message: "Internal Server Error" },
      });
    });
    await publicNewsPage.navigateTo();

    await expect(publicNewsPage.errorAlert).toContainText("Failed to load RSS feeds");
  });


  test("should handle empty list", async ({ publicNewsPage, page }) => {
    await page.route("/api/news/public", (route) => {
      console.log(route.request().url());

      route.fulfill({
        status: 200,
        json: { items: [] } satisfies RSSFeedResponse,
      });
    });
    await publicNewsPage.navigateTo();

    await expect(page.getByText('0 articles found')).toBeVisible();
  });

  test("should handle slow responses", async ({ publicNewsPage, page }) => {
    await page.route("/api/news/public", async (route) => {
      console.log(route.request().url());

      await new Promise((resolve) => setTimeout(resolve, 2000));


      route.fulfill({
        status: 200,
        json: { items: [] } satisfies RSSFeedResponse,
      });
    });
    await publicNewsPage.navigateTo();

    await expect(page.getByText('0 articles found')).toBeVisible();
    await expect(publicNewsPage.loading).toBeVisible();
  });

  test("should render the exact number of articles", async ({ publicNewsPage, page }) => {
    const newsResponsePromise = page.waitForResponse("/api/news/public", { timeout: 50_000 });

    await publicNewsPage.navigateTo();
    const newsResponse = await newsResponsePromise;
    const newsData = await newsResponse.json() as RSSFeedResponse;
    const newsCount = newsData.items.length;

    await expect(page.getByText(`${newsCount} articles found`)).toBeVisible();
    await expect(publicNewsPage.items()).toHaveCount(newsCount);
    expect(newsResponse.status()).toBe(200);
  });
});
