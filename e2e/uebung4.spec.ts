import test, { expect } from "@playwright/test";


test("Should show a list of news", async ({ page }) => {
  await page.goto("/news/public");


  const newsList = page.getByRole("list", { name: "News articles" });
  const newsItems = newsList.getByRole("listitem");

  const count = await newsItems.count();
  console.log(`Found ${count} news articles.`);
  expect(count).toBe(count);
  await expect(page.getByText(`${count} articles found`)).toBeVisible();
});